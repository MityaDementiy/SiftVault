[![Node.js CI](https://github.com/MityaDementiy/SiftVault/actions/workflows/node.js.yml/badge.svg)](https://github.com/MityaDementiy/SiftVault/actions/workflows/node.js.yml)


# SiftVault

RSS aggregator (MVP). TypeScript monorepo.

## Stack

- **Frontend:** TanStack Start, TanStack Query, Tailwind CSS, Shadcn/ui
- **Backend:** Node.js, Fastify, Mongoose
- **Database:** MongoDB

## Structure

```
SiftVault/
├── client/   # TanStack Start frontend
└── server/   # Fastify + Mongoose API
```

Managed with npm workspaces. Tasks are run through the root `Makefile`.

## Getting started

```bash
make install      # install all workspace dependencies
make dev-client   # start the frontend at http://localhost:3000
make dev-server   # start the backend at http://localhost:3001
make dev          # start both frontend and backend
make build        # build both frontend and backend
make test         # run tests across all workspaces
make lint         # run ESLint across all workspaces
```

## Linting

ESLint is configured for both workspaces on the [Airbnb style guide](https://github.com/airbnb/javascript) (`eslint-config-airbnb` / `eslint-config-airbnb-typescript`), with semicolons enforced. Run `make lint` to check both, or `npm run lint -w @siftvault/client` / `-w @siftvault/server` individually.

A Husky `pre-commit` hook runs `npm test` and `npm run lint` to block commits that don't pass tests or linting.

Run `make help` to list available commands.

## MVP scope

- Auth: user registration & login
- Subscriptions: add/remove RSS feeds
- Parsing: fetch titles & links ("Title — Source")
- Read status: track after click
- Responsive, mobile-friendly UI
