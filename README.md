# PDF Tokenizer

A simple tool to extract text from PDF files and count tokens using the tiktoken tokenizer.

## Features

- Extract text from PDF files
- Count tokens using OpenAI's tiktoken library
- Detailed logging of processing times and progress
- Support for command-line arguments to specify PDF file paths

## Installation

### Prerequisites

- Python 3.7+
- uv (Python package manager)

### Setup

1. Clone this repository:

   ```bash
   git clone read-tokenize-pdf
   cd read-tokenize-pdf
   ```

2. Install dependencies using uv:
   ```bash
   uv sync
   ```

## Usage

### Basic Usage

Provide the path to a PDF file as an argument:

```bash
uv run pdf_tokenizer.py ~/Documents/example.pdf
```

### Example Output

```
Starting PDF token counting for ~/Documents/example.pdf at 14:32:45
Processing PDF: ~/Documents/example.pdf
Expanded path: /home/user/Documents/example.pdf
Opening PDF file...
PDF loaded in 0.15 seconds
PDF has 20 pages
Page 1/20 extracted in 0.03 seconds. Text length so far: 1450
Page 5/20 extracted in 0.04 seconds. Text length so far: 7230
Page 10/20 extracted in 0.03 seconds. Text length so far: 14580
Page 15/20 extracted in 0.03 seconds. Text length so far: 21840
Page 20/20 extracted in 0.03 seconds. Text length so far: 28920
Text extraction complete. Extracted 28920 characters in 0.75 seconds
Starting token counting for 28920 characters...
Token counting complete. Found 5784 tokens in 0.05 seconds
Total processing time: 0.95 seconds

Summary:
Successfully processed PDF in 0.95 seconds
Total pages: 20
Total tokens: 5784
Sample tokens (token IDs): [1, 390, 220, 390, 2504, 307, 319, 4587, 3132, 220]
Text sample: Title: Introduction to Machine Learning
Authors: John Smith, Jane Doe

Abstract:
This paper presents an overview of recent advances in machine learning techniques...
```

## Configuration

The script uses the "cl100k_base" tokenizer by default, which is compatible with many language models including Claude and GPT models. You can modify the `encoding_name` parameter in the `count_tokens` function to use a different tokenizer.

## Troubleshooting

- If you encounter `ModuleNotFoundError`, ensure you've installed the required dependencies with `uv sync`
- If you get "File not found" errors, check that the file path is correct and that the file exists
- If you're having issues with uv, consult the [uv documentation](https://github.com/astral-sh/uv)

## License

MIT
