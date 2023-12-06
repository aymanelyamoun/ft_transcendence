import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/chatapp/prisma/prisma.service";

@Injectable()
export class Request {
    constructor (private readonly prisma: PrismaService){}
}