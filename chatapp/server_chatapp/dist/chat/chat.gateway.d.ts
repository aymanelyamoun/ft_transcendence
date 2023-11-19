import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { messageDto, userDataDto } from './DTOs/dto';
import { ConnectedSocketInfo } from './types/connected_socket_info';
import { PrismaChatService } from 'src/prisma/chat/prisma.chat.service';
import { TmpUserService } from 'src/prisma/tmpUserAdd.service';
export declare class ChatGateway implements OnModuleInit {
    private readonly prismaChat;
    private readonly tmpUserAddService;
    constructor(prismaChat: PrismaChatService, tmpUserAddService: TmpUserService);
    connectedSockets: Set<ConnectedSocketInfo>;
    server: Server;
    onModuleInit(): void;
    subscribeUserData(client: Socket, data: userDataDto): void;
    sendMessageTo(client: Socket, msg: messageDto): Promise<void>;
    private getRequestedSocket;
}
