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

Managed with npm workspaces.

## Getting started

```bash
npm install
npm run dev:server   # start the API
npm run dev:client   # start the frontend
```

## MVP scope

- Auth: user registration & login
- Subscriptions: add/remove RSS feeds
- Parsing: fetch titles & links ("Title — Source")
- Read status: track after click
- Responsive, mobile-friendly UI
