import { Injectable, NotFoundException } from "@nestjs/common";
import { ConnectedSocketInfo } from "./types/connected_socket_info";
import { Socket } from 'socket.io';
// import { TmpUserService } from "chatapp/server_chatapp/prisma/tmpUserAdd.service";
// import { PrismaChatService } from "chatapp/server_chatapp/prisma/chat/prisma.chat.service";
import { member } from "./types/user";
import { PrismaChatService } from "../prisma/chat/prisma.chat.service";
// import { TmpUserService } from "../prisma/tmpUserAdd.service";

@Injectable()
export class GatewayService{
    constructor(private readonly prismaChat:PrismaChatService, ){}
    connectedSocketsMap = new Map<string, Set<Socket> >();
    connectedSockets = new Set<ConnectedSocketInfo>();
    inviteSocketsMap = new Map<Socket, Set<string>>();


    addInviteSocketToMap(socket:Socket, userId:string){
        if (!this.inviteSocketsMap.has(socket))
            this.inviteSocketsMap.set(socket, new Set<string>());
        this.inviteSocketsMap.get(socket).add(userId);
    }

    getSocketByUserId(userId:string){
        for (const [socket, users] of this.inviteSocketsMap.entries()){
            if (socket['user'].id === userId)
                return (socket);
        }
        return null;
    }

    userIsInvitedBy(userId:string, senderId:string){
        for (const [socket, users] of this.inviteSocketsMap.entries()){
            if (users.has(userId) && socket['user'].id === senderId)
                return true;
        }
        return false;
    }

    userInvitedBySocket(socket:Socket, userId:string){
        if (this.inviteSocketsMap.has(socket))
            if (this.inviteSocketsMap.get(socket).has(userId))
                return true;
        return false;
    }

    removeInviteSocketFromMap(socket:Socket, userId:string){
        if (this.inviteSocketsMap.has(socket))
        {
            this.inviteSocketsMap.get(socket).delete(userId);
            if (this.inviteSocketsMap.get(socket).size == 0)
                this.inviteSocketsMap.delete(socket);
        }
    }

    removeInviteSocket(socket:Socket){
        this.inviteSocketsMap.delete(socket);
    }



    addConnectedSocketToMap(connectedSocket:ConnectedSocketInfo){
        if (!this.connectedSocketsMap.has(connectedSocket.userId))
            this.connectedSocketsMap.set(connectedSocket.userId, new Set<Socket>());
        this.connectedSocketsMap.get(connectedSocket.userId).add(connectedSocket.socket);
        connectedSocket.socket.join(connectedSocket.userId);
    }

    userIsConnected(userId:string){
        // console.log("connectedSocketsMap.has(userId)", this.connectedSocketsMap.has(userId));
        // console.log("connectedSocketsMap.get(userId).size", this.connectedSocketsMap.get(userId).size);
        if (this.connectedSocketsMap.has(userId))
        {
            // console.log("--------a connected user : ", userId);
            // console.log("size: ", this.connectedSocketsMap.get(userId).size)
            if (this.connectedSocketsMap.get(userId).size > 0)
                return true;
            else
                return false;
        }
        else
            return false;
    }

    removeConnectedSocketFromMap(connectedSocket:ConnectedSocketInfo){
        if(this.connectedSocketsMap.get(connectedSocket.userId))
        {
            this.connectedSocketsMap.get(connectedSocket.userId).delete(connectedSocket.socket);
            if (this.connectedSocketsMap.get(connectedSocket.userId).size == 0)
            this.connectedSocketsMap.delete(connectedSocket.userId);
        }
        connectedSocket.socket.leave(connectedSocket.userId);
    }

    addConnectedSocket(connectedSocket:ConnectedSocketInfo){
        this.connectedSockets.add(connectedSocket);
        return(connectedSocket);
    }

    removeConnectedSocket(connectedSocket:ConnectedSocketInfo){
        this.connectedSockets.delete(connectedSocket);
    }

    async joinRooms(connectedSocket:ConnectedSocketInfo){
        // const memberIn = await this.prismaChat.getMemberIn(connectedSocket.userId);
        const conversations = await this.prismaChat.getUserConversations(connectedSocket.userId);
        // if (conversations.length === 0)
        //     throw new NotFoundException("no conversations found");


        conversations.forEach((conversation)=>{
                const connectedMembers = this.getConnectedMembers(conversation.members);
                if (connectedMembers.length >= 2){
                    connectedMembers.forEach((connectedMember)=>{
                        const sockets = this.getRequestedSockets(connectedMember.userId);
                        sockets.forEach((socket)=>{
                            socket.join(conversation.id);
                        })
                    });
                }
        });
        // })
    }

    private getConnectedMembers(members:member[]){
        const connnectedMembers = members.filter((member)=>{
            if (this.isConnected(member.userId))
                return true
        })
        return connnectedMembers;
    }

    private getFriend(members:member[], userId:string){
        for(const member of members)
        {
            if (member.userId != userId)
                return (member.userId);
        }
    }

    private isConnected(userId:string):boolean{
        if (this.getRequestedSocket(userId)) return true

        return false
    }

    private getRequestedSocket(userId: string) {
        for (const element of this.connectedSockets) {
            if (element.userId === userId) {
                return element.socket;
            }
        }
        return null;
    }

    private getRequestedSockets(userId: string): Socket[] {
    let matchedSockets: Socket[] = [];
        for (const element of this.connectedSockets) {
        if (element.userId === userId) {
            matchedSockets.push(element.socket);
            }
        }
        return matchedSockets;
    }
}