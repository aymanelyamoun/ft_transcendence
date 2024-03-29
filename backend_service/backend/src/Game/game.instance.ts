import { Paddle, Canvas, Player, Ball, GameInfo, EndGameState} from './interfaces/game.interface';
import { Engine, Body, World, Bodies, Vector, Events, Matter, Composite, Runner } from "matter-js";
import { Inject, Injectable } from "@nestjs/common";
import { Server, Socket } from 'socket.io';
import { User } from '@prisma/client';
import { PrismaService } from 'src/chatapp/prisma/prisma.service';
import { pl } from '@faker-js/faker';


const HEIGHT : number = 800;
const WIDTH : number = 1500;
const WALLHEIGHT : number = 1;
const PADDLEWIDTH : number = 15;
const PADDLEHEIGHT : number = 90;
const BALLRADIUS : number = 10;
const BALLSPEED : number = 16;

@Injectable()
export class GameInstance {
    private databaseUpdated : boolean = false;
    private engine: Engine;
    private runner: Runner;
    private canvas: Canvas;
    private playerOne: Player;
    private playerTwo: Player;
    private ball: Ball;
    public gameInfo: GameInfo;
    private gameOver: boolean = false;
    public gameEnded: boolean = false;
    private readonly prisma: PrismaService;

    constructor(playerOneSocket: Socket, playerTwoSocket: Socket, roomNumber: string, serverIO: Server) {
        if (playerOneSocket['user'].username == playerTwoSocket['user'].username)
        {
            playerOneSocket.emit('redirect', '/game', 'You are not allowed to join this room');
            playerTwoSocket.emit('redirect', '/game', 'You are not allowed to join this room');
            playerTwoSocket.disconnect(true);
            playerOneSocket.disconnect(true);
            return ;
        }
        this.engine = Engine.create();
        this.engine.gravity.y = 0;
        this.canvas = {
            width: WIDTH,
            height: HEIGHT,
            topWall: Bodies.rectangle(WIDTH / 2, 1 / 2, WIDTH, WALLHEIGHT, { isStatic: true, render: { visible: false} }),
            bottomWall: Bodies.rectangle(WIDTH / 2, HEIGHT - 1 / 2, WIDTH, WALLHEIGHT, { isStatic: true, render: { visible: true} }),
            wallHeight: WALLHEIGHT,
            backgroundSkin: "black",
        };
        this.playerOne = {
            paddle: {
                bar: Bodies.rectangle(10, HEIGHT / 2, PADDLEWIDTH, PADDLEHEIGHT, 
                { isStatic: true, render: { fillStyle: 'White', sprite:{texture: '/GameAssets/OPaddle.png'}} }),
                barHeight: 70,
                barWidth: 15,
                xPosition: 10,
                yPosition: HEIGHT / 2,
                barSkin: 'null',
                move: 0,
            },
            score: 0,
            playerData: playerOneSocket['user'],
            // playerSocket is an array of sockets
            playerSocket: [playerOneSocket], 
        };
        this.playerTwo = {
            paddle: {
                bar: Bodies.rectangle(WIDTH - 10, HEIGHT / 2, PADDLEWIDTH, PADDLEHEIGHT,
                { isStatic: true, render: { fillStyle: 'White', sprite:{texture: '/GameAssets/OPaddle.png'} } }),
                barHeight: 70,
                barWidth: 15,
                xPosition: WIDTH - 10,
                yPosition: HEIGHT / 2,
                barSkin: 'null',
                move: 0,
            },
            score: 0,
            playerData: playerTwoSocket['user'],
            playerSocket: [playerTwoSocket],
        };
        this.ball = {
            ball: Bodies.circle(WIDTH / 2, HEIGHT / 2, BALLRADIUS, { restitution: 1,
                render: { fillStyle: 'white',
                        sprite: {texture : '/GameAssets/newBall.png'}} }),
            ballVelocity: Vector.create(0, 0),
            ballSkin: 'null',
            ballSpeed: BALLSPEED,
            ballAngle: 0,
            maxSpin: 4,
        };
        this.gameInfo = {
            frameRate: 1000 / 75,
            playersCounter: 0,
            gameRoom: roomNumber,
            IOserver: serverIO,
            roundStart: false,
            paddleSpeed: 5,
            winScore: 5,
        };
        playerOneSocket.join(roomNumber);
        playerTwoSocket.join(roomNumber);
        
    }   
    collisionDetect = (event: Matter.IEventCollision<Matter.Engine>) =>{
        event.pairs.forEach((pair: Matter.IPair) => {
          const { bodyA, bodyB } = pair;
          if (bodyA == this.playerOne.paddle.bar || bodyA == this.playerTwo.paddle.bar)
          {
            let paddle = (bodyA == this.playerOne.paddle.bar) ? this.playerOne.paddle : this.playerTwo.paddle;
            let ballPosition = this.ball.ball.position;
            let paddlePosition = bodyA.position
            let deltaY = ballPosition.y - paddlePosition.y;
            let normalizedDeltaY = deltaY / (paddle.barHeight / 2);
            if (normalizedDeltaY > 1)
                normalizedDeltaY = 1
            else if (normalizedDeltaY < -1)
                normalizedDeltaY = -1
            this.ball.ballVelocity.y = this.ball.ballVelocity.y + this.ball.maxSpin * normalizedDeltaY;
            this.ball.ballVelocity.x = this.ball.ballVelocity.x * -1;
            let speed = Math.sqrt(this.ball.ballVelocity.x ** 2 + this.ball.ballVelocity.y ** 2);
            this.ball.ballVelocity.x = (this.ball.ballVelocity.x / speed) * this.ball.ballSpeed
            this.ball.ballVelocity.y = (this.ball.ballVelocity.y / speed) * this.ball.ballSpeed
            this.ball.ballVelocity = Vector.create(this.ball.ballVelocity.x, this.ball.ballVelocity.y)
          }
          if ((bodyA == this.canvas.topWall || bodyA == this.canvas.bottomWall) && (bodyB == this.ball.ball))
          {
            this.ball.ballVelocity.y = this.ball.ballVelocity.y * -1;
            this.ball.ballVelocity = Vector.create(this.ball.ballVelocity.x, this.ball.ballVelocity.y)
          }
        });
    }
    
    wallWalk (player: Player)  {
        if ((player.paddle.bar.position.y - player.paddle.barHeight / 2 <= this.canvas.wallHeight) && player.paddle.move == -1)
            return true;
        if ((player.paddle.bar.position.y + player.paddle.barHeight / 2 >= this.canvas.height - this.canvas.wallHeight) && (player.paddle.move == 1))
            return true;
        return false;
    }

    getPlayerOneInfo = () => {
        return this.playerOne;
    }
    getPlayerTwoInfo = () => {
        return this.playerTwo;
    }

    socketConnect = (socket: Socket) => {
        // console.log('a socket connected to room ' + socket['id']);
        socket.join(this.gameInfo.gameRoom);
        socket.emit('startFriendGame', [this.playerOne.playerData, this.playerTwo.playerData])
        socket.emit('selfData', socket['user']);
        if (socket['user'].username == this.playerOne.playerData.username)
        {
            this.playerOne.playerSocket.push(socket);
            socket.on('onMove', (movement : number) => {
                this.playerOne.paddle.move = movement;
            });
        }
        else if (socket['user'].username == this.playerTwo.playerData.username)
        {
            socket.on('onMove', (movement : number) => {
                this.playerTwo.paddle.move = movement;
            });
            this.playerTwo.playerSocket.push(socket);
        }
    }

    socketDisconnect = (disconnectedSocket: Socket) => {
        this.playerOne.playerSocket.forEach((socket) => {
            if (socket.id == disconnectedSocket.id){
                this.playerOne.playerSocket.splice(this.playerOne.playerSocket.indexOf(socket), 1);
                if (this.playerOne.playerSocket.length == 0)
                    this.endGame({reason: 'disconnect', winner: this.playerTwo});
            }
        });
        this.playerTwo.playerSocket.forEach((socket) => {
            if (socket.id == disconnectedSocket.id){
                this.playerTwo.playerSocket.splice(this.playerTwo.playerSocket.indexOf(socket), 1);
                if (this.playerTwo.playerSocket.length == 0)
                    this.endGame({reason: 'disconnect', winner: this.playerOne});
            }
        });
    }

    getTitle = (xp : number) => {
        if (xp < 50)
            return ("Bronze")
        else if (xp < 100)
            return ("Silver")
        else if (xp < 150)
            return ("Gold")
        else
            return ("Master")
    }


    // async update_skins(winnerData : User, loserData : User, prisma : PrismaService) : Promise<void> {
    //     // 
    // }

    async update_achievement(winnerData : User, loserData : User, prisma : PrismaService) : Promise<void> {
        // handle winner title
        const winnerTitle = this.getTitle(winnerData.totalXp + 25);
        const loserTitle = this.getTitle(loserData.totalXp - 35 > 0 ? loserData.totalXp - 35 : 0);
        await prisma.user.update({
            where :{
                id : winnerData.id,
            },
            data: {
                title: winnerTitle,
            }
        });
        await prisma.user.update({
            where :{
                id : loserData.id,
            },
            data: {
                title: loserTitle,
            }
        });
    }

    async endGame (state : EndGameState) : Promise<void> {
        if (this.gameEnded)
            return ;
        this.gameOver = true;
        this.gameEnded = true;
        var loserData : User;
        var winnerData : User;
        var winner = (this.playerOne.score == this.gameInfo.winScore) 
        ? '1' : '2';
        if (state.reason == 'disconnect')
        {
            state.winner.score = this.gameInfo.winScore;
            winner = (state.winner == this.playerOne) ? '1' : '2';
        }
        if (winner == '1')
        {
            winnerData = this.playerOne.playerData;
            loserData = this.playerTwo.playerData;
        }
        else
        {
            winnerData = this.playerTwo.playerData;
            loserData = this.playerOne.playerData;
        }
        try {
            this.gameInfo.IOserver.to(this.gameInfo.gameRoom).emit('endGame', {
                winner: winner,
            });
            if (this.databaseUpdated == false)
            {
                this.databaseUpdated = true;
                const prismaService = new PrismaService();
                await prismaService.gameRecord.create({
                    data: {
                        user:{connect:{id: winnerData.id}},
                        scoredGoals: (winner == '1') ? this.playerOne.score : this.playerTwo.score,
                        concededGoals: (winner == '1') ? this.playerTwo.score : this.playerOne.score,
                        xp:  25,
                        oponent:{connect:{id: loserData.id}},
                        // oponentId: loserData.id,
                    },
                });
                await prismaService.gameRecord.create({
                    data: {
                        user: {connect:{id: loserData.id}},
                        scoredGoals: (winner == '1') ? this.playerTwo.score : this.playerOne.score,
                        concededGoals: (winner == '1') ? this.playerOne.score : this.playerTwo.score,
                        xp: loserData.totalXp - 35 > 0 ? -35 : loserData.totalXp * -1,
                        oponent:{connect:{id: winnerData.id}},
                    },
                });
                await prismaService.user.update({
                    where: {
                        id: winnerData.id,
                    },
                    data: {
                        totalXp: winnerData.totalXp + 25,
                        wallet: {
                            increment: 10,
                        },
                    },
                });
                await prismaService.user.update({
                    where: {
                        id: loserData.id,
                    },
                    data: {
                        totalXp: loserData.totalXp - 35 > 0 ? loserData.totalXp - 35 : 0,
                    },
                });
                await this.update_achievement(winnerData, loserData, prismaService)
            }
            // await this.update_skins(winnerData, loserData, prismaService)
    }
        catch (error) {
            console.log("Error encoutered from client side while updating database : ", error.message);
        }
        // Events.off(this.engine, 'collisionStart', this.collisionDetect);
        // Events.off(this.runner, "beforeTick", this.animationFrame);
        // Runner.stop(this.runner);
        // World.clear(this.engine.world, false);
        // Engine.clear(this.engine);
    }
    gameLoop = () => {
        if (this.gameOver == true)
            return;
        if (this.gameInfo.roundStart == false) {
            this.gameInfo.roundStart = true;
            Body.setPosition(this.ball.ball, { x: WIDTH / 2, y: HEIGHT / 2 });
            this.ball.ballVelocity.x = 0;
            this.ball.ballVelocity.y = 0;
            setTimeout(() => {
                this.ball.ballVelocity.x = (Math.random() < 0.5) ? -5 : 5;
                this.ball.ballVelocity.y = 0;
            }, 3000);
        }
        Body.setVelocity(this.ball.ball, this.ball.ballVelocity);
        if (this.ball.ball.position.x < 0) {
            this.playerTwo.score++;
            this.ball.ballVelocity.x = 0;
            this.ball.ballVelocity.y = 0;
            Body.setVelocity(this.ball.ball, this.ball.ballVelocity);
            Body.setPosition(this.ball.ball, { x: WIDTH / 2, y: HEIGHT / 2 });
            setTimeout(() => {
                this.ball.ballVelocity.x = -5;
                this.ball.ballVelocity.y = 0;
            }, 3000);
        }
        if (this.ball.ball.position.x > this.canvas.width) {
            this.playerOne.score++;
            this.ball.ballVelocity.x = 0;
            this.ball.ballVelocity.y = 0;
            Body.setVelocity(this.ball.ball, this.ball.ballVelocity);
            Body.setPosition(this.ball.ball, { x: WIDTH / 2, y: HEIGHT / 2 });
            setTimeout(() => {
                this.ball.ballVelocity.x = 5;
                this.ball.ballVelocity.y = 0;
            }, 3000);
        }
        if (this.gameInfo.roundStart &&(this.ball.ball.velocity.x < 0 && this.ball.ball.velocity.x > -0.5))
            this.ball.ballVelocity.x = -5;
        if (this.gameInfo.roundStart && (this.ball.ball.velocity.x > 0 && this.ball.ball.velocity.x < 0.5))
            this.ball.ballVelocity.x = 5;
        if (this.playerOne.score == this.gameInfo.winScore || this.playerTwo.score == this.gameInfo.winScore)
            this.endGame( {reason: 'score', winner: (this.playerOne.score == this.gameInfo.winScore) ? this.playerOne : this.playerTwo}) ;
        if (this.wallWalk(this.playerOne) == false)
            Body.setPosition(this.playerOne.paddle.bar,
                 { x: this.playerOne.paddle.bar.position.x, y: this.playerOne.paddle.bar.position.y + (this.gameInfo.paddleSpeed * this.playerOne.paddle.move) });
        if (this.wallWalk(this.playerTwo) == false)
            Body.setPosition(this.playerTwo.paddle.bar,
                { x: this.playerTwo.paddle.bar.position.x, y: this.playerTwo.paddle.bar.position.y + (this.gameInfo.paddleSpeed * this.playerTwo.paddle.move) });

    }
    sendFrame = () => {
        const worldState = JSON.stringify(Composite.allBodies(this.engine.world), (key, value) =>
        (key === 'parent' || key === 'parts' || key === 'body') ? undefined : value);
        this.gameInfo.IOserver.to(this.gameInfo.gameRoom).emit('updateFrames', worldState,
            [this.playerOne.score, this.playerTwo.score],
            [this.playerOne.playerData, this.playerTwo.playerData],
        );
    }
    animationFrame = () => {
        this.gameLoop();
        this.sendFrame();
    }


    startGame = () => {
        this.gameInfo.IOserver.emit('friendStatus', {userId: this.playerOne.playerData.id, status: '2'})
        this.gameInfo.IOserver.emit('friendStatus', {userId: this.playerTwo.playerData.id, status: '2'})
        this.gameInfo.IOserver.to(this.gameInfo.gameRoom).emit('startFriendGame',
            [this.playerOne.playerData, this.playerTwo.playerData]);
        this.playerOne.playerSocket[0].emit('selfData', this.playerOne.playerData);
        this.playerTwo.playerSocket[0].emit('selfData', this.playerTwo.playerData);
        this.playerOne.playerSocket[0].on('onMove', (movement : number) => {
            this.playerOne.paddle.move = movement;});
        this.playerTwo.playerSocket[0].on('onMove', (movement : number) => {
            this.playerTwo.paddle.move = movement;});
        World.add(this.engine.world, [this.canvas.topWall, this.canvas.bottomWall, this.playerOne.paddle.bar,
             this.playerTwo.paddle.bar, this.ball.ball]);
        this.runner = Runner.create();
        this.runner.delta = 1000 / 60;
        this.runner.isFixed = true;
        Runner.run(this.runner, this.engine);
        Events.on(this.engine, 'collisionStart', this.collisionDetect);
        Events.on(this.runner, "beforeTick", this.animationFrame);
    }
}