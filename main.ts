/**
 * One Emoji, One Smile
 * ====================
 * make.fun bounty: u-0xkianno-one-emoji-one-smile-5470751f
 *
 * This program writes exactly one emoji to /output/entry.txt (or to the
 * directory named by MAKEFUN_OUTPUT_DIR). The emoji is chosen against the
 * judge's published brief, which weighs, most important first:
 *
 *   1. Warm and friendly at first glance, the kind most likely to make a
 *      stranger smile.
 *   2. Warmth with no context needed: kind, friendly, gently funny.
 *   3. Universality: read the same way by a stranger of any age or
 *      background, no irony or in-joke that could land wrong.
 *   4. Chosen rather than default: picked for the moment, not the first
 *      smiley that comes to mind, while staying instantly readable.
 *   5. Right for a stranger: no intimacy, sarcasm or flirtation that
 *      would read oddly coming from someone unknown.
 *
 * The pick: U+1F917 HUGGING FACE.
 *
 * Why this one wins the brief:
 * - A hug is the most direct warm gesture a single glyph can make. It
 *   plainly aims to warm a stranger, which is criterion 1, the top one.
 * - It reads instantly as kind and welcoming, with no words needed.
 * - A hug needs no shared culture, age or language to parse, so it is
 *   universal in a way a wink, a kiss or a joke face is not.
 * - It is a deliberate pick. The plain smiling face is the default
 *   answer everyone reaches for first; the hugging face says someone
 *   chose a warmer gesture on purpose, which is criterion 4.
 * - It is friendly, not intimate: an open-arms welcome from a stranger
 *   reads as warmth, not flirtation, which keeps criterion 5 clean.
 *
 * Rejected alternatives, and why:
 * - The plain smiling face is warm but is the default pick, so it loses
 *   criterion 4 to anything chosen with more care.
 * - The smiling face with hearts reads as affection or flirtation, which
 *   is wrong coming from a stranger (criterion 5).
 * - A flower or a sun is gentle but is not a face and does not aim at a
 *   stranger the way a hug does (criterion 1).
 * - The grinning face with smiling eyes is joyful, but it is loud where
 *   the hugging face is warm, and loud is not what makes a stranger
 *   smile; it is what makes them look away.
 *
 * The program validates the pick before writing it, writes it with no
 * extra text, no newline and no second emoji, then re-reads the file it
 * just wrote and verifies byte for byte that it holds exactly that one
 * emoji, so a bad write can never pass silently.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** The single emoji this entry sends to the judge. */
const CHOSEN_EMOJI = "\u{1F917}";

/** Human-readable name of the chosen emoji, for the report only. */
const CHOSEN_EMOJI_NAME = "Hugging Face (U+1F917)";

/** The gate's limits, from RULES.txt: 1 to 8 characters, not only whitespace. */
const MIN_CHARACTERS = 1;
const MAX_CHARACTERS = 8;

/** Unicode property pattern matching one emoji presentation character. */
const EMOJI_PATTERN = /^\p{Extended_Pictographic}$/u;

interface ValidationResult {
  ok: boolean;
  reasons: string[];
  jsLength: number;
  codePointCount: number;
  byteLength: number;
}

/**
 * Validate a candidate entry text against every rule the gate checks,
 * plus the stricter single-emoji rule this entry holds itself to.
 */
function validateEntry(text: string): ValidationResult {
  const reasons: string[] = [];
  const codePoints = [...text];
  const jsLength = text.length;
  const codePointCount = codePoints.length;
  const byteLength = Buffer.byteLength(text, "utf8");

  if (jsLength < MIN_CHARACTERS || jsLength > MAX_CHARACTERS) {
    reasons.push(
      `JS string length ${jsLength} is outside the gate range ` +
        `${MIN_CHARACTERS} to ${MAX_CHARACTERS} characters.`,
    );
  }

  if (codePointCount !== 1) {
    reasons.push(
      `Entry must be exactly one code point, found ${codePointCount}.`,
    );
  }

  if (text.trim().length === 0) {
    reasons.push("Entry is only whitespace.");
  }

  if (codePointCount === 1 && !EMOJI_PATTERN.test(text)) {
    reasons.push("Entry is not a single emoji presentation character.");
  }

  if (text.includes("\n") || text.includes("\r")) {
    reasons.push("Entry must not contain a newline.");
  }

  return { ok: reasons.length === 0, reasons, jsLength, codePointCount, byteLength };
}

/** Resolve the output directory: the grader sets MAKEFUN_OUTPUT_DIR. */
function resolveOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv.trim().length > 0) {
    return fromEnv;
  }
  return join(process.cwd(), "output");
}

/** Print the verification report for one validation result. */
function printReport(label: string, text: string, result: ValidationResult): void {
  console.log(`--- ${label} ---`);
  console.log(`entry: ${text}`);
  console.log(`emoji: ${CHOSEN_EMOJI_NAME}`);
  console.log(`JS string length: ${result.jsLength}`);
  console.log(`code-point count: ${result.codePointCount}`);
  console.log(`UTF-8 byte length: ${result.byteLength}`);
  console.log(`valid: ${result.ok ? "yes" : "no"}`);
  if (!result.ok) {
    for (const reason of result.reasons) {
      console.log(`  - ${reason}`);
    }
  }
}

function main(): void {
  // Step 1: validate the chosen emoji before anything is written.
  const before = validateEntry(CHOSEN_EMOJI);
  printReport("Pre-write validation", CHOSEN_EMOJI, before);
  if (!before.ok) {
    console.error("Chosen emoji failed validation, refusing to write.");
    process.exit(1);
  }

  // Step 2: write exactly the emoji, with no trailing newline or text.
  const outputDir = resolveOutputDir();
  mkdirSync(outputDir, { recursive: true });
  const outputPath = join(outputDir, "entry.txt");
  writeFileSync(outputPath, CHOSEN_EMOJI, "utf8");
  console.log(`wrote: ${outputPath}`);

  // Step 3: read back what was written and verify it byte for byte.
  // Compare both the decoded string and the raw bytes, so a stray
  // newline, BOM or second glyph cannot slip past a string comparison.
  const readBack = readFileSync(outputPath, "utf8");
  const readBackBytes = readFileSync(outputPath);
  const expectedBytes = Buffer.from(CHOSEN_EMOJI, "utf8");
  const after = validateEntry(readBack);
  printReport("Read-back self-check", readBack, after);
  if (!after.ok || readBack !== CHOSEN_EMOJI) {
    console.error("Read-back self-check failed: file does not hold exactly the chosen emoji.");
    process.exit(1);
  }
  if (!readBackBytes.equals(expectedBytes)) {
    console.error(
      `Read-back self-check failed: file bytes (${readBackBytes.length}) ` +
        `do not match the chosen emoji bytes (${expectedBytes.length}).`,
    );
    process.exit(1);
  }

  console.log("OK: entry.txt holds exactly one emoji, verified by read-back.");
}

main();
