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
clear: prune
	rm -rf postgres_data
	rm -rf backend_service/backend/node_modules
	rm -rf backend_service/backend/prisma/migrations
	rm -fr frontend_service/frontend/node_modules
nodes:
	npm install --prefix frontend_service/frontend
	npm install --prefix backend_service/backend

rebuild: clear build up