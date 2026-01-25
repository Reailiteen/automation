"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, Merge, RefreshCw, Plus, XCircle } from "lucide-react";
import type { SimilarItem } from "@/lib/services/memory-service";

interface DuplicateConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  similarItems: SimilarItem[];
  newInput: string;
  onMerge: (itemId: string, itemType: 'plan' | 'task') => void;
  onUpdate: (itemId: string, itemType: 'plan' | 'task') => void;
  onCreateNew: () => void;
}

export function DuplicateConfirmationModal({
  isOpen,
  onClose,
  similarItems,
  newInput,
  onMerge,
  onUpdate,
  onCreateNew,
}: DuplicateConfirmationModalProps) {
  if (!isOpen) return null;

  const highestSimilarity = similarItems[0]?.similarity || 0;
  const isDuplicate = highestSimilarity >= 0.9;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl"
          >
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-yellow-500/20">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">
                        {isDuplicate ? "Duplicate Detected" : "Similar Items Found"}
                      </CardTitle>
                      <CardDescription className="text-gray-400 mt-1">
                        {isDuplicate 
                          ? "This looks very similar to an existing item"
                          : "We found similar items that might be related"}
                      </CardDescription>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-md hover:bg-gray-800 transition-smooth text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* New Input */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Your Input:</h3>
                  <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                    <p className="text-sm text-white">{newInput}</p>
                  </div>
                </div>

                {/* Similar Items */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">
                    {isDuplicate ? "Existing Item:" : "Similar Items:"}
                  </h3>
                  <div className="space-y-3">
                    {similarItems.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                {item.type === 'plan' ? 'Plan' : 'Task'}
                              </span>
                              <span className="text-xs text-gray-400">
                                {(item.similarity * 100).toFixed(0)}% similar
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-white mb-1">
                              {item.item.title}
                            </h4>
                            <p className="text-xs text-gray-400 mb-2">
                              {item.reason}
                            </p>
                            {'description' in item.item && item.item.description && (
                              <p className="text-sm text-gray-300">
                                {item.item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => {
                        const item = similarItems[0];
                        onMerge(item.item.id, item.type);
                      }}
                      variant="outline"
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    >
                      <Merge className="h-4 w-4 mr-2" />
                      Merge
                    </Button>
                    <Button
                      onClick={() => {
                        const item = similarItems[0];
                        onUpdate(item.item.id, item.type);
                      }}
                      variant="outline"
                      className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Update
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={onCreateNew}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Anyway
                    </Button>
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
