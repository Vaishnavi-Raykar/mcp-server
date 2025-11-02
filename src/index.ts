import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { searchInFile } from "./tools/fileSearch.js";

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
        description: "Search for a keyword within a specified file",
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

  throw new Error(`Unknown tool: ${request.params.name}`);
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Ressl AI MCP Server running on stdio");
}

runServer().catch(console.error);
