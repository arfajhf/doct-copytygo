---
title: "Queue"
description: "Queue for CopyTyGo v5.0.0."
---

## Driver

| Driver | Behavior |
| --- | --- |
| `sync` | Executes named jobs immediately |
| `memory` | In-process workers, retries/backoff, delayed dispatch |
| `database` | Persistent MySQL/PostgreSQL jobs, reservation, retries, failed jobs |

Project defaults:

```dotenv
QUEUE_DRIVER=memory
QUEUE_WORKERS=1
QUEUE_POLL_SECONDS=1
QUEUE_BACKOFF_SECONDS=1
```

Use the `database` driver for production jobs that must survive application restarts.

## Named job

```bash
ctg make:job SendWelcomeEmail
```

Named jobs are registered in the project registry. Dispatch them from application code using an available context:

```go
queue.DispatchNamed(ctx, "SendWelcomeEmail", queue.Payload{
    "user_id": 42,
})
```

Import `github.com/arfajhf/copytygo/v5/queue`. Delayed jobs use `queue.DispatchOptions`. Executing arbitrary Go background jobs requires Native Runtime; Lite has the limits described upstream.

---
Versioned sources `v5.0.0`: [README.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/README.md) · [docs/ARCHITECTURE.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/docs/ARCHITECTURE.md) · [queue/queue.go](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/queue/queue.go).

