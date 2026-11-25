import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const LIMIT = 160;
const SOURCE = join(dirname(fileURLToPath(import.meta.url)), "one-line.txt");

function loadReply(): string {
  return readFileSync(SOURCE, "utf8").replace(/\r\n/g, "\n").trim();
}

function checkReply(text: string): string[] {
  const issues: string[] = [];
  if (text.length === 0) issues.push("reply is empty");
  if (text.length > LIMIT) {
    issues.push(`reply is ${text.length} characters, over the ${LIMIT} limit`);
  }
  if (text.includes("\n")) issues.push("reply must be a single line");
  if (text.trim() !== text) {
    issues.push("reply has leading or trailing whitespace");
  }
  return issues;
}

const reply = loadReply();
const issues = checkReply(reply);
if (issues.length > 0) {
  for (const issue of issues) console.error(`invalid: ${issue}`);
  process.exit(1);
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), reply + "\n");
console.log(`OK: ${reply.length}/${LIMIT} characters, entry.txt written`);
