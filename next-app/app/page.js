"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUpload from "@/components/file-upload";
import ProcessingLogs from "@/components/processing-logs";
import ResultsDisplay from "@/components/results-display";

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const addLog = (message) => {
    setLogs((prev) => [...prev, { time: new Date(), message }]);
  };

  const handleProcessComplete = (data) => {
    setResult(data);
    setIsProcessing(false);
  };

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">PDF Token Counter</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload PDF</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                onProcessingStart={() => {
                  setIsProcessing(true);
                  setLogs([]);
                  setResult(null);
                }}
                onLog={addLog}
                onComplete={handleProcessComplete}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Processing Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <ProcessingLogs logs={logs} isProcessing={isProcessing} />
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Processing Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ResultsDisplay result={result} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
