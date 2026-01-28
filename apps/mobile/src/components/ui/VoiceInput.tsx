import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export interface VoiceInputProps {
  onTranscriptionComplete?: (text: string) => void;
  onError?: (error: string) => void;
  onProcessingStart?: () => void;
  disabled?: boolean;
  compact?: boolean;
}

export function VoiceInput({
  onTranscriptionComplete,
  onError,
  onProcessingStart,
  disabled = false,
  compact = false,
}: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      // Pulse animation for recording state
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setError(null);

      // Request permission
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        const errorMessage = 'Microphone access denied. Please enable it in settings.';
        setError(errorMessage);
        onError?.(errorMessage);
        return;
      }

      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
    } catch (err: any) {
      console.error('Error starting recording:', err);
      const errorMessage = 'Failed to start recording. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setIsRecording(false);
      setRecording(null);

      if (uri) {
        await transcribeAudio(uri);
      }
    } catch (err: any) {
      console.error('Error stopping recording:', err);
      const errorMessage = 'Failed to stop recording. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
      setIsRecording(false);
      setRecording(null);
    }
  };

  const transcribeAudio = async (uri: string) => {
    setIsProcessing(true);
    onProcessingStart?.();

    try {
      // Read the audio file
      const audioData = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Create form data
      const formData = new FormData();
      const audioBlob = {
        uri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any;
      formData.append('file', audioBlob);

      // Send to transcription API
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transcription failed');
      }

      const data = await response.json();
      const text = data?.text;

      if (typeof text === 'string' && text.trim()) {
        onTranscriptionComplete?.(text);
      } else {
        throw new Error('No transcription received');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to transcribe audio. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);

      // Clean up the audio file
      try {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      } catch (e) {
        console.error('Error deleting audio file:', e);
      }
    }
  };

  const handleToggle = async () => {
    if (disabled || isProcessing) return;

    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const size = compact ? 40 : 64;
  const iconSize = compact ? 20 : 24;

  return (
    <View style={styles.container}>
      <View style={[styles.buttonContainer, { width: size, height: size }]}>
        {/* Pulse ring when recording */}
        {isRecording && (
          <Animated.View
            style={[
              styles.pulseRing,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderColor: '#ef4444',
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        )}

        {/* Idle pulse ring */}
        {!isRecording && !isProcessing && (
          <Animated.View
            style={[
              styles.idlePulseRing,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderColor: '#06b6d4',
              },
            ]}
          />
        )}

        {/* Button */}
        <Animated.View
          style={[
            styles.button,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              transform: [{ scale: scaleAnim }],
              borderColor: isRecording ? '#ef4444' : '#06b6d4',
              opacity: disabled || isProcessing ? 0.5 : 1,
            },
          ]}
        >
          <TouchableOpacity
            onPress={handleToggle}
            disabled={disabled || isProcessing}
            style={[
              styles.buttonTouchable,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
            activeOpacity={0.8}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={[styles.icon, { fontSize: iconSize }]}>
                {isRecording ? '⏹' : '🎤'}
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Recording status */}
      {isRecording && !compact && (
        <Text style={styles.recordingText}>Recording… Tap to stop</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 2,
    opacity: 0.6,
  },
  idlePulseRing: {
    position: 'absolute',
    borderWidth: 2,
    opacity: 0.5,
  },
  button: {
    backgroundColor: '#1f2937',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: '#ffffff',
  },
  errorContainer: {
    position: 'absolute',
    top: '100%',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ef4444',
    borderRadius: 6,
    maxWidth: 200,
  },
  errorText: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  recordingText: {
    marginTop: 8,
    fontSize: 12,
    color: '#9ca3af',
  },
});
