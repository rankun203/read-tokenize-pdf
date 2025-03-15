import { NextResponse } from "next/server";
import { processPdf } from "@/lib/pdf-processor";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { message: "Please provide a valid PDF file" },
        { status: 400 }
      );
    }

    // Process the PDF file
    const result = await processPdf(file);

    // Return the processing results
    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        message: error.message || "An error occurred while processing the PDF",
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, we'll handle it manually with formData
  },
};
