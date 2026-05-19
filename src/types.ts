/**
 * @regunav/dictionaries — types
 * Apache-2.0. Copyright (c) 2026 Regunav Inc.
 *
 * Mirror of packages/ontology/schemas/dictionary.schema.json.
 * Hand-maintained because we don't want a runtime JSON-Schema-to-TS step in
 * this package — the schema is the source of truth, these types are the
 * type-checker's view of it.
 */

export type DictionaryCategory =
  | "obligation-category"
  | "control-category"
  | "evidence-type"
  | "evidence-frequency"
  | "authority-category"
  | "architecture-capability"
  | "actor-role"
  | "reason-code"
  | "jurisdiction"
  | "regulator"
  | "risk-class";

export interface DictionaryReference {
  readonly authorityId: string;
  readonly clause: string;
  readonly url?: string;
}

export interface DictionaryTermDeprecation {
  readonly since: string;
  readonly replacedBy: string;
  readonly reason?: string;
}

export interface DictionaryTerm {
  readonly id: string;
  readonly term: string;
  readonly definition: string;
  readonly synonyms?: readonly string[];
  readonly references?: readonly DictionaryReference[];
  readonly tags?: readonly string[];
  readonly deprecated?: DictionaryTermDeprecation;
}

export interface Dictionary {
  readonly schemaVersion: "regunav.dictionary.v1";
  readonly id: string;
  readonly displayName: string;
  readonly description?: string;
  readonly version: string;
  readonly publishedAt: string;
  readonly supersedes?: string;
  readonly category: DictionaryCategory;
  readonly terms: readonly DictionaryTerm[];
}
