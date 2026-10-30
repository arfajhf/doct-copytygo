---
title: "Database"
description: "Configure MySQL or PostgreSQL in CopyTyGo and learn how models, query builders, relationships, transactions, and generated resources fit together."
---

CopyTyGo supports **MySQL and PostgreSQL** through `database/sql`. The query builder validates table and column identifiers and supported operators.

## Connection

```dotenv
DB_DRIVER=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=app
DB_USERNAME=app
DB_PASSWORD=your-local-password
```

```bash
ctg db:check
ctg migrate:status
```

For PostgreSQL, select the driver in the installer and configure the connection for your database.

## Models and resources

Data flow: handler → Context → `database.Resource` / `model.Model` → query builder → database. Relationship helpers include `HasOne`, `HasMany`, and `BelongsTo`. The framework also provides transactions, seeders, and factories.

```bash
ctg make:resource Product name:string price:decimal stock:integer active:boolean description:text?
```

The generator creates a model, database-backed controller, migration, validation, REST routes, timestamps, and soft deletes. Resources are private by default; install authentication and read the [resource security guide](/docs/v5/resource-generator/).

## Resource list queries

```text
/products?page=2&per_page=20
/products?q=keyboard
/products?sort=price&order=desc
/products?filter[stock]=10
```

Search, filter, and sort use generated allowlists. Do not assume every column can be queried automatically.

---
Versioned sources `v5.0.0`: [docs/ARCHITECTURE.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/docs/ARCHITECTURE.md) · [docs/PRODUCTION.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/docs/PRODUCTION.md) · [database/resource.go](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/database/resource.go) · [README.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/README.md).

