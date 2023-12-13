all: up

build:
	docker compose build
up:
	docker compose up
down:
	docker compose down
up_build:
	docker compose up --build
prune:
	docker system prune -a -f