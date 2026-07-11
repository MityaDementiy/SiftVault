# SiftVault

RSS aggregator (MVP). TypeScript monorepo.

## Stack

- **Frontend:** TanStack Start, TanStack Query, Tailwind CSS, Shadcn/ui
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB

## Structure

```
SiftVault/
├── client/   # TanStack Start frontend
└── server/   # Express + Mongoose API
```

Managed with npm workspaces. Tasks are run through the root `Makefile`.

## Getting started

```bash
make install      # install all workspace dependencies
make dev-client   # start the frontend at http://localhost:3000
```

Run `make help` to list available commands.

## MVP scope

- Auth: user registration & login
- Subscriptions: add/remove RSS feeds
- Parsing: fetch titles & links ("Title — Source")
- Read status: track after click
- Responsive, mobile-friendly UI
