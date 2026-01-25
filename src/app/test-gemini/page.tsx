"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";

const TestGeminiPage = () => {
  const [prompt, setPrompt] = useState("Explain the benefits of AI-assisted task management in three sentences.");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const testGemini = async () => {
    setIsLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("/api/test-gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to get response");
        return;
      }

      setResponse(data.response);
    } catch (err) {
      setError("Failed to call API");
      console.error(err);
    } finally {
      setIsLoading(false);
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
              <CardTitle>Test Gemini Integration</CardTitle>
              <CardDescription>
                Test the Gemini API connection used by our AI agents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="prompt" className="text-sm font-medium mb-2 block">
                  Test Prompt
                </label>
                <textarea
                  id="prompt"
                  className="w-full p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
                  placeholder="Enter a test prompt for Gemini..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={testGemini} 
                disabled={isLoading || !prompt.trim()}
                className="w-full"
              >
                {isLoading ? "Thinking..." : "Test Gemini API"}
              </Button>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md">
                  <p className="font-medium">Error:</p> {error}
                </div>
              )}

              {response && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-3 bg-muted rounded-md">
                    <h3 className="font-medium mb-2">Response:</h3>
                    <p>{response}</p>
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
              <CardTitle>Agent Configuration Status</CardTitle>
              <CardDescription>
                Status of Gemini integration in each agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Planner Agent:</span>
                  <span className="text-green-600">Gemini Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span>Prioritization Agent:</span>
                  <span className="text-green-600">Gemini Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span>Scheduler Agent:</span>
                  <span className="text-green-600">Gemini Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span>Execution Agent:</span>
                  <span className="text-green-600">Gemini Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span>Reflection Agent:</span>
                  <span className="text-green-600">Gemini Enabled</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md">
                Note: Make sure to set your GEMINI_API_KEY in .env.local
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default TestGeminiPage;