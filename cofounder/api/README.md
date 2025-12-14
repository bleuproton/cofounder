# Cofounder API

## LLM provider configuration
- Default provider: OpenAI using `OPENAI_API_KEY`.
- Alternative provider: set `LLM_PROVIDER=anthropic` with `ANTHROPIC_API_KEY`.
- OpenAI-compatible endpoints (e.g., hosted models): set `LLM_PROVIDER=custom` (or `openai-compatible`) and provide:
  - `AI_API_KEY` (or continue to use `OPENAI_API_KEY`).
  - `AI_API_BASE_URL` (or `OPENAI_BASE_URL`) pointing at the compatible endpoint.

Inference and embedding requests will use the selected provider where available; if a provider does not implement embeddings the code falls back to the OpenAI-compatible implementation.
