cd prisma
npx prisma migrate dev --name init
npx prisma db seed
cd ..
npm run start:dev