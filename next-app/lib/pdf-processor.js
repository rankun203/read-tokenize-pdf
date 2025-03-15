import { PDFDocument } from "pdf-lib";
import * as tiktoken from "tiktoken-node";

export async function processPdf(file) {
  const startTime = Date.now();

  try {
    // Convert the file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Get the total number of pages
    const numPages = pdfDoc.getPageCount();

    // Extract text from the PDF
    // Note: For actual text extraction, you would need a more robust solution
    // like pdf.js or a server-side solution since pdf-lib doesn't have good
    // text extraction capabilities

    // For this example, we'll simulate text extraction
    const text = await simulateTextExtraction(file, numPages);

    // Count tokens
    const { tokens, tokenCount } = countTokens(text);

    const processingTime = (Date.now() - startTime) / 1000;

    return {
      total_pages: numPages,
      total_tokens: tokenCount,
      first_few_tokens: tokens.slice(0, 10),
      text_sample: text.slice(0, 200) + (text.length > 200 ? "..." : ""),
      processing_time: processingTime,
    };
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw new Error(`Failed to process PDF: ${error.message}`);
  }
}

// This is a simulation function - in a real application you would use
// a proper PDF text extraction library
async function simulateTextExtraction(file, pageCount) {
  // Simulate taking some time to extract text
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return simulated text content based on the file name
  return `This is extracted text from the PDF file "${file.name}" with ${pageCount} pages. 
  In a real application, this would contain the actual content from the PDF file.
  The content would be processed and tokenized to provide an accurate analysis.
  Multiple pages would be analyzed individually and then combined for a complete report.
  For demonstration purposes, we're simulating the extraction process.`;
}

function countTokens(text, encodingName = "cl100k_base") {
  try {
    // Get the encoding based on the model name
    const encoding = tiktoken.getEncoding(encodingName);

    // Encode the text to get tokens
    const tokens = encoding.encode(text);
    const tokenCount = tokens.length;

    return { tokens, tokenCount };
  } catch (error) {
    console.error("Error in token counting:", error);
    return { tokens: [], tokenCount: 0 };
  }
}
