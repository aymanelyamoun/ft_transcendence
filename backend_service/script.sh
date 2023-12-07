# cd backend/prisma
npx prisma migrate dev --name init
npx prisma db seed
npx prisma studio
# cd ..
# npm run start:dev