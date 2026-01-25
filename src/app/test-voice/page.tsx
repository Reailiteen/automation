"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VoiceInput } from "@/components/ui/voice-input";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import { Mic, Copy, Check } from "lucide-react";

const TestVoicePage = () => {
  const [transcription, setTranscription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text);
    setError("");
    setIsProcessing(false);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsProcessing(false);
  };

  const handleProcessingStart = () => {
    setIsProcessing(true);
    setError("");
    setTranscription("");
  };

  const copyToClipboard = async () => {
    if (transcription) {
      await navigator.clipboard.writeText(transcription);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Voice Input Test
              </CardTitle>
              <CardDescription>
                Test the Groq-powered voice transcription feature. Click the microphone to start recording.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Voice Input Component */}
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <VoiceInput
                  onTranscriptionComplete={handleTranscriptionComplete}
                  onError={handleError}
                  onProcessingStart={handleProcessingStart}
                  autoStop={true}
                  silenceThreshold={2000}
                />
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Click the microphone button to start recording. It will automatically stop after 2 seconds of silence, or you can click again to stop manually.
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md"
                >
                  <p className="font-medium">Error:</p>
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}

              {/* Loading State */}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4"
                >
                  <p className="text-sm text-muted-foreground">
                    Processing audio...
                  </p>
                </motion.div>
              )}

              {/* Transcription Result */}
              {transcription && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">Transcription:</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyToClipboard}
                      className="h-8"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="p-4 bg-muted rounded-md border">
                    <p className="text-sm whitespace-pre-wrap">{transcription}</p>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Voice Input Features</CardTitle>
              <CardDescription>
                Capabilities of the voice input component
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5" />
                  <div>
                    <p className="font-medium text-sm">Real-time Recording</p>
                    <p className="text-xs text-muted-foreground">
                      Records audio directly from your microphone
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5" />
                  <div>
                    <p className="font-medium text-sm">Auto-stop on Silence</p>
                    <p className="text-xs text-muted-foreground">
                      Automatically stops recording after 2 seconds of silence
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5" />
                  <div>
                    <p className="font-medium text-sm">Visual Feedback</p>
                    <p className="text-xs text-muted-foreground">
                      Pulsing animation and recording indicators
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5" />
                  <div>
                    <p className="font-medium text-sm">Groq Whisper Integration</p>
                    <p className="text-xs text-muted-foreground">
                      Powered by Groq's whisper-large-v3-turbo model
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md text-xs">
                Note: Make sure to set your GROQ_API_KEY in .env.local
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default TestVoicePage;
