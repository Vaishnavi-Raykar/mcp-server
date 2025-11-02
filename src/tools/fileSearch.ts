import fs from "fs/promises";
import path from "path";

interface SearchResult {
  success: boolean;
  filePath: string;
  keyword: string;
  matches: Match[];
  totalMatches: number;
  error?: string;
}

interface Match {
  lineNumber: number;
  lineContent: string;
  columnPosition: number;
}

export async function searchInFile(
  filePath: string,
  keyword: string
): Promise<SearchResult> {
  try {
    const absolutePath = path.resolve(filePath);
    const fileContent = await fs.readFile(absolutePath, "utf-8");
    const lines = fileContent.split("\n");
    const matches: Match[] = [];

    lines.forEach((line, index) => {
      let columnIndex = line.indexOf(keyword);
      while (columnIndex !== -1) {
        matches.push({
          lineNumber: index + 1,
          lineContent: line.trim(),
          columnPosition: columnIndex + 1,
        });
        columnIndex = line.indexOf(keyword, columnIndex + 1);
      }
    });

    return {
      success: true,
      filePath: absolutePath,
      keyword,
      matches,
      totalMatches: matches.length,
    };
  } catch (error) {
    return {
      success: false,
      filePath,
      keyword,
      matches: [],
      totalMatches: 0,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}