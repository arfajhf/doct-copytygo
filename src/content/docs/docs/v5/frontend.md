---
title: "Frontend"
description: "Develop CopyTyGo frontends with TypeScript, React, Vue, and Vite. Learn about the API client, authentication UI, public assets, and production builds."
---

## Choose a preset

The installer supports **TypeScript + Vite**, **React + Vite**, **Vue + Vite**, and **API-only**. `ctg dev` starts Go and Vite; open the Go application origin so the frontend and API share the same origin.

## TypeScript client

The upstream `frontend/client.ts` client handles bearer tokens, the CSRF cookie, and JSON response parsing. These methods are taken from the original implementation:

```typescript
setToken(token: string) {
  this.token = token;
}

get<T>(path: string) {
  return this.request<T>(path);
}
```

These methods belong to the `CopyTyGoClient` class. This is a reference excerpt, not a standalone file. See the source for the complete implementation and client placement in the starter.

## Public assets

Store assets in `frontend/public/`. Access `frontend/public/images/banner.png` at `/images/banner.png`. The starter logo is available at `/logo.png`.

## Authentication UI

Edit `frontend/src/auth/views.ts`, `main.ts`, `api.ts`, and `style.css`. Authentication has a separate Vite entry, including in React/Vue presets. See [authentication](/docs/v5/authentication/).

## Build

```bash
ctg build
```

Deploy the entire `build/` directory, including the compiled frontend. Node.js is required for development and builds, but not on the production server.

---
Versioned sources `v5.0.0`: [frontend/client.ts](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/frontend/client.ts) · [docs/AUTHENTICATION.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/docs/AUTHENTICATION.md) · [docs/PUBLIC_ASSETS.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/docs/PUBLIC_ASSETS.md).

