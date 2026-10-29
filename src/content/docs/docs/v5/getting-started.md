---
title: "Getting Started"
description: "Getting Started for CopyTyGo v5.0.0."
---

## 1. Create a project

```bash
ctg new online-store
cd online-store
```

Run `ctg new` without a name to use the interactive installer. Choose the database and frontend preset for your application.

## 2. Configure the database

Edit `.env` with your local credentials. MySQL example:

```dotenv
DB_DRIVER=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=app
DB_USERNAME=app
DB_PASSWORD=your-local-password
```

```bash
ctg key:generate
ctg db:check
ctg migrate
```

## 3. Run the application

```bash
ctg doctor
ctg dev
```

Open the application URL printed by the CLI (default: `http://127.0.0.1:8080`). For frontend development, `ctg dev` starts Vite alongside the Go application. Vite reloads TypeScript changes; restart after changing Go code.

## 4. Add features

[Install authentication](/docs/v5/authentication/) before generating private resources. Open [Studio](/docs/v5/studio/) with `ctg studio`.

```bash
ctg route:list
ctg build
```

The application build produces a native binary and frontend assets. This documentation website has a separate Vite + TypeScript build process.

---
Versioned sources `v5.0.0`: [README.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/README.md) · [docs/INDEX.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/docs/INDEX.md) · [docs/PRODUCTION.md](https://github.com/arfajhf/copytygo/blob/203ce2554bb99fe41000c368a0213c22ec587711/docs/PRODUCTION.md).

