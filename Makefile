.PHONY: help install dev-client dev-server dev build build-client build-server test

help:
	@echo "SiftVault — available commands:"
	@echo "  make install       Install all workspace dependencies"
	@echo "  make dev-client    Start the frontend dev server (http://localhost:3000)"
	@echo "  make dev-server    Start the backend dev server (http://localhost:3001)"
	@echo "  make dev           Start both frontend and backend"
	@echo "  make build         Build both frontend and backend"
	@echo "  make build-client  Build the frontend"
	@echo "  make build-server  Build the backend"
	@echo "  make test          Run tests across all workspaces"

install:
	npm install

dev-client:
	npm run dev -w @siftvault/client

dev-server:
	npm run dev -w @siftvault/server

dev:
	@trap 'kill 0' EXIT; \
	npm run dev -w @siftvault/server & \
	npm run dev -w @siftvault/client & \
	wait

build:
	npm run build

build-client:
	npm run build -w @siftvault/client

build-server:
	npm run build -w @siftvault/server

test:
	npm test
