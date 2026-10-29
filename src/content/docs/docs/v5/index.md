---
title: "Pengantar CopyTyGo"
description: "Pengantar CopyTyGo untuk CopyTyGo v5.0.0."
---

CopyTyGo memadukan backend Go dengan alur frontend TypeScript, CLI `ctg`, dan Studio untuk pengembangan lokal.

Dokumentasi ini mengacu pada **v5.0.0**, rilis publik stabil pertama. v4.0.6 merupakan milestone internal prapeluncuran.

## Alur pengembangan

1. [Instal CLI](/docs/v5/installation/).
2. [Buat aplikasi](/docs/v5/getting-started/) dan pilih MySQL atau PostgreSQL.
3. Tambahkan [authentication](/docs/v5/authentication/) dan [resource](/docs/v5/resource-generator/).
4. Jalankan pemeriksaan sebelum [deployment](/docs/v5/deployment/).

## Arsitektur

`core.Application` mengimplementasikan `http.Handler`. Request melewati middleware, router, handler, lalu respons Context. Layanan aplikasi mencakup cache, events, mail, storage, queue, scheduler, dan health.

Frontend tersedia dalam preset TypeScript, React, Vue, atau API-only. Native Runtime menjalankan aplikasi Go lengkap; Lite Runtime bersifat opt-in untuk pengembangan dengan batasan eksekusi background Go.

## Batas versi

Perubahan pada branch `main` tidak otomatis menjadi dokumentasi stabil. Lihat [Releases](/releases/) untuk metadata rilis dan [Changelog](/changelog/) untuk catatan upstream.

---
Sumber versi `v5.0.0`: [README.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/README.md) · [docs/ARCHITECTURE.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/docs/ARCHITECTURE.md).

