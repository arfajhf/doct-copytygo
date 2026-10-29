---
title: "Introduction to CopyTyGo"
description: "Introduction to CopyTyGo for CopyTyGo v5.0.0."
---

CopyTyGo brings together a Go backend, a TypeScript frontend workflow, the `ctg` CLI, and Studio for local development.

This documentation covers **v5.0.0**, the first public stable release. v4.0.6 was an internal prelaunch milestone.

## Development workflow

1. [Install the CLI](/docs/v5/installation/).
2. [Create an application](/docs/v5/getting-started/) and choose MySQL or PostgreSQL.
3. Add [authentication](/docs/v5/authentication/) and [resources](/docs/v5/resource-generator/).
4. Run the checks before [deployment](/docs/v5/deployment/).

## Architecture

`core.Application` implements `http.Handler`. Requests pass through middleware, the router, and a handler before a Context response is returned. Application services include cache, events, mail, storage, queue, scheduler, and health.

Frontend presets include TypeScript, React, Vue, and API-only. Native Runtime runs the complete Go application; Lite Runtime is an opt-in development mode with limits on background Go execution.

## Version boundaries

Changes on the `main` branch do not automatically become stable documentation. See [Releases](/releases/) for release metadata and [Changelog](/changelog/) for upstream notes.

---
Versioned sources `v5.0.0`: [README.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/README.md) · [docs/ARCHITECTURE.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/docs/ARCHITECTURE.md).

