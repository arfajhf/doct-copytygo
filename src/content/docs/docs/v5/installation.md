---
title: "Installation"
description: "Installation for CopyTyGo v5.0.0."
---

## Requirements

- **Go 1.27.1+**, as specified in the framework’s `go.mod`.
- **Node.js 22+** for frontend development.
- MySQL or PostgreSQL for database-backed features.

## Install the CLI v5.0.0

```bash
go install github.com/arfajhf/copytygo/v5/cmd/ctg@v5.0.0
ctg version
```

Add the Go binary directory to `PATH` if `ctg` cannot be found. On Windows, this is usually `%USERPROFILE%\go\bin`.

```bash
ctg new
```

The interactive installer offers database, authentication, frontend preset, and Studio options. For the non-interactive workflow:

```bash
ctg new online-store
cd online-store
ctg dev
```

## Windows and WSL

On Windows, Native Runtime uses the project-local `build/dev/app.exe` binary. On Linux/macOS, use `ctg dev --build` for the same project-local build behavior. If a Windows policy blocks execution, refer to the upstream WSL and Windows diagnostics guides. Do not disable system protections.

[Continue to Getting Started →](/docs/v5/getting-started/)

---
Versioned sources `v5.0.0`: [README.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/README.md) · [go.mod](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/go.mod) · [docs/WSL_DEVELOPMENT.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/docs/WSL_DEVELOPMENT.md) · [docs/WINDOWS_DEVELOPMENT.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/docs/WINDOWS_DEVELOPMENT.md).

