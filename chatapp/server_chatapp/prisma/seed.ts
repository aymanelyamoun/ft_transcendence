import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const data = Array.from({length:10}).map(()=>{
    return {
        profilePic: "some link",
        username: faker.helpers.unique(faker.person.firstName),
        title: faker.person.lastName()
    }
})

const prisma = new PrismaClient();

async function main() {
    await prisma.user.createMany({data});
}

main()