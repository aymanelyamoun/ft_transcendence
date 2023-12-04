import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import { ConfirmUserDto } from './dto/confirm.dto';

@Injectable()
export class UserService {
    constructor (private readonly prisma: PrismaService){}
    async create(dto: CreateUserDto)
    {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        });
        if (user)
            throw new ConflictException('email duplicated');
            const newUser = await this.prisma.user.create({
                data:{
                    ...dto,
                    password: await bcrypt.hash(dto.password, 10)
                },
            });
        const {password, ...result} = newUser;
        return result;
    }
    
    async findByEmail(email: string) 
    {
        return await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }
    
    async findById(id: number) 
    {
        return await this.prisma.user.findUnique({
            where: {
                id: +id,
            },
        });
    }



    async confirm(email: string, dto: ConfirmUserDto)
    {

        const existingUser = await this.prisma.user.findUnique({
        where: { displayName: dto.displayName },
        });

        if (existingUser && existingUser.email !== email) {
        throw new ConflictException(`Username ${dto.displayName} already exists`);
        }
            const user = await this.prisma.user.update({
                where: { email: email },
                data: {
                    ...dto,
                    password: await bcrypt.hash(dto.password, 10)
                },
                })
    }
}