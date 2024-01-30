#!/bin/bash
npx prisma migrate dev --name init && npm run build && npm run start  #&& npx prisma db seed && npx prisma studio 
# npx prisma migrate dev --name init && npm run start:dev #&& npx prisma db seed && npx prisma studio 
