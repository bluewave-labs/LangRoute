# LangRoute Glossary (future-proof)

**Access Key**
A secret issued by LangRoute to authenticate **client** requests to the gateway. Sent as `Authorization: Bearer <access_key>`. Stored in DB (plaintext for now; hashing later). Can be **revoked**, **rotated**, and **expired**.
Previously: **API Key** (`ApiKey` → `AccessKey`)

**Access Key Preview**
Non-sensitive display form of an Access Key (e.g., `lr_...ABCD`). Helps users distinguish keys without revealing the full secret. Usually “prefix + last 4”.
Previously: sometimes called “API key suffix/last4”.

**Access Key Rotation**
Replacing an existing Access Key with a new secret while keeping logical continuity (same project/user). Often a “create new + revoke old after grace period” workflow.
Previously: N/A

**Access Key Revocation**
Flagging an Access Key as invalid immediately. Requests using it should be rejected with 401.
Previously: sometimes “delete key”; now we prefer **revoke** (soft delete).

**Access Key Expiry**
Optional timestamp after which the key is unusable. Encouraged for good hygiene.
Previously: “expiresAt” existed; semantics unchanged.

---

**Provider Credential**
A server-side vendor credential used by LangRoute to call upstream LLM providers (OpenAI/Google/Anthropic). Lives in **env vars** only; never exposed to clients.
Previously: “provider API key”, “vendor key”.

**Provider**
An upstream LLM vendor (e.g., `openai`, `google`, `anthropic`).
Previously: same, but sometimes conflated with “adapter.”

**Provider ID**
String identifier for a provider (`'openai' | 'google' | 'anthropic' | ...`). Comes from the registry.
Previously: sometimes free-form strings.

---

**Adapter (Chat Completions Adapter)**
A small module that translates LangRoute’s **normalized** chat completions request into a provider’s API call, then normalizes the response back to the OpenAI-compatible shape.
Previously: “provider client,” “integration.”

**Adapter Router**
Factory that returns the right Adapter given a **Provider ID** (and possibly a **Model ID**). Example: `getAdapterForProvider(providerId)`.
Previously: “adapters/index.ts” (avoid using `index.ts` as an implementation file).

**Normalized Shape**
Our internal, provider-agnostic request/response format for Chat Completions (aligned to OpenAI’s schema).
Previously: loosely defined per call.

---

**Model Registry**
Single source of truth for available models and capabilities (provider, context window, max tokens, streaming/vision/functions support, pricing). Implemented in `lib/config/chat.ts`.
Previously: spread across multiple files.

**Model Config**
The entry in the registry for a specific model (`id`, `provider`, `maxTokens`, `supportsStreaming`, etc.).
Previously: similar, but duplicated types.

**Supported Model IDs**
A typed list derived from the registry; used for validation and routing.
Previously: hand-maintained arrays in multiple places.

**Role IDs**
Allowed message roles in chat requests (currently `system`, `user`, `assistant`). Centralized in the registry and reused by Zod schemas and services.
Previously: duplicated constants.

**Parameter Limits**
Generic (provider-agnostic) bounds for parameters like `temperature`, `top_p`, `max_tokens`, etc. Used **only** in Zod for basic shape validation; model-specific limits enforced in services.
Previously: mixed into validation and services inconsistently.

---

**Chat Completions (Operation)**
The canonical operation we expose, compatible with OpenAI’s `/v1/chat/completions`. It accepts a list of role‑tagged messages and returns a “completion” from the assistant.
Previously: often called just “chat.” We now use **Chat Completions** or just **Completions**.

**Canonical Endpoint**
`POST /v1/chat/completions` — OpenAI-compatible path for maximum ecosystem compatibility (SDKs, tools).
Previously: `/api/chat` (we keep it as an **internal alias**).

**Internal Alias**
`POST /api/chat` — convenient internal/testing endpoint that calls the same service as the canonical endpoint.
Previously: primary endpoint; now secondary.

---

**Request Context**
Structured identity resolved by middleware from the Access Key and attached to each request, e.g. `{ userId, accessKeyId }`. Used for attribution, usage, and policy.
Previously: sometimes inferred ad hoc or not passed through.

**ServiceError**
Our canonical exception for business-rule failures (e.g., invalid model, over limit). Routes catch and convert into consistent error envelopes.
Previously: various ad hoc errors.

**Error Envelope**
Standard JSON shape for errors: `{ error: { message, code }, requestId, ts }`. Produced by `errorService`.
Previously: inconsistent payloads.

**Zod Validation (v4)**
Input **shape** validation at the route boundary using Zod v4 (e.g., `z.uuid`, `z.email`). Business rules live in services.
Previously: some business checks baked into schemas.

---

**Streaming**
Returning partial tokens progressively when the model/adapter supports it. Requires `supportsStreaming` in the model config and a streaming-capable adapter.
Previously: not differentiated from “normal” responses.

**Function Calling / Tools**
Provider-specific ability to structure tool calls as part of a chat completion. Modeled as capability flags (`supportsFunctions`) and handled per adapter.
Previously: tangled with message roles or omitted.

**Vision**
Image input support; indicated via `supportsVision` in the model config.
Previously: mixed into models without capability checks.

**Context Window**
Total token budget the model can consider (input + output). A model-specific constraint used by services.
Previously: not enforced consistently.

**Max Tokens**
Upper bound for generated tokens for a model; enforced by services (`modelCfg.maxTokens`).
Previously: global limits in Zod.

---

**Usage Event** *(future)*
A record of prompt/completion tokens (and cost) attributed to `{ userId, accessKeyId }`. Foundation for budgets, analytics.
Previously: N/A

**Rate Limit** *(future)*
Policy that restricts request frequency or token volume per `{ userId, accessKeyId }`. Likely implemented with Redis token buckets.
Previously: N/A

**Budget / Quotas** *(future)*
Enforced caps per Access Key or user (daily/monthly token and/or dollar limits).
Previously: N/A

**Logs / Observability** *(future)*
Structured, real-time logs of requests/responses, possibly via Redis pub/sub to WebSocket clients.
Previously: console logs only.

---

**Provider Credentials Page (Admin)**
UI (server-managed) where admins configure vendor credentials (OpenAI/Google/Anthropic). These never leave the server.
Previously: “Integrations,” “Providers,” or “API keys.”

**Access Keys Page (User/Admin)**
UI where users create/see/revoke their **Access Keys** (gateway keys). Shows **Preview**, Created, Expires, Status.
Previously: “API Keys”.

---

**Session Auth**
NextAuth session for the **admin dashboard** (web UI). Independent of Access Key auth used for `/v1/chat/completions`.
Previously: mixed terminology (“auth”, “api key auth”).

**Team / Project / Workspace** *(future)*
Scopes to group users and Access Keys, enabling RBAC and budgets per group.
Previously: “teams” existed in Prisma but unused.

**RBAC (Role-Based Access Control)** *(future)*
Authorization model across dashboard and API (e.g., Admin, Member).
Previously: simple `Role` enum on `User`.

**Password Reset Token (VerificationToken)**
Temporary token used for credential resets (`/auth/forgot`, `/auth/reset`).
Previously: same.

**UUID IDs**
Primary key strategy across tables for consistency.
Previously: mixed `cuid`/`uuid`.

---

**Environment Config**
Strongly-typed loading of env vars (e.g., via Zod) for Provider Credentials and app secrets.
Previously: ad hoc `process.env.*` access.

**Secrets Management**
Guidelines to keep Provider Credentials in env vars (or secret managers) and never expose to the client.
Previously: implied, now explicit.

---

**Completions Service**
Backend service that enforces model/business rules and delegates to the appropriate **Adapter** for execution.
Previously: “ChatService”; we now prefer “CompletionsService” or “ChatCompletionsService”.

**Adapter Contract**
A TS interface that all provider adapters implement (inputs/outputs, streaming hooks).
Previously: informal; we’re formalizing it.

---

