"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VoiceInput } from "@/components/ui/voice-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DuplicateConfirmationModal } from "@/components/tasks/duplicate-confirmation-modal";
import { X, Mic, Type, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimilarItem } from "@/lib/services/memory-service";

interface TaskCreationFormProps {
  onClose: () => void;
  onTaskCreated?: () => void;
}

export function TaskCreationForm({ onClose, onTaskCreated }: TaskCreationFormProps) {
  const [inputMode, setInputMode] = useState<"text" | "voice">("text");
  const [text, setText] = useState("");
  const [transcription, setTranscription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateItems, setDuplicateItems] = useState<SimilarItem[]>([]);
  const [pendingInput, setPendingInput] = useState<string>("");

  const handleVoiceTranscription = (transcribedText: string) => {
    setTranscription(transcribedText);
    // Also update the main text field with transcription
    setText(transcribedText);
    setInputMode("text");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Allow submission with just voice input - text can be empty if voice was used
    const inputText = text.trim();
    if (!inputText) {
      setError("Describe what you want to accomplish in the box above or via voice.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Use the planner agent to create tasks from the user's input
      // Extract title and description if provided, otherwise use full text as goal
      const lines = inputText.split('\n');
      const providedTitle = lines[0] || '';
      const providedDescription = lines.slice(1).join('\n') || '';
      
      // Use the full input as the goal, AI will generate title/description if not provided
      const goals = providedTitle && providedDescription 
        ? [providedTitle, providedDescription].filter(Boolean)
        : [inputText];

      const response = await fetch("/api/agents/planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goals,
          constraints: {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create task");
      }

      const result = await response.json();
      console.log('Planner API response:', result);
      
      // Check if there was an error in the result
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Check for error in metadata (from planner agent catch block)
      if (result.metadata?.error) {
        console.error('Planner agent error:', result.metadata.error);
        throw new Error(result.metadata.error || 'Planner agent failed to process your request');
      }
      
      // Check if result has a result property (AgentOutput format)
      if (!result.result) {
        const errorMsg = result.metadata?.error || 'Invalid response from planner agent';
        console.error('No result from planner agent:', result);
        throw new Error(errorMsg);
      }
      
      // Check for duplicate detection
      if (result.metadata?.duplicateDetected && result.metadata.similarItems) {
        // Map API response to SimilarItem format
        const mappedItems: SimilarItem[] = result.metadata.similarItems.map((item: any) => {
          // If item already has the full object, use it; otherwise construct it
          const itemObj = item.item || {
            id: item.id,
            title: item.title,
            description: item.description || '',
            ...(item.type === 'plan' ? { goal: item.goal || '' } : {}),
          };
          
          return {
            item: itemObj,
            type: item.type,
            similarity: item.similarity || 0.9,
            reason: item.reason || 'Similar content found',
          };
        });
        
        setDuplicateItems(mappedItems);
        setPendingInput(inputText);
        setShowDuplicateModal(true);
        setIsSubmitting(false);
        return;
      }
      
      // If successful, close the form and refresh
      if (onTaskCreated) {
        onTaskCreated();
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMerge = async (itemId: string, itemType: 'plan' | 'task') => {
    // TODO: Implement merge logic
    setShowDuplicateModal(false);
    setError("Merge functionality coming soon");
  };

  const handleUpdate = async (itemId: string, itemType: 'plan' | 'task') => {
    // TODO: Implement update logic
    setShowDuplicateModal(false);
    setError("Update functionality coming soon");
  };

  const handleCreateNew = async () => {
    setShowDuplicateModal(false);
    // Retry creation with force flag or proceed anyway
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/agents/planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goals: [pendingInput],
          constraints: {},
          forceCreate: true, // Flag to bypass duplicate check
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create task");
      }

      if (onTaskCreated) {
        onTaskCreated();
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DuplicateConfirmationModal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        similarItems={duplicateItems}
        newInput={pendingInput}
        onMerge={handleMerge}
        onUpdate={handleUpdate}
        onCreateNew={handleCreateNew}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl"
        >
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-2xl font-bold text-white">
                Create a plan from your goals
              </CardTitle>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-gray-800 transition-smooth text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <CardDescription className="text-gray-400 mt-1">
              Describe what you want to accomplish—type or say it. The AI will turn it into a plan and tasks.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Plan Title - Optional */}
              <div>
                <label htmlFor="plan-title" className="block text-sm font-medium text-gray-300 mb-2">
                  Title <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <input
                  id="plan-title"
                  type="text"
                  value={text.split('\n')[0] || ''}
                  onChange={(e) => {
                    const lines = text.split('\n');
                    lines[0] = e.target.value;
                    setText(lines.join('\n'));
                  }}
                  placeholder="e.g. Meeting prep & system design"
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-smooth"
                />
              </div>

              {/* Main input: what you want → tasks */}
              <div>
                <label htmlFor="plan-description" className="block text-sm font-medium text-gray-300 mb-2">
                  What do you want to turn into tasks? <span className="text-gray-500 text-xs">(required)</span>
                </label>
                <textarea
                  id="plan-description"
                  value={text.includes('\n') ? text.split('\n').slice(1).join('\n') : text}
                  onChange={(e) => {
                    const title = text.split('\n')[0] || '';
                    setText(title ? `${title}\n${e.target.value}` : e.target.value);
                  }}
                  placeholder="e.g. Prepare for tomorrow's meeting, finish system design doc by Feb 6, brush teeth twice daily"
                  className="w-full min-h-[100px] p-4 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-smooth resize-none"
                />
              </div>

              {/* Voice Input Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Or say it with voice
                </label>
                <div className="flex flex-col items-center justify-center py-8 space-y-4 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700">
                  <div className="relative" style={{ transform: 'scale(1.5)' }}>
                    <VoiceInput
                      onTranscriptionComplete={handleVoiceTranscription}
                      onError={(err) => setError(err)}
                    />
                  </div>
                  <p className="text-sm text-gray-400 text-center max-w-md px-4">
                    Click to record, then describe what you want to accomplish
                  </p>
                </div>
                
                {/* Transcription Output */}
                {transcription && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-lg bg-gray-800/70 border border-gray-700"
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Transcription:
                    </label>
                    <p className="text-sm text-white whitespace-pre-wrap">{transcription}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setText(transcription);
                        setTranscription("");
                      }}
                      className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Use this text →
                    </button>
                  </motion.div>
                )}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!text.trim() || isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                >
                  {isSubmitting ? "Creating..." : "Create Plan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
    </>
  );
}
