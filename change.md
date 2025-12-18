# Changelog

## 2024-11-07
- Added block-based GET pipeline for `/api/projects/list` so responses can be extended with optional data (e.g., SaaS providers) without breaking existing consumers.
- Introduced SaaS provider sample config (`cofounder/api/db/config/saas.example.json`) and safe loader to expose public integration metadata.
- Added reusable block runner utility with coverage via `node --test` to keep the pipeline testable.
