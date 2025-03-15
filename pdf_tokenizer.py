import os
import sys
import time
from pathlib import Path
import PyPDF2
import tiktoken


def count_tokens(text, encoding_name="cl100k_base"):
    """
    Count tokens using the tiktoken library
    """
    start_time = time.time()
    print(f"Starting token counting for {len(text)} characters...")

    try:
        # Get the encoding based on the model name
        encoding = tiktoken.get_encoding(encoding_name)

        # Encode the text to get tokens
        tokens = encoding.encode(text)
        token_count = len(tokens)

        end_time = time.time()
        print(f"Token counting complete. Found {token_count} tokens in {end_time - start_time:.2f} seconds")

        return tokens, token_count
    except Exception as e:
        print(f"Error in token counting: {str(e)}")
        return [], 0


def process_pdf(file_path):
    """
    Extract text from PDF and count tokens using tiktoken
    """
    total_start_time = time.time()
    print(f"Processing PDF: {file_path}")

    try:
        # Expand the ~ in the file path
        expanded_path = os.path.expanduser(file_path)
        print(f"Expanded path: {expanded_path}")

        # Check if file exists
        if not os.path.exists(expanded_path):
            return f"Error: File not found at {expanded_path}"

        # Create a PDF file reader object
        file_open_time = time.time()
        print(f"Opening PDF file...")

        with open(expanded_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)

            pdf_load_time = time.time()
            print(f"PDF loaded in {pdf_load_time - file_open_time:.2f} seconds")

            # Get total number of pages
            num_pages = len(pdf_reader.pages)
            print(f"PDF has {num_pages} pages")

            # Extract text from all pages
            text = ""
            text_extraction_start = time.time()

            for page_num in range(num_pages):
                page_start = time.time()
                page = pdf_reader.pages[page_num]
                page_text = page.extract_text()
                text += page_text
                page_end = time.time()

                if page_num % 5 == 0 or page_num == num_pages - 1:  # Log every 5 pages and the last page
                    print(
                        f"Page {page_num+1}/{num_pages} extracted in {page_end - page_start:.2f} seconds. Text length so far: {len(text)}")

            text_extraction_end = time.time()
            print(
                f"Text extraction complete. Extracted {len(text)} characters in {text_extraction_end - text_extraction_start:.2f} seconds")

            # Get token count using tiktoken
            tokens, token_count = count_tokens(text)

            total_end_time = time.time()
            print(f"Total processing time: {total_end_time - total_start_time:.2f} seconds")

            return {
                "total_pages": num_pages,
                "total_tokens": token_count,
                "first_few_tokens": tokens[:10] if tokens else [],
                "text_sample": text[:200] + "..." if len(text) > 200 else text,
                "processing_time": total_end_time - total_start_time
            }

    except Exception as e:
        end_time = time.time()
        print(f"Error processing PDF after {end_time - total_start_time:.2f} seconds: {str(e)}")
        return f"Error processing PDF: {str(e)}"


if __name__ == "__main__":
    file_path = sys.argv[1] if len(sys.argv) > 1 else "~/Downloads/Research design(1).pdf"

    print(f"Starting PDF token counting for {file_path} at {time.strftime('%H:%M:%S')}")
    result = process_pdf(file_path)

    if isinstance(result, dict):
        print("\nSummary:")
        print(f"Successfully processed PDF in {result['processing_time']:.2f} seconds")
        print(f"Total pages: {result['total_pages']}")
        print(f"Total tokens: {result['total_tokens']}")
        print(f"Sample tokens (token IDs): {result['first_few_tokens']}")
        print(f"Text sample: {result['text_sample']}")
    else:
        print(result)
