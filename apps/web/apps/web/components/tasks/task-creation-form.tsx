"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VoiceInput } from "@/components/ui/voice-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DuplicateConfirmationModal } from "@/components/tasks/duplicate-confirmation-modal";
import { X } from "lucide-react";
import { SimilarItem } from "@/lib/services/memory-service";

interface TaskCreationFormProps {
  onClose: () => void;
  onTaskCreated?: () => void;
}

export function TaskCreationForm({ onClose, onTaskCreated }: TaskCreationFormProps) {
  const [text, setText] = useState("");
  const [transcription, setTranscription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateItems, setDuplicateItems] = useState<SimilarItem[]>([]);
  const [pendingInput, setPendingInput] = useState<string>("");

  const handleVoiceTranscription = (transcribedText: string) => {
    const trimmed = transcribedText.trim();
    if (!trimmed) return;
    setText((prev) => (prev ? `${prev} ${trimmed}` : trimmed));
    setTranscription((prev) => (prev ? `${prev} ${trimmed}` : trimmed));
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
      const response = await fetch("/api/agents/planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goals: [inputText],
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
      
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl my-4 sm:my-8"
        >
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="px-4 sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-xl sm:text-2xl font-bold text-white leading-tight">
                Talk your mind
              </CardTitle>
              <button
                type="button"
                onClick={onClose}
                className="p-2 -m-2 rounded-md hover:bg-gray-800 transition-smooth text-gray-400 hover:text-white touch-manipulation shrink-0"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <CardDescription className="text-gray-400 mt-1 text-sm sm:text-base">
              Type or say what you want to accomplish. Keep recording to add more—each clip appends.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="plan-description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description <span className="text-gray-500 text-xs">(required)</span>
                </label>
                <textarea
                  id="plan-description"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. Prepare for tomorrow's meeting, finish system design doc, brush teeth twice daily"
                  className="w-full min-h-[100px] p-4 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-smooth resize-none text-base"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <label className="text-sm font-medium text-gray-300 shrink-0">Voice</label>
                <div className="flex items-center gap-2">
                  <VoiceInput
                    compact
                    silenceThreshold={30000}
                    onTranscriptionComplete={handleVoiceTranscription}
                    onError={(err) => setError(err)}
                  />
                  <span className="text-xs text-gray-500 max-w-[140px]">
                    Tap to record. Stops after 30s silence or when you tap again. Appends to text.
                  </span>
                </div>
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

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 min-h-[44px] border-gray-700 text-gray-300 hover:bg-gray-800 touch-manipulation"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!text.trim() || isSubmitting}
                  className="flex-1 min-h-[44px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 touch-manipulation"
                >
                  {isSubmitting ? "Creating…" : "Create"}
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
