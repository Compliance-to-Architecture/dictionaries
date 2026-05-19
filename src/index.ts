/**
 * @regunav/dictionaries
 * Apache-2.0. Copyright (c) 2026 Regunav Inc.
 *
 * Versioned, content-addressable term sets used across rule packs and
 * engines. The JSON files in ./dictionaries are the source of truth; this
 * module loads them at import time and exposes typed accessors.
 *
 * Engines MUST resolve term references via this package and MUST NOT
 * silently coin new terms — unknown terms surface as `evidence.invalid` or
 * `rule-pack.deprecated-rule` reason codes from the host engine.
 */
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { Dictionary, DictionaryCategory, DictionaryTerm } from "./types.js";

export * from "./types.js";

const here = dirname(fileURLToPath(import.meta.url));
// In source layout `src/index.ts` and in dist layout `dist/index.js` both
// sit one level under the package root, so `..` lands at the package root.
const dictsDir = join(here, "..", "dictionaries");

function load(name: string): Dictionary {
  return JSON.parse(readFileSync(join(dictsDir, `${name}.json`), "utf-8")) as Dictionary;
}

export const obligationCategoryDictionary    = load("obligation-category");
export const controlCategoryDictionary       = load("control-category");
export const evidenceTypeDictionary          = load("evidence-type");
export const evidenceFrequencyDictionary     = load("evidence-frequency");
export const authorityCategoryDictionary     = load("authority-category");
export const architectureCapabilityDictionary = load("architecture-capability");
export const actorRoleDictionary             = load("actor-role");
export const reasonCodeDictionary            = load("reason-code");

export const dictionaries: readonly Dictionary[] = Object.freeze([
  obligationCategoryDictionary,
  controlCategoryDictionary,
  evidenceTypeDictionary,
  evidenceFrequencyDictionary,
  authorityCategoryDictionary,
  architectureCapabilityDictionary,
  actorRoleDictionary,
  reasonCodeDictionary,
]);

/** Stable canonicalisation: object keys sorted, arrays preserved. */
function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + canonical(obj[k])).join(",") + "}";
}

/** SHA-256 of the canonical JSON form of a dictionary — pin this in audit trail. */
export function hashDictionary(d: Dictionary): string {
  return createHash("sha256").update(canonical(d)).digest("hex");
}

const byId = new Map<string, Dictionary>(dictionaries.map((d) => [d.id, d]));
const byCategory = new Map<DictionaryCategory, Dictionary>(
  dictionaries.map((d) => [d.category, d]),
);

export function getDictionaryById(id: string): Dictionary | undefined {
  return byId.get(id);
}

export function getDictionaryByCategory(category: DictionaryCategory): Dictionary | undefined {
  return byCategory.get(category);
}

/**
 * Look up a term by its canonical key (`term` field) within a category.
 * Returns undefined if the dictionary does not exist or the term is absent.
 */
export function resolveTerm(
  category: DictionaryCategory,
  term: string,
): DictionaryTerm | undefined {
  const d = byCategory.get(category);
  if (!d) return undefined;
  // synonyms are part of the resolution contract — match either canonical
  // term or any listed synonym, but always return the canonical entry.
  return d.terms.find(
    (t) => t.term === term || (t.synonyms?.includes(term) ?? false),
  );
}

/** Returns true iff `term` is present (canonically or by synonym) in `category`. */
export function isKnownTerm(category: DictionaryCategory, term: string): boolean {
  return resolveTerm(category, term) !== undefined;
}
