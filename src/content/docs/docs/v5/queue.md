---
title: "Queue"
description: "Queue untuk CopyTyGo v5.0.0."
---

## Driver

| Driver | Perilaku |
| --- | --- |
| `sync` | Eksekusi named job langsung |
| `memory` | Worker dalam proses, retry/backoff, delayed dispatch |
| `database` | Job persisten di MySQL/PostgreSQL, reservation, retry, failed jobs |

Default proyek:

```dotenv
QUEUE_DRIVER=memory
QUEUE_WORKERS=1
QUEUE_POLL_SECONDS=1
QUEUE_BACKOFF_SECONDS=1
```

Gunakan driver `database` untuk pekerjaan produksi yang harus bertahan setelah restart.

## Named job

```bash
ctg make:job SendWelcomeEmail
```

Job bernama didaftarkan pada registry proyek. Dispatch dari kode aplikasi dengan context yang tersedia:

```go
queue.DispatchNamed(ctx, "SendWelcomeEmail", queue.Payload{
    "user_id": 42,
})
```

Import package `github.com/arfajhf/copytygo/v5/queue`. Delayed jobs menggunakan `queue.DispatchOptions`. Eksekusi arbitrary Go background job membutuhkan Native Runtime; Lite mempunyai batasan yang dijelaskan upstream.

---
Sumber versi `v5.0.0`: [README.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/README.md) · [docs/ARCHITECTURE.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/docs/ARCHITECTURE.md) · [queue/queue.go](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/queue/queue.go).

