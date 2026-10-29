---
title: "Examples"
description: "Examples based on the CopyTyGo v5.0.0 source."
---

## Product resource

This generator workflow comes from the upstream README. Run it in a project with its database and authentication configured:

```bash
ctg make:resource Product name:string price:decimal stock:integer active:boolean description:text?
ctg migrate
ctg dev
```

Inspect the generated routes with `ctg route:list`. Resources are private by default; read the [access rules](/docs/v5/resource-generator/). This recipe is based on framework source and has not been tested as an integration example by this website.

## Go handler

Excerpt from the upstream `example/main.go`:

```go
app.Get("/", func(ctx *core.Context) error {
    return ctx.JSON(core.Map{"framework": "CopyTyGo", "version": "1.0.0", "status": "running"})
}).Name("home")
```

The `version` value in this excerpt is the upstream example payload, not the framework version. [Read the complete application](https://github.com/arfajhf/copytygo/blob/v5.0.0/example/main.go) for imports, configuration, and the server lifecycle.

## Frontend and background jobs

- [TypeScript client](/docs/v5/frontend/)
- [Dispatch named job](/docs/v5/queue/)
- [Interval and cron scheduling](/docs/v5/scheduler/)

All examples refer to the `v5.0.0` source. End-to-end application testing requires the appropriate Go and Node versions and a configured database.
