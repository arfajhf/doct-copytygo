---
title: "Examples"
description: "Contoh berdasarkan source CopyTyGo v5.0.0."
---

## Resource Product

Contoh alur generator dari README upstream. Jalankan pada proyek yang database dan auth-nya telah dikonfigurasi:

```bash
ctg make:resource Product name:string price:decimal stock:integer active:boolean description:text?
ctg migrate
ctg dev
```

Lihat route yang dihasilkan melalui `ctg route:list`. Resource privat secara default; baca [aturan akses](/docs/v5/resource-generator/). Ini resep dari source, belum diklaim sebagai contoh integrasi yang diuji pada website ini.

## Handler Go

Cuplikan dari `example/main.go` upstream:

```go
app.Get("/", func(ctx *core.Context) error {
    return ctx.JSON(core.Map{"framework": "CopyTyGo", "version": "1.0.0", "status": "running"})
}).Name("home")
```

`version` di cuplikan tersebut adalah nilai payload contoh upstream, bukan versi framework. [Baca aplikasi lengkap](https://github.com/arfajhf/copytygo/blob/v5.0.0/example/main.go) untuk import, konfigurasi, dan lifecycle server.

## Frontend dan background jobs

- [Client TypeScript](/docs/v5/frontend/)
- [Dispatch named job](/docs/v5/queue/)
- [Jadwal interval dan cron](/docs/v5/scheduler/)

Semua contoh merujuk source `v5.0.0`. Pengujian aplikasi end-to-end membutuhkan Go, Node, dan database yang sesuai.
