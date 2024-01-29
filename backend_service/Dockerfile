FROM node:20.6.1

RUN apt update




COPY backend/script.sh backend/script.sh
WORKDIR /backend
# COPY script.sh script.sh

# WORKDIR /backend/prisma

# RUN npx prisma migrate dev --name init

RUN chmod +x ./script.sh
# RUN npx prisma db seed

# WORKDIR /

ENTRYPOINT ./script.sh

# CMD npx prisma migrate dev --name init && npx prisma db seed && npm run start:dev
