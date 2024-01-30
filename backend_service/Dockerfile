FROM node:20.6.1

RUN apt update

COPY backend/script.sh backend/script.sh

COPY backend/package*.json .

RUN npm install

WORKDIR /backend
# COPY script.sh script.sh

# WORKDIR /backend/prisma

# RUN npx prisma migrate dev --name init

RUN chmod +x ./script.sh
# RUN npx prisma db seed

# WORKDIR /

ENTRYPOINT ./script.sh
# ENTRYPOINT tail -f /dev/null

# CMD npx prisma migrate dev --name init && npx prisma db seed && npm run start:dev
