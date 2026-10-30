---
title: "CopyTyGo Studio"
description: "Explore CopyTyGo Studio for local route, database, migration, queue, scheduler, and health inspection, with visual generators and production restrictions."
---

Studio is a local development workspace bundled with the framework.

```bash
ctg dev
ctg studio
```

Default URL: `http://127.0.0.1:8080/__copytygo` (adjust it to match the URL printed by the CLI).

## Inspectors and generators

Studio provides Dashboard, Routes, Models, Resources, Database, Migrations, Auth, Services, Queue, Scheduler, Requests, Errors, Logs, Generator, Health, and Doctor.

The CLI and Studio share migration and generator engines. The Auth inspector only queries safe user fields and never selects password hashes.

## Native and Lite

Native runs the complete application. Enable Lite explicitly with `ctg dev --lite`; arbitrary background Go execution still requires Native.

## Production

Studio is not registered when `APP_ENV=production`. Also set `COPYTYGO_STUDIO=false`. Verify that `/__copytygo` returns HTTP 404. Do not expose Studio through reverse-proxy exceptions.

---
Versioned sources `v5.0.0`: [README.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/README.md) · [docs/ARCHITECTURE.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/docs/ARCHITECTURE.md) · [docs/PRODUCTION.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/docs/PRODUCTION.md).

