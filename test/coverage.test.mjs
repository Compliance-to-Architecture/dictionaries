/**
 * Coverage tests for @regunav/dictionaries.
 *
 * Purpose: each enum value in the existing TypeScript sources MUST resolve
 * to a term in the corresponding dictionary. When the enums and the JSON
 * files drift, this test fails — there is no other coupling between them.
 *
 * Run: node --test packages/dictionaries/test/coverage.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..", "..");
const dictsDir = join(repoRoot, "packages", "dictionaries", "dictionaries");
const ontologyTypes = readFileSync(
  join(repoRoot, "packages", "ontology", "src", "types.ts"),
  "utf-8",
);
const regunavTypes = readFileSync(
  join(repoRoot, "packages", "types", "src", "index.ts"),
  "utf-8",
);

function loadDict(name) {
  return JSON.parse(readFileSync(join(dictsDir, `${name}.json`), "utf-8"));
}

/**
 * Extract the string literal members of a TypeScript union type by name.
 * Robust enough for the well-formatted enums in this repo (one pipe per
 * line) — but explicitly NOT a TS parser. Tests will fail loudly if the
 * shape changes, which is the desired behaviour.
 */
function extractUnion(source, typeName) {
  const re = new RegExp(`export type ${typeName}\\s*=\\s*([^;]+);`, "m");
  const m = source.match(re);
  if (!m) throw new Error(`type ${typeName} not found`);
  const body = m[1];
  return [...body.matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

function termKeysOf(dict) {
  return new Set(dict.terms.map((t) => t.term));
}

function expectCoversUnion(dict, unionMembers, label) {
  const known = termKeysOf(dict);
  const missing = unionMembers.filter((m) => !known.has(m));
  assert.equal(
    missing.length,
    0,
    `${label}: dictionary missing ${missing.length} term(s): ${missing.join(", ")}`,
  );
}

test("ObligationCategory ⊆ obligation-category dictionary", () => {
  const dict = loadDict("obligation-category");
  expectCoversUnion(dict, extractUnion(ontologyTypes, "ObligationCategory"), "ObligationCategory");
});

test("ControlCategory ⊆ control-category dictionary", () => {
  const dict = loadDict("control-category");
  expectCoversUnion(dict, extractUnion(ontologyTypes, "ControlCategory"), "ControlCategory");
});

test("EvidenceType (ontology, 16 kinds) ⊆ evidence-type dictionary", () => {
  const dict = loadDict("evidence-type");
  const ontologyUnion = extractUnion(ontologyTypes, "EvidenceType");
  // The ontology enum uses dash-form ("training-record", "incident-record");
  // the underscored forms exist as schema aliases and are listed as synonyms
  // in the dictionary. The canonical-term coverage check uses the dash form.
  expectCoversUnion(dict, ontologyUnion, "EvidenceType (ontology)");
});

test("EvidenceType (types pkg, 12 kinds) resolves via dictionary (canonical or synonym)", () => {
  // The @regunav/types package uses the underscored aliases (e.g.
  // training_record); those must round-trip through the synonyms list.
  const dict = loadDict("evidence-type");
  const typesUnion = extractUnion(regunavTypes, "EvidenceType");
  const canonical = new Set(dict.terms.map((t) => t.term));
  const synonyms = new Set(dict.terms.flatMap((t) => t.synonyms ?? []));
  const missing = typesUnion.filter((m) => !canonical.has(m) && !synonyms.has(m));
  assert.equal(
    missing.length,
    0,
    `EvidenceType (types pkg) missing: ${missing.join(", ")}`,
  );
});

test("EvidenceFrequency ⊆ evidence-frequency dictionary", () => {
  const dict = loadDict("evidence-frequency");
  expectCoversUnion(dict, extractUnion(ontologyTypes, "EvidenceFrequency"), "EvidenceFrequency");
});

test("AuthorityCategory ⊆ authority-category dictionary", () => {
  const dict = loadDict("authority-category");
  expectCoversUnion(dict, extractUnion(ontologyTypes, "AuthorityCategory"), "AuthorityCategory");
});

test("ArchitectureCapability ⊆ architecture-capability dictionary", () => {
  const dict = loadDict("architecture-capability");
  expectCoversUnion(dict, extractUnion(ontologyTypes, "ArchitectureCapability"), "ArchitectureCapability");
});

test("AiActorRole ⊆ actor-role dictionary", () => {
  const dict = loadDict("actor-role");
  expectCoversUnion(dict, extractUnion(ontologyTypes, "AiActorRole"), "AiActorRole");
});

test("every term id has the form <category>:<slug>", () => {
  const all = [
    "obligation-category",
    "control-category",
    "evidence-type",
    "evidence-frequency",
    "authority-category",
    "architecture-capability",
    "actor-role",
    "reason-code",
  ];
  for (const name of all) {
    const d = loadDict(name);
    for (const t of d.terms) {
      assert.ok(
        t.id.startsWith(`${d.category}:`),
        `${name}: term id '${t.id}' does not start with '${d.category}:'`,
      );
    }
  }
});
