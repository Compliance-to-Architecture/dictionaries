<div align="center">

# Compliance-to-Architecture / dictionaries

**Canonical taxonomies for the Compliance-to-Architecture Framework™. Schema-versioned JSON.**

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0) [![Status](https://img.shields.io/badge/status-public%20OSS-brightgreen.svg)](#) [![Spec](https://img.shields.io/badge/spec-v0.1-orange.svg)](#) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#) [![Dictionaries](https://img.shields.io/badge/dictionaries-8-success.svg)](dictionaries/)

</div>

---

## Dictionaries shipped

| File | Terms | Purpose |
| --- | --- | --- |
| `actor-role.json` | 6 | RACI personas (agent, auditor, compliance-owner, data-owner, framework-curator, security-officer) |
| `architecture-capability.json` | 20 | System capability taxonomy |
| `authority-category.json` | 10 | Government, supranational, industry-body, etc. |
| `control-category.json` | 13 | Preventive / detective / corrective / compensating / mitigating |
| `evidence-frequency.json` | 8 | Realtime / daily / weekly / monthly / quarterly / semi-annually / annually / on-event |
| `evidence-type.json` | 16 | Policy / procedure / log / screenshot / report / attestation / configuration / training-record / incident-record / fria / dpia / contract / model-card / data-card / audit-trail-export / access-review |
| `obligation-category.json` | 12 | Substantive obligation taxonomy |
| `reason-code.json` | 16 | Decision rationale codes |

## Schema

Each dictionary follows `regunav.dictionary.v1`: `{ schemaVersion, id, displayName, description, version, publishedAt, category, terms[] }`.

## Versioning

Adding/removing a term is a minor version bump. Renaming or removing a stable term is a major version bump.

---

## Sibling repos

| Repo | What |
| --- | --- |
| [`framework`](https://github.com/Compliance-to-Architecture/framework) | 25 framework dictionaries + crosswalks + policy-as-code compile targets |
| [`ontology`](https://github.com/Compliance-to-Architecture/ontology) | JSON-LD ontology + schemas + IaC examples |
| [`sector-packs`](https://github.com/Compliance-to-Architecture/sector-packs) | Maritime / legal / oil-and-gas vertical bundles |
| [`dictionaries`](https://github.com/Compliance-to-Architecture/dictionaries) | Canonical taxonomies (8 JSON dictionaries) |
| [`playbooks`](https://github.com/Compliance-to-Architecture/playbooks) | Skill files + worked examples |

## Provenance

Mirrored from the upstream [ReguNav/app](https://github.com/ReguNav/app) monorepo. Apache-2.0 contributions welcome — by contributing you agree your contribution is Apache-2.0.

[![Site](https://img.shields.io/badge/compliancetoarchitecture.com-→-1F6FEB.svg)](https://compliancetoarchitecture.com)
