FROM node:alpine

COPY frontend/package*.json .

RUN npm install

COPY frontend frontend
WORKDIR /frontend

ENTRYPOINT npm run build
