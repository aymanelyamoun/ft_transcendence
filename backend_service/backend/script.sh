# cd backend/prisma
npx prisma migrate dev --name init && npx prisma db seed && npx prisma studio && npm run start:dev