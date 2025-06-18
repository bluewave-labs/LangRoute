
<h1 align="center"><a href="https://bluewavelabs.ca" target="_blank">LangRoute</a></h1>

<p align="center"><strong>A robust and configurable LLM proxy server built with Nextjs, Shadcn, Node.js, Express and PostgreSQL. </strong></p>

<img width="1463" alt="image" src="https://github.com/user-attachments/assets/e5df3a9c-c948-42d4-b260-d7086ccb4650" />


## Overview  
Langroute is a flexible LLM proxy that routes, throttles, and logs calls across multiple model providers. Core logic runs on Node.js, Express, and PostgreSQL, while a Next.js + shadcn UI lets admins tweak configs and watch metrics. One endpoint in, the best model out. 

## Features  
- **Multi-model support**  
  - Connect OpenAI, Anthropic, Cohere, Azure OpenAI, or any local model.  
- **Smart routing**  
  - Pick the fastest, cheapest, or most accurate model on every request.  
  - Auto-retry with multi-provider fallback when a vendor hiccups.  
- **Rate limits**  
  - Enforce per-key and per-tenant caps. Default limiter is in-memory; Redis is plug-and-play.  
- **Logging & monitoring**  
  - Track latency, token spend, and full request metadata (prompts redacted in privacy mode).  
  - Ship metrics straight to Prometheus or Grafana.  
- **Security & privacy**  
  - Tenant isolation via row-level security.  
  - Keys encrypted at rest and stripped from logs.  
- **Admin & dev tools**  
  - Web playground for side-by-side model tests.  
  - Hot-reload configs without downtime.  
  - Toggle cache, rate limits, and routing rules from the dashboard.

## Architecture  
1. **Unified API** – Send a standard `/v1/chat/completions` call.  
2. **Routing engine** – Reads weights, prices, and health stats, then decides which adapter fires.  
3. **Provider adapters** – Translate the internal format to OpenAI, Anthropic, Cohere, Azure, or your local endpoint.  
4. **Middleware chain** – Handles auth, validation, caching, and token counting.  
5. **Async workers** – Push logs and metrics to Postgres and observability backends.

## Tech stack  
| Layer | Tooling |
|-------|---------|
| HTTP server | Node.js, Express |
| Admin UI | Next.js, shadcn/ui |
| Language | Typescript |
| Data store | PostgreSQL (Redis optional) |


