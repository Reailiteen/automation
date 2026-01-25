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
  autoStop?: boolean; // Auto-stop after silence
  silenceThreshold?: number; // Milliseconds of silence before auto-stop
}

export function VoiceInput({
  onTranscriptionComplete,
  onError,
  onProcessingStart,
  className,
  disabled = false,
  autoStop = true,
  silenceThreshold = 2000, // 2 seconds of silence
}: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSoundTimeRef = useRef<number>(Date.now());
  const isRecordingRef = useRef<boolean>(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      console.log('startRecording called');
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');
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
      console.log('MediaRecorder started');
      setIsRecording(true);
      isRecordingRef.current = true;
      lastSoundTimeRef.current = Date.now();

      // Set up audio level monitoring for auto-stop
      if (autoStop) {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkSilence = () => {
          if (!isRecordingRef.current) return;

          analyser.getByteFrequencyData(dataArray);
          const average =
            dataArray.reduce((a, b) => a + b) / dataArray.length;

          // If there's sound, reset the timer
          if (average > 10) {
            lastSoundTimeRef.current = Date.now();
            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
            }
          }

          // Check if we've been silent for too long
          const timeSinceLastSound = Date.now() - lastSoundTimeRef.current;
          if (timeSinceLastSound > silenceThreshold) {
            stopRecording();
            audioContext.close();
            return;
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
    console.log('stopRecording called, isRecording:', isRecordingRef.current);
    if (mediaRecorderRef.current && isRecordingRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      isRecordingRef.current = false;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
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
      onTranscriptionComplete?.(data.text);
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
    console.log('Voice input clicked, isRecording:', isRecording, 'disabled:', disabled, 'isProcessing:', isProcessing);
    
    if (disabled || isProcessing) {
      console.log('Button is disabled or processing, ignoring click');
      return;
    }
    
    if (isRecording) {
      console.log('Stopping recording...');
      stopRecording();
    } else {
      console.log('Starting recording...');
      await startRecording();
    }
  };

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div className="relative" style={{ width: '64px', height: '64px' }}>
        {/* Glowing outline effect - behind button */}
        {!isRecording && !isProcessing && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan-400 pointer-events-none"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ zIndex: 1 }}
          />
        )}
        
        {/* Recording indicator ring - behind button */}
        {isRecording && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-500 pointer-events-none"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 0.4, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ zIndex: 1 }}
          />
        )}

        {/* Button - on top, clickable */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled || isProcessing}
          className={cn(
            "absolute inset-0 h-16 w-16 rounded-full transition-all bg-gray-800 border-2 border-cyan-400/50 hover:border-cyan-400 flex items-center justify-center cursor-pointer",
            isRecording && "animate-pulse border-red-500",
            (disabled || isProcessing) && "opacity-50 cursor-not-allowed"
          )}
          style={{ zIndex: 10 }}
        >
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              </motion.div>
            ) : isRecording ? (
              <motion.div
                key="recording"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <MicOff className="h-5 w-5 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Mic className="h-6 w-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Error message */}
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

      {/* Recording status text */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-xs text-gray-400 whitespace-nowrap"
        >
          Recording... Click to stop
        </motion.div>
      )}
    </div>
  );
}
