From node:alpine

RUN apk update


COPY backend backend
WORKDIR /backend
# COPY script.sh script.sh

# WORKDIR /backend/prisma

# RUN npx prisma migrate dev --name init

# RUN npx prisma db seed

# WORKDIR /

ENTRYPOINT ./script.sh

# CMD npx prisma migrate dev --name init && npx prisma db seed && npm run start:dev
