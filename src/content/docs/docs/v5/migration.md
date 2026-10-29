---
title: "Migration"
description: "Migration for CopyTyGo v5.0.0."
---

The CLI and Studio share the same migration engine: project source → AST loader → registry → schema blueprint → dialect-specific SQL → migration repository.

## Workflow

```bash
ctg make:migration create_products_table
ctg migrate:status
ctg migrate
```

Review the generated files in `database/migrations/` before applying schema changes.

## Rollback and destructive operations

```bash
ctg migrate:rollback
```

`migrate:reset` and `migrate:fresh` are also available. Both can remove structures or data; understand the changes and prepare backups before using them. Destructive commands require `--force` in production. This flag does not replace review or backups.

## Deployment verification

```bash
ctg db:check
ctg migrate:status
```

Run migrations through a controlled deployment procedure before verifying application health.

---
Versioned sources `v5.0.0`: [cli/migration.go](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/cli/migration.go) · [docs/ARCHITECTURE.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/docs/ARCHITECTURE.md) · [docs/PRODUCTION.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/docs/PRODUCTION.md).

