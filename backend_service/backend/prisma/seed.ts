import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { CONVERSATION_TYPE } from "@prisma/client";
import { connect } from 'http2';

const data = Array.from({length:10}).map(()=>{
    return {
        profilePic: "some link",
        username: faker.helpers.unique(faker.person.firstName),
        title: faker.person.lastName(),
        email: faker.internet.email(),
        hash: faker.internet.password(),
        // userInterface:{
            // create:{}
        // }
    }
})

const prisma = new PrismaClient();

async function main() {

    await prisma.user.createMany({data})

    const allusers = await prisma.user.findMany({});

    // add frineds to users
    for (const user of allusers){
        const friends = allusers.filter((u)=>u.id!==user.id);
        await prisma.user.update({
            where:{id:user.id},
            data:{
                friends:{
                    connect:friends.map((f)=>({id:f.id}))
                }
            }
        })
    }

    // make converstations between users
    for (const user of allusers){
        const friends = allusers.filter((u)=>u.id!==user.id);
        for (const friend of friends){

            // check if conversation already exists
            const conversation = await prisma.conversation.findFirst({
                where:{
                    users:{
                        every:{
                            id:{
                                in:[user.id, friend.id]
                            }
                        }
                    }
                }
            })
            if (conversation) continue;
            await prisma.conversation.create({
                data:{
                    type:CONVERSATION_TYPE.DIRECT,
                    members:{
                        create:[{userId:user.id}, {userId:friend.id}]
                      },
                    users:{
                        connect:[
                            {id:user.id},
                            {id:friend.id}
                        ]
                    }
                }
            })
        }
    }

    // add messages to conversations between the first 2 users
    
    for (const user of allusers){
        const friends = allusers.filter((u)=>u.id!==user.id);
        for (const friend of friends){

            // check if conversation already exists
            const conversation = await prisma.conversation.findFirst({
                where:{
                    users:{
                        every:{
                            id:{
                                in:[user.id, friend.id]
                            }
                        }
                    }
                }
            })

            if (!conversation) continue;

            for (let i=0;i<5;i++){
                await prisma.message.create({
                    data:{
                        message:faker.lorem.sentences(2),
                        conversation: {connect: {id: conversation.id}},
                        sender:{connect:{id:user.id}},
                    }
                })
            }

        }
    }
}

main()