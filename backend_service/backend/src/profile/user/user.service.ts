import { Body, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, Req, Res, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/user.dto';
import { ConfirmUserDto } from './dto/confirm.dto';
// import { Request, Response } from 'express';
import { PrismaService } from 'src/chatapp/prisma/prisma.service';
import { use } from 'passport';
import { Request, Response, NextFunction } from 'express';
import { LOG_TYPE, User } from '@prisma/client';
import { tr } from '@faker-js/faker';
import { NotFoundError } from 'rxjs';
import { UpdatePassDto } from './dto/updatepass.dto';

@Injectable()
export class UserService {
    context: any;
    constructor (private readonly prisma: PrismaService){}
    async create(dto: CreateUserDto)
    {
        try {
            if (dto.hashConfirm !== dto.hash)
                throw new UnauthorizedException('the password and the confirm password are not the same');
            delete dto.hashConfirm;
            const user = await this.prisma.user.findUnique({
                where: {
                    email: dto.email,
                }
            });
            if (user)
                 throw new ConflictException('email duplicated');
            const tmpUsername = dto.username
            const Username = await this.prisma.user.findUnique({ where: { username: dto.username } });
            if (Username)
                dto.username = await this.generateUsername(tmpUsername);
            const newUser = await this.prisma.user.create({
                data: {
                    ...dto,
                    hash: await bcrypt.hash(dto.hash, 10),
                    title: "snouae rfa3 ta7di",
                    profilePic: "https://i.imgur.com/GJvG1b.png",
                    wallet: 10,
                    typeLog: LOG_TYPE.locallylog
                },
            });
            const { hash, ...result } = newUser;
            return result;
        }catch (error) {
            if (error instanceof UnauthorizedException) {
              throw new UnauthorizedException('the password and the confirm password are not the same');
            } else if (error instanceof ConflictException) {
                throw new ConflictException('Account already exist');
            } else {
                throw new UnauthorizedException("can't create this user");
            }
        }
    }
    
    async findByEmail(email: string) 
    {
        return await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }

    async findByUsername(username: string)
    {
        return await this.prisma.user.findUnique({
            where: {
                username: username,
            },
        });
    }
    
    async findById(id: string) 
    {
        return await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
    }

    async BlockList(userId: string)
    {
        try
        {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { blockedUsers: true },
            });

            if (!user)
                throw new Error('User not found');
            return user.blockedUsers;
        }
        catch (error)
        {
            throw new Error( 'Internal server error')
        }
    }


    // async allUsers(userloged: string)
    // {
    //     const users = await this.prisma.user.findMany({
    //         select: {
    //             id: true,
    //             username: true,
    //             profilePic: true,
    //         },
    //         where: {
    //             id: { not: userloged },//his excludes user loged
    //             friends: { //his excludes friends
    //                 none: {
    //                     id: userloged
    //                 }
    //             },
    //         },
    //     });
    //     return users;
    // }

    async allUsers(userloged: string) {
        try {
            const users = await this.prisma.user.findMany({
                select: {
                    id: true,
                    username: true,
                    profilePic: true,
                },
            //     where: {
            //         id: { not: userloged },
            //     AND:{
            //         NOT:{
            //             friends: {
            //             some: {
            //                 id: userloged, 
            //             },
            //         },
            //     },
            //         blockedByUsers: {
            //         some: {
            //             id: userloged,
            //         },
            //         }
            // },
            //     },
            // where: {
            //     id: { not: userloged },
            //     friends: {
            //         none: {
            //             id: userloged,
            //         },
            //     },
            //     blockedUsers: {
            //         none: {
            //             id: userloged,
            //         },
            //     },
            // },

            /*If none of them have the id equal to userloged, the condition is satisfied,
            and the filter allows these users to be included in the final result.
If any of them had an id equal to userloged, the condition would not be satisfied, and that user would be excluded from the result. */
            where: {
                id: { not: userloged },
                friends: {
                    none: {
                        id: userloged,
                    },
                },
                blockedUsers: {
                    none: {
                        id: userloged,
                    },
                },
            },
            
            
            });
            const blockedUsers = await this.BlockList(userloged);
            const usersWithBlockedFlag = users.map((user) => ({
                ...user,
                isBlocked: blockedUsers.some((blockedUser) => blockedUser.id === user.id),
            }));
            // console.log(usersWithBlockedFlag);
            return usersWithBlockedFlag;
        } catch (error) {
            throw new Error('Internal server error');
        }
    }
    


    async confirm(email: string, dto: ConfirmUserDto)
    {
        const existingUser = await this.prisma.user.findUnique({
        where: { username: dto.username },
        });
        if (existingUser && existingUser.email !== email) {
            throw new ConflictException(`Username ${dto.username} already exists`);
        }
        try { 
            const user = await this.prisma.user.update({
                where: { email: email },
                data: {
                    ...dto,
                    hash: await bcrypt.hash(dto.hash, 10)
                },
        })
        }catch (error)
        {
            throw new UnauthorizedException("can't confirm this user");
        }
    }

    async allFriend(userId: string)
    {
        try
        {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { friends: true },
            });

            if (!user)
                throw new Error('User not found');
            return user.friends;
        }
        catch (error)
        {
            throw new Error('Internal server error')
        }
    }

    async removeFriend(userId: string, friendId: string) {
        try {
          return  await this.prisma.$transaction(async (prisma) => {
                const user = await prisma.user.findUnique({ where: { id: userId } });
                const friend = await prisma.user.findUnique({ where: { id: friendId } });
    
                if (!user || !friend) {
                    throw new Error('User or friend not found');
                }
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        friends: {
                            disconnect: {
                                id: friendId
                            }
                        }
                    }
                });
                await prisma.user.update({
                    where: { id: friendId },
                    data: {
                        friends: {
                            disconnect: {
                                id: userId
                            }
                        }
                    }
                });
            });
        } catch (error) {
            throw new Error('Internal server error')
        }
    }
    
    

    async Searchuser(username: string, @Req() req: Request)
    {
    //     console.log('here with : |',username,'|')
    //    console.log(username);
        const user = req['user'] as User;
        const userloged = user.id;
        username = username.trim();
        if(username.length == 0)
            return this.allUsers(userloged);
        try {
            const users = await this.prisma.user.findMany({
                where: {
                    username: {
                        startsWith: username,
                        mode: 'insensitive',
                    },
                    // NOT : {id: userloged},
                    id: { not: userloged },
                    friends: {
                        none: {
                            id: userloged,
                        },
                    },
                    blockedUsers: {
                        none: {
                            id: userloged,
                        },
                    },
                }
            })
            const blockedUsers = await this.BlockList(userloged);
            const usersWithBlockedFlag = users.map((user) => ({
                ...user,
                isBlocked: blockedUsers.some((blockedUser) => blockedUser.id === user.id),
            }));
        return(usersWithBlockedFlag);
        } catch (error)
        {
            throw new UnauthorizedException('Internal server error');
        }
    }


    async generateUsername(Username: string)
    {
        let newUsername = Username;
        let c = 1;

        while (await this.isUsernameexist(newUsername)){
            newUsername = `${Username}${c++}`;
        }
        return newUsername;
    }


    async isUsernameexist(username: string)
    {
        const exist = await this.prisma.user.findUnique({
            where: {
                username,
            },
        });
        return !!exist;
    }


    async updateUser(userId: string, data: Record<string, any>) {
    await this.prisma.user.update({
        where: { id: userId },
        data,
    });
        
    }
    async updatepass(@Req() req: Request, dto: UpdatePassDto)
    {
        try {
            const user = req['user'] as User;
            const userId = user.id;
            if (!await bcrypt.compare(dto.oldPass, user.hash))
                throw new UnauthorizedException('the old password is incorrect');
            if (dto.newPass !== dto.confirmPass)
                throw new ConflictException('the new password and the confirm password are not the same');
            await this.prisma.user.update({
                where: { id:  userId},
                data: {
                    hash: await bcrypt.hash(dto.confirmPass, 10)
                }
            })
            return { message: 'Password updated successfully' };
        }catch (error)
        {
            if (error instanceof UnauthorizedException) {
                throw new UnauthorizedException('the old password is incorrect');
              } else if (error instanceof ConflictException) {
                throw new ConflictException('the new password and the confirm password are not the same');
              } else {
                  throw new UnauthorizedException("can't update the password");
              }
        }
    }

    async updateusername(@Req() req: Request, @Body() body)
    {
        try {
            const user = req['user'] as User;
            const userId = user.id;
            let  { username } = body;
            username = username.trim();
            if (user.username === username) {
                throw new UnauthorizedException('New username is the same as the current username');
            }
            const isUsernameTaken = await this.findByUsername(username);
            if (isUsernameTaken) {
                throw new ConflictException('Username is already taken');
            }
            await this.prisma.user.update({
                where: { id: userId },
                data: { username: username },
            });
            return { message: 'Username updated successfully'};
        }catch (error)
        {
            if (error instanceof UnauthorizedException) {
                throw new UnauthorizedException('New username is the same as the current username');
              } else if (error instanceof ConflictException) {
                  throw new ConflictException('Username is already taken');
              } else {
                  throw new UnauthorizedException("can't update the username");
              }
        }
    }

    async updateimage(@Req() req: Request, @Body() body)
    {
        try
        {
            const user = req['user'] as User;
            const userId = user.id;
            const { pic } = body;
            const newupdat = await this.prisma.user.update({
                where: { id: userId },
                data: { profilePic: pic },
            });
            if (!newupdat)
                throw new UnauthorizedException("the pic profile can't modify");
            return {message: 'Profile image updated successfully', newupdat}
        }catch (error)
        {
            if (error instanceof UnauthorizedException)
                throw new UnauthorizedException('New username is the same as the current username');
            else
                throw new UnauthorizedException("can't update picture");                 
        }
    }


    async getNotifications(id: string) {
        try {
            const notifications = await this.prisma.notification.findMany({
                where: {
                    userId: id,
                    type: "friendReq"
                },
                include: {
                    sender: {
                        select: {
                            profilePic: true
                        }
                    }
                }
            });
            return notifications;
        } catch (error) {
            throw new UnauthorizedException('Internal server error');
        }
    }
    
}