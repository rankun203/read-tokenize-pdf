"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

export default function ProcessingLogs({ logs, isProcessing }) {
  const scrollAreaRef = useRef(null);
  const endOfLogsRef = useRef(null);
  
  // Scroll to the bottom when new logs are added
  useEffect(() => {
    if (endOfLogsRef.current) {
      endOfLogsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);
  
  if (logs.length === 0 && !isProcessing) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No logs to display. Upload and process a PDF to see logs.
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[400px] rounded-md border" ref={scrollAreaRef}>
      <div className="p-4 font-mono text-sm">
        {logs.map((log, index) => (
          <div key={index} className="mb-1">
            <span className="text-muted-foreground">
              [{log.time.toLocaleTimeString()}]
            </span>{" "}
            {log.message}
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex items-center text-muted-foreground mt-2">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Processing...
          </div>
        )}
        
        <div ref={endOfLogsRef} />
      </div>
    </ScrollArea>
  );
}
