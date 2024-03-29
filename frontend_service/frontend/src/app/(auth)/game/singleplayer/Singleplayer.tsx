'use client';;
import { useEffect, useRef, useState} from "react";
import Matter, {Engine, Bodies, World, Render, Composite, Vector, Collision} from 'matter-js';
import * as Skins from '../utils/Skins';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { socket } from "../../../../socket";
import { AlertMessage } from "../../chat/components/alertMessage";


interface User {
    id: string;
    email: string;
    username: string;
    profilePic?: string;
    hash: string;
    typeLog: string;
    isTwoFactorEnabled: Boolean;
} // use the exported interface instead
  
const HEIGHT : number = 800;
const WIDTH : number = 1500;
const BALLSPEED : number = 12;
const PERCENTWIDTH : number = 100;
const PERCENTHEIGHT : number = 70;
var aiPredict : boolean = false;
var aiDirection : number = Math.random() < 0.5 ? 1 : -1;
var PredictedBallY : number = 0;
var predictOffset : number = 0;
var ballSpeed : number = BALLSPEED;
var hittedTimes : number = 0;
var ballVelocity : Matter.Vector = Vector.create(-5, 0);
var PADDLESPEED : number = 6;
var PADDLEMOVE : number = 0;
const maxSpin = 1;

const addBodies = (engine: Matter.Engine, cw: number, ch: number) => {
    const ball = Bodies.circle(cw / 2, ch / 2, 10, { isStatic: false, restitution: 1,
    render:{fillStyle: "white"}})
    const paddleA = Bodies.rectangle(10, ch / 2, 15, 90, { isStatic: true,
    render:{fillStyle: "white"}})
    const paddleB = Bodies.rectangle(cw - 10, ch / 2, 15, 90, { isStatic: true,
    render:{fillStyle: "white"}})
    const wallTop = Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true, render:{visible: false} })
    const wallBottom = Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true, render:{visible: false} })
    World.add(engine.world, [wallTop, wallBottom, paddleA, paddleB, ball])
}

function ballPrediction(engine : Engine)
{
    const barB = engine.world.bodies[3];
    const ball = engine.world.bodies[4];
    const barHeight = barB.bounds.max.y - barB.bounds.min.y;
    const midBar = barHeight / 2;
    const x0 = ball.position.x;
    const y0 = ball.position.y;
    const vy = ball.velocity.y;
    const speed = Math.sqrt(ball.velocity.x ** 2 + vy ** 2);
    const distanceToTarget = Math.abs(barB.position.x - x0);
    const timeToReachTarget = distanceToTarget / speed;
    let revDir = 1;
    if (ball.velocity.y > 0)
        revDir = -1;
    PredictedBallY = y0 + vy * timeToReachTarget;
}

function botMove(engine : Engine)
{
    const barB = engine.world.bodies[3];
    const barHeight = barB.bounds.max.y - barB.bounds.min.y;
    const midBar = barHeight / 2;
    if (aiPredict)
    {
        let flooredPredictedY = Math.floor(PredictedBallY)
        let flooredBarY = Math.floor(barB.position.y + predictOffset)
        if (flooredPredictedY > flooredBarY)
            aiDirection = 1
        else if (flooredPredictedY < flooredBarY)
            aiDirection = -1
        else
            aiDirection = 0
        if (aiDirection == 0)
            return;
        let i = 0;
        let checkY = Math.floor(barB.position.y + predictOffset) + aiDirection;
        while (i < PADDLESPEED)
        {
            if (checkY == flooredPredictedY)
            break
            checkY += aiDirection;
            i++;
        }
        let newY = barB.position.y + (aiDirection * i);
        let newBarPos = Matter.Vector.create(barB.position.x, newY)
        if (!wallWalk(newY, barB, engine))
            Matter.Body.setPosition(barB, newBarPos)
    }
    else
    {
        if (wallWalk(barB.position.y + (aiDirection * PADDLESPEED), barB, engine))
            aiDirection = aiDirection * -1;
        let newY = barB.position.y + (aiDirection * PADDLESPEED);
        let newBarPos = Matter.Vector.create(barB.position.x, newY)
        Matter.Body.setPosition(barB, newBarPos)
    }
}

const collisionDetect = (engine : Engine ,event: Matter.IEventCollision<Matter.Engine>) =>{
    event.pairs.forEach((pair: Matter.Pair) => {
      const { bodyA, bodyB } = pair;
        const ball = engine.world.bodies[4];
        const paddle1 = engine.world.bodies[2];
        const paddle2 = engine.world.bodies[3];
        const topWall = engine.world.bodies[0];
        const bottomWall = engine.world.bodies[1];
        if (bodyB == paddle1 || bodyB == paddle2)
        {
            if (bodyB == paddle1)
                aiPredict = true;
            else
            {
                aiDirection = Math.random() < 0.5 ? 1 : -1;
                aiPredict = false;
            }
            hittedTimes++;
            if (hittedTimes <= 10)
                ballSpeed = ballSpeed + 0.2;
            let ballPosition = ball.position;
            let paddlePosition = bodyB.position
            let deltaY = ballPosition.y - paddlePosition.y;
            let barHeight = bodyA.bounds.max.y - bodyA.bounds.min.y;
            let normalizedDeltaY = deltaY / (barHeight / 2);
            if (normalizedDeltaY > 1)
                normalizedDeltaY = 1
            else if (normalizedDeltaY < -1)
                normalizedDeltaY = -1
            ballVelocity.y = ballVelocity.y + maxSpin * normalizedDeltaY;
            ballVelocity.x = ballVelocity.x * -1;
            let speed = Math.sqrt(ballVelocity.x ** 2 + ballVelocity.y ** 2);
            ballVelocity.x = (ballVelocity.x / speed) * ballSpeed
            ballVelocity.y = (ballVelocity.y / speed) * ballSpeed
            ballVelocity = Vector.create(ballVelocity.x, ballVelocity.y)
        }
        if ((bodyB == topWall || bodyB == bottomWall) && (bodyA == ball))
        {
            ballVelocity.y = ballVelocity.y * -1;
            ballVelocity = Vector.create(ballVelocity.x, ballVelocity.y)
        }
        if (aiPredict)
        {
            setTimeout(function() {
                ballPrediction(engine);
            }, 100)
        }
        Matter.Body.setVelocity(ball, ballVelocity);
    });
}

const wallWalk = (newPos: number, paddleOne: Matter.Body, engine : Engine) : boolean => {
    const topWall = engine.world.bodies[0];
    const bottomWall = engine.world.bodies[1];
    const paddleHeight = Math.abs(paddleOne.vertices[2].y - paddleOne.vertices[0].y);
    if (newPos - paddleHeight / 2 < topWall.position.y || newPos + paddleHeight / 2 > bottomWall.position.y)
        return true;
    return false;
}

const handlePlayerMoves = (engine: Matter.Engine) => {
    const paddleOne = engine.world.bodies[2];
    const newPos = paddleOne.position.y + PADDLEMOVE * PADDLESPEED;
    if (!wallWalk(newPos, paddleOne, engine))
        Matter.Body.setPosition(paddleOne, {x: paddleOne.position.x, y: newPos});
}

const scaleToWindow  = (render: Render, actualWidth : number, actualHeight : number) => {
    if (actualHeight < 300)
        actualHeight = 300; 
    const scaleX = ((window.innerWidth * PERCENTWIDTH) / 100) / actualWidth;
    const scaleY = ((window.innerHeight * PERCENTHEIGHT) / 100) / actualHeight;
    const scale = Math.min(scaleX, scaleY);
    const scaledWidth = actualWidth * scale;
    const scaledHeight = actualHeight * scale;
    render.canvas.width = scaledWidth;
    render.canvas.height = scaledHeight;
    render.canvas.style.backgroundImage = `url(${Skins.defaultTable.path})`;
    render.canvas.style.backgroundPosition = 'center';
    render.canvas.style.backgroundSize = 'cover';
    render.canvas.style.borderRadius = '10px';
    render.canvas.style.width = scaledWidth + 'px';
    render.canvas.style.height = scaledHeight + 'px';
    render.canvas.style.margin = 'auto';
    render.options.width = render.canvas.width;
    render.options.height = render.canvas.height;
    return scale;
}

function ScaleAndRender  (engine: Matter.Engine, render: Matter.Render,
    ballVelocity : Matter.Vector, ballSpeed : number): number {
    if (typeof window !== 'undefined') {
        const actualWidth = render.canvas.width;
        const actualHeight = render.canvas.height;
        const scale = scaleToWindow(render, WIDTH, HEIGHT);
        const scaleX = render.canvas.width / actualWidth;
        const scaleY = render.canvas.height / actualHeight;
        const scaleS = Math.min(scaleX, scaleY);
        ballVelocity.x = ballVelocity.x * scaleX;
        ballVelocity.y = ballVelocity.y * scaleY;
        ballSpeed = ballSpeed * scaleS;
        PADDLESPEED = PADDLESPEED * scaleS;
        Matter.Composite.scale(engine.world, scaleX, scaleY, Matter.Vector.create(0,0));
        Matter.Body.setVelocity(engine.world.bodies[4], ballVelocity);
        let i = 0;
        engine.world.bodies.forEach((body: Matter.Body) => {
            if ((i === 2 || i === 3) && body.render.sprite !== undefined) {
                const sprite = body.render.sprite as any;
                const paddleSkin = Skins.defaultPaddle;
                sprite.texture = paddleSkin.path;
                const vertices = body.vertices;
                const bodyWidth = Math.abs(vertices[1].x - vertices[0].x);
                const bodyHeight = Math.abs(vertices[2].y - vertices[0].y);
                const scaleX = bodyWidth / paddleSkin.width;
                const scaleY = bodyHeight / paddleSkin.height;
                sprite.xScale = scaleX;
                sprite.yScale = scaleY;
                sprite.xOffset = 0.5;
                sprite.yOffset = 0.5;
            }
            i++;
        });
    }
    return ballSpeed;
}

const pressHandle = (e: KeyboardEvent) => {
    if (e.key === 'w' || e.key === 'ArrowUp') PADDLEMOVE = -1;
   if (e.key === 's' || e.key === 'ArrowDown') PADDLEMOVE = 1;
};

const releaseHandle = (e: KeyboardEvent) => {
    if (e.key === 'w' || e.key === 'ArrowUp') PADDLEMOVE = 0;
    if (e.key === 's' || e.key === 'ArrowDown') PADDLEMOVE = 0;
};

const checkGoals = (engine: Matter.Engine, render : Render) => {
    const ball = engine.world.bodies[4];
    if (ball.position.x + ball.circleRadius! < 0)
    {
        let score = parseInt(document.getElementById('scoreTwo')!.innerHTML);
        score++;
        document.getElementById('scoreTwo')!.innerHTML = score.toString();
        Matter.Body.setPosition(ball, {x: render.canvas.width / 2, y: render.canvas.height / 2});
        const scaleX = render.canvas.width / WIDTH;
        const scaleY = render.canvas.height / HEIGHT;
        const scaleS = Math.min(scaleX, scaleY);
        ballVelocity = Vector.create(-5 * scaleX, 0);
        ballSpeed = BALLSPEED * scaleS;
        aiPredict = false;
        aiDirection = Math.random() < 0.5 ? 1 : -1;
    }
    else if (ball.position.x - ball.circleRadius! > render.canvas.width)
    {
        let score = parseInt(document.getElementById('scoreOne')!.innerHTML);
        score++;
        document.getElementById('scoreOne')!.innerHTML = score.toString();
        Matter.Body.setPosition(ball, {x: render.canvas.width / 2, y: render.canvas.height / 2});
        const scaleX = render.canvas.width / WIDTH;
        const scaleY = render.canvas.height / HEIGHT;
        const scaleS = Math.min(scaleX, scaleY);
        ballVelocity = Vector.create(5 * scaleX, 0);
        ballSpeed = BALLSPEED * scaleS;
        aiPredict = true;
        aiDirection = Math.random() < 0.5 ? 1 : -1;
        PredictedBallY = render.canvas.height / 2;
    }
}

export default function Singleplayer (){
    const engine = useRef(Matter.Engine.create({ enableSleeping: false, gravity: { x: 0, y: 0 }}));
    const router = useRouter();
    const [playPopUp, setplayPopUp] = useState<boolean>(false);
    const popUpTimeout = useRef<NodeJS.Timeout>(null!);
    const inviterData = useRef<User>(null!);
    
    useEffect(() => {
        socket.connect()
        socket.on('redirect', (destination : string) => {
            router.push(destination)
        })
        socket.on('gameInvite', (data : any) => {
            inviterData.current = data;
            setplayPopUp(true);
            popUpTimeout.current = setTimeout(() => {
            setplayPopUp(false);
            }, 10000);
        })
        const render = Render.create({
          element: document.getElementById('SingleMatch') as HTMLElement,
          engine: engine.current,
          options: {
            width: WIDTH,
            height: HEIGHT,
            wireframes: false,
            background: 'transparent'
          }
        })
        addBodies(engine.current, WIDTH, HEIGHT);
        const runner = Matter.Runner.create({
            delta: 1000 / 60,
            isFixed: true,
            enabled: true
        });
        Matter.Runner.run(runner, engine.current);
        const CollisionEvent =  (event: Matter.IEventCollision<Matter.Engine>) => {collisionDetect(engine.current, event)}
        const renderLoop = () => {
            checkGoals(engine.current, render);
            botMove(engine.current);
            handlePlayerMoves(engine.current);
            ballSpeed = ScaleAndRender(engine.current, render, ballVelocity, ballSpeed)
            Matter.Render.world(render)
        }
        Matter.Events.on(engine.current, 'collisionStart', CollisionEvent);
        Matter.Events.on(runner, "beforeTick", renderLoop);
        window.addEventListener('keydown', pressHandle);
        window.addEventListener('keyup', releaseHandle);
        const enginePointer = engine.current;
        return () => {
            window.removeEventListener('keydown', pressHandle);
            window.removeEventListener('keyup', releaseHandle);
            Matter.Events.off(enginePointer, 'collisionStart', CollisionEvent);
            Matter.Events.off(runner, "beforeTick", renderLoop);
            Matter.Runner.stop(runner)
            Render.stop(render)
            Composite.clear(enginePointer.world, false);
            Engine.clear(enginePointer)
            render.canvas.remove()
            render.textures = {}
            socket.disconnect();
            socket.off('redirect')
            socket.off('gameInvite');
        }
      }, [router])

    return (
        <div id="parentDiv" className="flex flex-col h-full w-full items-center gap-[5vh] mt-[5vh]">
            {/* <Navbar /> */}
            <div id="SingleMatch" className="flex flex-col items-center" />
            <div id="scoreDisplay" className="flex flex-row space-x-2 gap-[1vw] bg-[#282C4E] h-16 rounded-xl">
                <Image alt="" id="playerOneImage" className="min-w-[64px] max-w-[64px] w-[4vw] h-16 mb-2" src="/pFinger.png" />
                <div id="scoreOne" className="flex items-center justify-center text-lg font-bold w-[4vw] h-16 text-white text-center">0</div>
                <div className="splitter"></div>
                <div id="scoreTwo" className="flex items-center justify-center text-lg font-bold w-[4vw] h-16 text-white text-center">0</div>
                <Image alt="" id="playerTwoImage" className=" min-w-[64px] max-w-[64px] w-[4vw] h-16 mb-2" src='/GameAssets/aiIcon.png'/>
            </div>
            {playPopUp && (<AlertMessage onClick={() => setplayPopUp(false)}
            message={`${inviterData.current.username} Wanna Play With You \n Ps: The Notification Gonna Disappear After 10 Sec`}
            type="wannaPlay" id={`${inviterData.current.id}`}/>)}
        </div>
    )
}