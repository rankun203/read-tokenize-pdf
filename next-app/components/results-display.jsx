"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResultsDisplay({ result }) {
  if (!result) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Results will appear here after processing a PDF.
      </div>
    );
  }
  
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
        <TabsTrigger value="text">Sample Text</TabsTrigger>
      </TabsList>
      
      <TabsContent value="summary">
        <Card>
          <CardHeader>
            <CardTitle>PDF Analysis Summary</CardTitle>
            <CardDescription>
              Overview of the token analysis results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Pages</p>
                <p className="text-2xl font-bold">{result.total_pages}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Tokens</p>
                <p className="text-2xl font-bold">{result.total_tokens.toLocaleString()}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Processing Time</p>
                <p className="text-2xl font-bold">{result.processing_time.toFixed(2)}s</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tokens per Page (avg)</p>
                <p className="text-2xl font-bold">
                  {(result.total_tokens / result.total_pages).toFixed(0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="tokens">
        <Card>
          <CardHeader>
            <CardTitle>Token Analysis</CardTitle>
            <CardDescription>First few tokens from the PDF</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <pre className="text-sm bg-muted p-4 rounded-md">
                {JSON.stringify(result.first_few_tokens, null, 2)}
              </pre>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              These are the encoded token IDs from the beginning of the document.
              <br />
              Total of {result.total_tokens.toLocaleString()} tokens in the entire document.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="text">
        <Card>
          <CardHeader>
            <CardTitle>Sample Text</CardTitle>
            <CardDescription>First 200 characters from the PDF</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md max-h-[300px] overflow-y-auto">
              <p className="text-sm whitespace-pre-wrap">{result.text_sample}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
