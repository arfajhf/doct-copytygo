---
title: "CLI"
description: "CLI untuk CopyTyGo v5.0.0."
---

Jalankan command dari direktori proyek yang dihasilkan.

| Command | Fungsi |
| --- | --- |
| `ctg new` | Installer interaktif |
| `ctg new toko-online` | Membuat proyek bernama |
| `ctg dev` | Native Go + Vite |
| `ctg dev --build` | Native dengan binary lokal proyek |
| `ctg dev --lite` | Lite Runtime opt-in |
| `ctg build` | Build aplikasi dan frontend |
| `ctg doctor` | Diagnostik proyek |
| `ctg doctor --db --production` | Pemeriksaan produksi |
| `ctg route:list` | Daftar route |
| `ctg open` | Membuka aplikasi |
| `ctg studio` | Membuka Studio |
| `ctg key:generate` | Membuat application key |
| `ctg env:format` | Format kelompok dotenv |
| `ctg resource:sync` | Sinkronisasi proteksi resource |

## Generator

```bash
ctg make:controller ProductController
ctg make:model Product
ctg make:migration create_products_table
ctg make:job SendWelcomeEmail
```

Generator lain: `make:middleware`, `make:service`, `make:listener`, `make:seeder`, `make:factory`, dan `make:mail`.

Baca [resource generator](/docs/v5/resource-generator/) dan [migration](/docs/v5/migration/) sebelum menjalankan command yang memodifikasi aplikasi.

---
Sumber versi `v5.0.0`: [cli/cli.go](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/cli/cli.go) · [cli/commands.go](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/cli/commands.go) · [README.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/README.md).

