ifndef PROJECT_NAME
PROJECT_NAME := galaxy-hub
endif

ifndef DOCKER_BIN
DOCKER_BIN := docker
endif

ifndef DOCKER_COMPOSE_BIN
DOCKER_COMPOSE_BIN := docker compose
endif

GOOGLE_CLIENT_ID := 82625263482-doqgh53hcmgkvh2talprr42q8qmhfbau.apps.googleusercontent.com 
GOOGLE_CLIENT_SECRET := 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
 
NEXTAUTH_SECRET := "6S/O3NU4UXpxXyIsxmTqEASV9NC1kGPSixqDvvNAigM="
BACKEND_API_URL := http://api:8000
NEXTAUTH_URL := https://galaxy-hub.moondev.cc

COMPOSE := PROJECT_NAME=${PROJECT_NAME} ${DOCKER_COMPOSE_BIN} -f build/compose/docker-compose.yml --env-file build/compose/.env
COMPOSE_PROD := PROJECT_NAME=${PROJECT_NAME} PORT=8000 PG_PORT=8001 WEB_PORT=8002 ${DOCKER_COMPOSE_BIN} -f build/compose/docker-compose.prod.yml
API_COMPOSE := ${COMPOSE} run --name ${PROJECT_NAME}_api --rm --service-ports -w /api api
BASE_IMAGE := ${PROJECT_NAME}/backend:base
build-base-image:
	$(DOCKER_BIN) build -t ${BASE_IMAGE} -f build/api.base.Dockerfile .
	-${DOCKER_BIN} images -q -f "dangling=true" | xargs ${DOCKER_BIN} rmi -f

teardown:
	${COMPOSE} down -v
	${COMPOSE} rm --force --stop -v

setup: pg redis api-pg-migrate build-base-image
lint: api-lint web-lint

api-pg-migrate:
	${COMPOSE} run --rm pg-migrate sh -c './migrate -path /api-migrations --database $$PG_URL up'
api-pg-drops:
	${COMPOSE} run --rm pg-migrate sh -c './migrate -path /api-migrations --database $$PG_URL drop'
api-pg-force:
	@echo "Forcing migration to version ${VERSION}"
	${COMPOSE} run --rm pg-migrate sh -c './migrate -path /api-migrations --database $$PG_URL force ${VERSION}'
api-pg-goto:
	@echo "Going to migration version ${VERSION}"
	${COMPOSE} run --rm pg-migrate sh -c './migrate -path /api-migrations --database $$PG_URL goto ${VERSION}'

api-lint:
	${API_COMPOSE} sh -c 'python -m pylint cmd core internal tools'
api-run:
	${API_COMPOSE} sh -c 'python cmd/main.py'
pg:
	${COMPOSE} up -d pg
redis:
	${COMPOSE} up -d redis

node-setup:
	nvm use 20
web-lint:
	cd web && yarn lint
web-lint-fix:
	cd web && yarn lint:fix
web-run:
	cd web && yarn dev

deploy: build-be-prod build-fe-prod run-prod

build-be-prod:
	$(DOCKER_BIN) build -t $(PROJECT_NAME)/backend:1.0 \
	--build-arg BASE_IMAGE=${BASE_IMAGE} \
	-f build/api.Dockerfile .

build-fe-prod:
	$(DOCKER_BIN) build \
      --build-arg NEXTAUTH_SECRET=${NEXTAUTH_SECRET} \
      --build-arg NEXTAUTH_URL=${NEXTAUTH_URL} \
      --build-arg BACKEND_API_URL=${BACKEND_API_URL} \
      --build-arg GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID} \
      --build-arg GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET} \
      --file build/web.Dockerfile -t $(PROJECT_NAME)/frontend:1.0 .

run-prod:
	${COMPOSE_PROD} up -d pg redis api web
