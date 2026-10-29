---
title: "CLI"
description: "CLI for CopyTyGo v5.0.0."
---

Run commands from the generated project directory.

| Command | Purpose |
| --- | --- |
| `ctg new` | Interactive installer |
| `ctg new online-store` | Creates a named project |
| `ctg dev` | Native Go + Vite |
| `ctg dev --build` | Native Runtime with a project-local binary |
| `ctg dev --lite` | Lite Runtime opt-in |
| `ctg build` | Builds the application and frontend |
| `ctg doctor` | Project diagnostics |
| `ctg doctor --db --production` | Production checks |
| `ctg route:list` | Lists routes |
| `ctg open` | Opens the application |
| `ctg studio` | Opens Studio |
| `ctg key:generate` | Generates an application key |
| `ctg env:format` | Formats dotenv setting groups |
| `ctg resource:sync` | Synchronizes resource protection |

## Generator

```bash
ctg make:controller ProductController
ctg make:model Product
ctg make:migration create_products_table
ctg make:job SendWelcomeEmail
```

Other generators include `make:middleware`, `make:service`, `make:listener`, `make:seeder`, `make:factory`, and `make:mail`.

Read the [resource generator](/docs/v5/resource-generator/) and [migration](/docs/v5/migration/) guides before running commands that modify your application.

---
Versioned sources `v5.0.0`: [cli/cli.go](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/cli/cli.go) · [cli/commands.go](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/cli/commands.go) · [README.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/README.md).

