// cancelief — Invent a Word We Need (make.fun)
// Writes one invented word and its one-line definition to entry.txt.
// The entry must be UTF-8 text, 1-140 characters, a single line, not only
// whitespace — the same gate the sealed scorer applies.
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ENTRY =
  "cancelief (n.) The secret relief you feel when plans are cancelled and your evening is suddenly free again.";

function validate(entry: string): void {
  // Count by code points, not UTF-16 units, so the gate matches the
  // scorer's character count even if the entry ever holds non-ASCII text.
  const chars = [...entry].length;
  if (chars === 0 || entry.trim().length === 0) {
    throw new Error("entry must not be empty or only whitespace");
  }
  if (chars > 140) {
    throw new Error(`entry is ${chars} characters, over the 140 limit`);
  }
  if (entry.includes("\n") || entry.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // The entry must survive a UTF-8 round-trip unchanged.
  if (Buffer.from(entry, "utf8").toString("utf8") !== entry) {
    throw new Error("entry is not valid UTF-8 text");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
validate(ENTRY);
await mkdir(outDir, { recursive: true });
await writeFile(join(outDir, "entry.txt"), ENTRY, "utf8");
console.log(`wrote ${[...ENTRY].length}-char entry to ${join(outDir, "entry.txt")}`);
console.log(ENTRY);
