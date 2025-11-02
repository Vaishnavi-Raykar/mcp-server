# Ressl AI MCP Server

MCP server for file search functionality with support for both partial and exact word matching.

<a href="https://glama.ai/mcp/servers/@Vaishnavi-Raykar/mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@Vaishnavi-Raykar/mcp-server/badge" alt="Ressl AI Server MCP server" />
</a>

## Features

- **Partial Keyword Search**: Find all occurrences of a keyword including partial matches
- **Exact Word Search**: Match complete words only with optional case sensitivity
- **Detailed Results**: Line numbers, column positions, and matched text for all occurrences
- **MCP Inspector Integration**: Built-in support for testing with MCP Inspector

## Installation

```bash
npm install
```

## Usage

### Build the Project

```bash
npm run build
```

### Run with MCP Inspector

```bash
npm start
```

This will automatically build the project and launch the MCP Inspector for testing.

### Development Mode

```bash
npm run dev
```

Runs TypeScript compiler in watch mode for continuous development.

## Available Tools

### 1. search_in_file

Searches for a keyword within a file, finding all occurrences including partial matches.

**Parameters:**
- `filePath` (string, required): Path to the file to search in
- `keyword` (string, required): Keyword to search for

**Example:**
```json
{
  "filePath": "./sample.txt",
  "keyword": "search"
}
```

**Result:** Finds "search", "searching", "researcher", etc.

### 2. exact_word_search

Searches for exact word matches within a file using word boundaries.

**Parameters:**
- `filePath` (string, required): Path to the file to search in
- `word` (string, required): Exact word to search for
- `caseSensitive` (boolean, optional): Whether search should be case sensitive (default: false)

**Example:**
```json
{
  "filePath": "./sample.txt",
  "word": "search",
  "caseSensitive": false
}
```

**Result:** Finds only exact "search" matches, not "searching" or "researcher"

## Testing

A `sample.txt` file is included in the project for testing purposes.

### Test Cases

| Search Term | Tool | Matches in "searching" |
|-------------|------|------------------------|
| "search" | search_in_file | Yes (partial match) |
| "search" | exact_word_search | No (exact word only) |
| "AI" | search_in_file | Yes (finds "Ressl AI" and "AIR") |
| "AI" | exact_word_search | Only "Ressl AI" (not "AIR") |

### Using MCP Inspector

1. Run `npm start` to launch the inspector
2. Open the provided URL in your browser
3. Select a tool from the Tools tab
4. Enter the required parameters
5. Click Execute to see results