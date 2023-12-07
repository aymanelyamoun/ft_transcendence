From node:alpine

COPY frontend/package*.json .

RUN npm install

COPY frontend frontend
WORKDIR backend

ENTRYPOINT npm run dev