DOCKER_COMPOSE ?= docker compose

.PHONY: build network network-down
build:
	${DOCKER_COMPOSE} build --no-cache

network:
	${DOCKER_COMPOSE} up -d

network-down:
	${DOCKER_COMPOSE} down -v --remove-orphans

