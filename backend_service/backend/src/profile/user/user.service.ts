import { Body, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
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
    constructor (private readonly prisma: PrismaService){}
    async create(dto: CreateUserDto)
    {
        // console.log(dto);
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: dto.email,
                }
            });
            if (user)
                 throw new ConflictException('email duplicated');
                //throw new NotFoundException();
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
        } catch (error) {
            if (error instanceof ConflictException) 
                throw new ConflictException('email duplicated');
            throw new HttpException("user can't create account", HttpStatus.BAD_REQUEST);
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

    async allUsers()
    {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                username: true,
            },
        });
        return users;
    }

    async confirm(email: string, dto: ConfirmUserDto)
    {
        console.log(dto.profilePic);
        const existingUser = await this.prisma.user.findUnique({
        where: { username: dto.username },
        });
        if (existingUser && existingUser.email !== email) {
        throw new ConflictException(`Username ${dto.username} already exists`);
        }
        const user = await this.prisma.user.update({
            where: { email: email },
            data: {
                ...dto,
                hash: await bcrypt.hash(dto.hash, 10)
            },
        })
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
            return {error: 'Internal server error'}
        }
    }

    async removeFriend(userId: string, friendId: string) {
        try {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            const friend = await this.prisma.user.findUnique({ where: { id: userId } });

            if (!user || !friend)
                throw new Error('User not found');
            await this.prisma.user.update(
                {
                    where: { id: userId },
                    data: {
                        friends: {
                            disconnect:
                            {
                                id: friendId
                            }
                        }
                    }
                })
        } catch (error)
        {
            return {error: 'Internal server error'}
        }
    }
    

    async Searchuser(username: string, @Req() req: Request)
    {
        try {
            const user = req['user'] as User;
            const userloged = user.id;
            const users = await this.prisma.user.findMany({
                where: {
                    username: {
                        startsWith: username,
                        mode: 'insensitive',
                    },
                    NOT : {id: userloged},
                }
            })
        if (!users || users.length === 0) {
        return { error: 'No users found' };
    }
        return(users);
        } catch (error)
        {
            return {error: 'Internal server error'}
        }
    }


    async generateUsername(Username: string)
    {
        let newUsername = Username;
        let counter = 1;

        while (await this.isUsernameexist(newUsername)){
            newUsername = `${Username}${counter++}`;
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
        const user = req['user'] as User;
        const userId = user.id;
        if (!await bcrypt.compare(dto.oldPass, user.hash))
            throw new UnauthorizedException('the old password is incorrect');
        if (dto.newPass !== dto.confirmPass)
            throw new UnauthorizedException('the new password and the confirm password are not the same');
        await this.prisma.user.update({
            where: { id:  userId},
            data: {
                hash: await bcrypt.hash(dto.confirmPass, 10)
            }
        })
        return { message: 'Password updated successfully' };
    }

    async updateusername(@Req() req: Request, @Body() body)
    {
        const user = req['user'] as User;
        const userId = user.id;
        const { username } = body;
        if (user.username === username) {
        throw new UnauthorizedException('New username is the same as the current username');
        }
        const isUsernameTaken = await this.findByUsername(username);
        if (isUsernameTaken) {
        throw new UnauthorizedException('Username is already taken');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { username: username },
        });
        return { message: 'Username updated successfully' };
    }

    async updateimage(@Req() req: Request, @Body() body)
    {
        const user = req['user'] as User;
        const userId = user.id;
        const { pic } = body;
      //  console.log(body);
        //console.log(pic);
        const newupdat = await this.prisma.user.update({
            where: { id: userId },
            data: { profilePic: pic },
        });
        if (!newupdat)
            throw new UnauthorizedException("the pic profile can't modify");
        return {message: 'Profile image updated successfully', newupdat}
    }
}