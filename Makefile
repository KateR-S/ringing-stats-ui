# Makefile for Ringing Stats UI

.PHONY: help install dev build start stop clean docker-build docker-up docker-down docker-dev format lint test

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm install

dev: ## Run development server
	npm run dev

build: ## Build for production
	npm run build

start: ## Start production server
	npm start

format: ## Format code with Prettier
	npm run format

format-check: ## Check code formatting
	npm run format:check

lint: ## Run ESLint
	npm run lint

type-check: ## Run TypeScript type checking
	npx tsc --noEmit

# Docker commands
docker-build: ## Build Docker image
	docker-compose build

docker-up: ## Start Docker container (production)
	docker-compose up -d

docker-down: ## Stop Docker container
	docker-compose down

docker-dev: ## Start Docker container (development with hot-reload)
	docker-compose --profile dev up -d ringing-stats-ui-dev

docker-dev-logs: ## View logs for development container
	docker-compose logs -f ringing-stats-ui-dev

docker-logs: ## View logs for production container
	docker-compose logs -f

docker-clean: ## Remove Docker containers and images
	docker-compose down -v
	docker rmi ringing-stats-ui -f 2>/dev/null || true

stop: ## Stop all services
	docker-compose down

clean: ## Clean build artifacts and dependencies
	rm -rf .next node_modules out build
	rm -f *.log
