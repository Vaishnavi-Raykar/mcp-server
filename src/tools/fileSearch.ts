import fs from "fs/promises";
import path from "path";

interface SearchResult {
  success: boolean;
  filePath: string;
  keyword: string;
  matches: Match[];
  totalMatches: number;
  searchType: string;
  error?: string;
}

interface Match {
  lineNumber: number;
  lineContent: string;
  columnPosition: number;
  matchedText?: string;
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
          matchedText: keyword,
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
      searchType: "partial match",
    };
  } catch (error) {
    return {
      success: false,
      filePath,
      keyword,
      matches: [],
      totalMatches: 0,
      searchType: "partial match",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function exactWordSearch(
  filePath: string,
  word: string,
  caseSensitive: boolean = false
): Promise<SearchResult> {
  try {
    const absolutePath = path.resolve(filePath);
    const fileContent = await fs.readFile(absolutePath, "utf-8");
    const lines = fileContent.split("\n");
    const matches: Match[] = [];

    const wordBoundaryPattern = caseSensitive
      ? new RegExp(`\\b${escapeRegex(word)}\\b`, "g")
      : new RegExp(`\\b${escapeRegex(word)}\\b`, "gi");

    lines.forEach((line, index) => {
      let match;
      const regex = new RegExp(wordBoundaryPattern);
      
      while ((match = regex.exec(line)) !== null) {
        matches.push({
          lineNumber: index + 1,
          lineContent: line.trim(),
          columnPosition: match.index + 1,
          matchedText: match[0],
        });
      }
    });

    return {
      success: true,
      filePath: absolutePath,
      keyword: word,
      matches,
      totalMatches: matches.length,
      searchType: caseSensitive ? "exact word (case sensitive)" : "exact word (case insensitive)",
    };
  } catch (error) {
    return {
      success: false,
      filePath,
      keyword: word,
      matches: [],
      totalMatches: 0,
      searchType: "exact word",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}