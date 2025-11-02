import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { searchInFile, exactWordSearch } from "./tools/fileSearch.js";

const server = new Server(
  {
    name: "ressl-ai-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_in_file",
        description: "Search for a keyword within a specified file. Finds all occurrences including partial matches.",
        inputSchema: {
          type: "object",
          properties: {
            filePath: {
              type: "string",
              description: "Path to the file to search in",
            },
            keyword: {
              type: "string",
              description: "Keyword to search for in the file",
            },
          },
          required: ["filePath", "keyword"],
        },
      },
      {
        name: "exact_word_search",
        description: "Search for an exact word match within a specified file. Only matches complete words, not partial matches.",
        inputSchema: {
          type: "object",
          properties: {
            filePath: {
              type: "string",
              description: "Path to the file to search in",
            },
            word: {
              type: "string",
              description: "Exact word to search for in the file",
            },
            caseSensitive: {
              type: "boolean",
              description: "Whether the search should be case sensitive",
              default: false,
            },
          },
          required: ["filePath", "word"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "search_in_file") {
    const filePath = String(request.params.arguments?.filePath);
    const keyword = String(request.params.arguments?.keyword);

    const result = await searchInFile(filePath, keyword);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  if (request.params.name === "exact_word_search") {
    const filePath = String(request.params.arguments?.filePath);
    const word = String(request.params.arguments?.word);
    const caseSensitive = Boolean(request.params.arguments?.caseSensitive ?? false);

    const result = await exactWordSearch(filePath, word, caseSensitive);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Ressl AI MCP Server running on stdio");
}

runServer().catch(console.error);