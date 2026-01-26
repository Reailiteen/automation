"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VoiceInputProps {
  onTranscriptionComplete?: (text: string) => void;
  onError?: (error: string) => void;
  onProcessingStart?: () => void;
  className?: string;
  disabled?: boolean;
  autoStop?: boolean;
  silenceThreshold?: number; // ms of silence before auto-stop
  /** Smaller button and less chrome for inline use */
  compact?: boolean;
}

export function VoiceInput({
  onTranscriptionComplete,
  onError,
  onProcessingStart,
  className,
  disabled = false,
  autoStop = true,
  silenceThreshold = 30000, // 30 seconds of silence
  compact = false,
}: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const lastSoundTimeRef = useRef<number>(Date.now());
  const isRecordingRef = useRef<boolean>(false);
  const volumeThrottleRef = useRef(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      audioContextRef.current?.close();
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length === 0) {
          setIsRecording(false);
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm;codecs=opus",
        });

        await transcribeAudio(audioBlob);

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      isRecordingRef.current = true;
      lastSoundTimeRef.current = Date.now();

      if (autoStop) {
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        const analyser = audioContext.createAnalyser();
        analyserRef.current = analyser;
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkSilence = () => {
          if (!isRecordingRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

          if (average > 10) {
            lastSoundTimeRef.current = Date.now();
          }
          const timeSinceLastSound = Date.now() - lastSoundTimeRef.current;
          if (timeSinceLastSound > silenceThreshold) {
            stopRecording();
            audioContext.close();
            return;
          }

          volumeThrottleRef.current += 1;
          if (volumeThrottleRef.current % 3 === 0) {
            const normalized = Math.min(1, average / 80);
            setVolumeLevel(normalized);
          }
          requestAnimationFrame(checkSilence);
        };
        checkSilence();
      }
    } catch (err: any) {
      console.error('Error starting recording:', err);
      const errorMessage =
        err.name === "NotAllowedError"
          ? "Microphone access denied. Please allow microphone access in your browser settings."
          : err.name === "NotFoundError"
          ? "No microphone found. Please connect a microphone and try again."
          : "Failed to start recording. Please try again.";
      setError(errorMessage);
      onError?.(errorMessage);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecordingRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      isRecordingRef.current = false;
      setVolumeLevel(0);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    onProcessingStart?.();
    try {
      // Convert to a format Groq accepts (m4a or webm)
      // Groq accepts various formats, but we'll convert webm to a File-like object
      const formData = new FormData();
      
      // Create a File object from the Blob
      const audioFile = new File([audioBlob], "recording.webm", {
        type: "audio/webm;codecs=opus",
      });
      formData.append("file", audioFile);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Transcription failed");
      }

      const data = await response.json();
      const t = data?.text;
      if (typeof t === "string") onTranscriptionComplete?.(t);
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to transcribe audio. Please try again.";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || isProcessing) return;
    if (isRecording) stopRecording();
    else await startRecording();
  };

  const size = compact ? 40 : 64;
  const iconCls = compact ? "h-4 w-4" : "h-5 w-5";
  const iconClsLg = compact ? "h-4 w-4" : "h-6 w-6";

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {!isRecording && !isProcessing && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan-400 pointer-events-none"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ zIndex: 1 }}
          />
        )}
        {isRecording && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-500 pointer-events-none"
            animate={{
              scale: 1.15 + volumeLevel * 0.35,
              opacity: 0.5 + volumeLevel * 0.4,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ zIndex: 1 }}
          />
        )}

        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled || isProcessing}
          className={cn(
            "absolute inset-0 rounded-full transition-all bg-gray-800 border-2 flex items-center justify-center cursor-pointer",
            "border-cyan-400/50 hover:border-cyan-400",
            isRecording && "border-red-500",
            (disabled || isProcessing) && "opacity-50 cursor-not-allowed"
          )}
          style={{ zIndex: 10, width: size, height: size }}
        >
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader2 className={cn(iconCls, "animate-spin text-white")} />
              </motion.div>
            ) : isRecording ? (
              <motion.div
                key="recording"
                animate={{ scale: 1 + volumeLevel * 0.15 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <MicOff className={cn(iconCls, "text-white")} />
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Mic className={cn(iconClsLg, "text-white")} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-destructive text-destructive-foreground text-xs rounded-md whitespace-nowrap z-50"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {isRecording && !compact && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-xs text-gray-400 whitespace-nowrap"
        >
          Recording… Click to stop
        </motion.div>
      )}
    </div>
  );
}
