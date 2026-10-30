---
title: "Scheduler"
description: "Schedule CopyTyGo background tasks with fixed intervals or five-field cron expressions, and inspect runtime state through the local Studio."
---

The scheduler supports fixed intervals, `EveryMinute`, `Hourly`, `Daily`, and five-field cron expressions.

## Interval

Registration excerpt from the upstream README:

```go
scheduler.Default.Hourly("reports", func(ctx context.Context) error {
    return nil
})
```

## Cron

```go
scheduler.Default.Cron(
    "weekday-report",
    "0 8 * * 1-5",
    func(ctx context.Context) error {
        return nil
    },
)
```

These excerpts require the `context` and `github.com/arfajhf/copytygo/v5/scheduler` imports. Register them within your application lifecycle. The callbacks above do not implement any business logic yet.

The runtime tracks the next run, last run, run count, and last error. Studio provides a scheduler inspector. Application shutdown cancels the background context and stops workers. Do not assume cross-instance coordination or exactly-once execution without additional implementation.

---
Versioned sources `v5.0.0`: [README.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/README.md) · [docs/ARCHITECTURE.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/docs/ARCHITECTURE.md) · [scheduler/scheduler.go](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/scheduler/scheduler.go).

