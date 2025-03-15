"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, FileUp, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function FileUpload({ onProcessingStart, onLog, onComplete }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setError(null);
    },
    disabled: processing,
  });

  const processPdf = async () => {
    if (!file) {
      setError("Please select a PDF file first");
      return;
    }

    try {
      setProcessing(true);
      onProcessingStart();

      // Log the start of processing
      onLog(
        `Starting PDF token counting for ${
          file.name
        } at ${new Date().toLocaleTimeString()}`
      );
      onLog(`File size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`);

      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 5 * Math.random();
          return newProgress < 90 ? newProgress : prev;
        });
      }, 300);

      // Make the API request to process the PDF
      const response = await fetch("/api/process-pdf", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process PDF");
      }

      const data = await response.json();

      // Log the results
      onLog(
        `Processing complete. Found ${
          data.total_tokens
        } tokens in ${data.processing_time.toFixed(2)} seconds`
      );

      // Pass the results to the parent component
      onComplete(data);
    } catch (err) {
      console.error("Error processing PDF:", err);
      setError(err.message);
      onLog(`Error: ${err.message}`);
      onComplete(null);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-primary/50"
          }
          ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <FileUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />

        {isDragActive ? (
          <p className="text-lg font-medium">Drop the PDF here...</p>
        ) : (
          <div>
            <p className="text-lg font-medium">
              Drag and drop a PDF file here, or click to select
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Only PDF files are supported
            </p>
          </div>
        )}

        {file && (
          <div className="mt-4 p-3 bg-secondary/50 rounded-md">
            <p className="font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {processing && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-center text-muted-foreground">
            Processing PDF... {progress.toFixed(0)}%
          </p>
        </div>
      )}

      <Button
        onClick={processPdf}
        disabled={!file || processing}
        className="w-full"
      >
        {processing ? "Processing..." : "Process PDF"}
      </Button>
    </div>
  );
}
