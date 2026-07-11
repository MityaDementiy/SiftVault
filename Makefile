.PHONY: help install dev-client

help:
	@echo "SiftVault — available commands:"
	@echo "  make install     Install all workspace dependencies"
	@echo "  make dev-client  Start the frontend dev server (http://localhost:3000)"

install:
	npm install

dev-client:
	npm run dev -w @siftvault/client
