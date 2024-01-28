import Matter, {Composite} from 'matter-js';
import React, { use, useEffect, useRef } from 'react';

interface BodyProps {
    offset: { x: number; y: number };
    percentWidth: number;
    percentHeight: number;
}
const ballRadius = 40;
const wallHeight = 150;
const wallWidth = 150
const ballRestitution = 1;
const circleProps : BodyProps = {
    offset: { x: 0.8, y: 0 },
    percentWidth: 0.05,
    percentHeight: 0, // circle is a circle
}

const addBodies = (engine  : Matter.Engine, mouseConstraint : Matter.MouseConstraint) => {
    const cw = document.getElementById('matter-container')?.clientWidth as number
    const ch = document.getElementById('matter-container')?.clientHeight as number

    const ground = Matter.Bodies.rectangle(
        cw / 2,
        ch + wallHeight / 2,
        cw,
        wallHeight,
        {
            isStatic: true,
            render: {
               visible: true,
            },
        }
    );

    const leftWall = Matter.Bodies.rectangle(
        -wallWidth / 2,
        ch / 2,
        wallWidth,
        ch,
        {
            isStatic: true,
            render: {
               visible: true,
            // fillStyle: 'white',
            },
        }
    );

    const rightWall = Matter.Bodies.rectangle(
        cw + wallWidth / 2,
        ch / 2,
        wallWidth,
        ch,
        {
            isStatic: true,
            render: {
               visible: true,
            // fillStyle: 'white',
            },
        }
    );

    const circle = Matter.Bodies.circle(
        cw * circleProps.offset.x,
        ch * circleProps.offset.y,
        ballRadius,
        {
            isStatic: false,
            render: {
                fillStyle: '#9A9BD3',
                strokeStyle: '#9A9BD3',
            },
            restitution: ballRestitution,
            // frictionAir: 0.01,
        }
    );

    Matter.Composite.add(engine.world, [ground ,circle, leftWall, rightWall, mouseConstraint]);
  };

const ballProtect = (engine : Matter.Engine) => {
    //to test
    
    const ball = engine.world.bodies[1];
    const cw = document.getElementById('matter-container')?.clientWidth as number
    const ch = document.getElementById('matter-container')?.clientHeight as number
    const ballRadius = 25;
    const ballX = ball.position.x;
    const ballY = ball.position.y;
    const ballLeft = ballX + ballRadius;
    const ballRight = ballX - ballRadius;
    // const ballTop = ballY + ballRadius;
    const ballBottom = ballY - ballRadius;
    if (ballRight < 0) 
        Matter.Body.setPosition(ball, { x: ballRadius, y: ballY });
    if (ballLeft > cw)
        Matter.Body.setPosition(ball, { x: cw - ballRadius, y: ballY });
    // if (ballTop < 0)
    //     Matter.Body.setPosition(ball, { x: ballX, y: ballRadius });
    if (ballBottom > ch)
        Matter.Body.setPosition(ball, { x: ballX, y: ch - ballRadius });
}

const magnetize = (e: any ,mouseConstraint : Matter.MouseConstraint, engine : Matter.Engine) => {
    const mouseX = e.mouse.position.x;
    const mouseY = e.mouse.position.y;
    const ball = engine.world.bodies[1];
    // calculate the angle bin kora o l mouse bach t3ref direction
    const angle = Math.atan2(mouseY - ball.position.y, mouseX - ball.position.x);
    
    const forceMagnitude = 0.005;
    const forceX = forceMagnitude * Math.cos(angle);
    const forceY = forceMagnitude * Math.sin(angle);
    Matter.Body.applyForce(ball, ball.position, { x: forceX, y: forceY });
}

export default function AnimationFX(){
    const engine = useRef(Matter.Engine.create({gravity: {x: 0, y: 1}}));
    useEffect(() => {
        const cw = document.getElementById('matter-container')?.clientWidth as number
        const ch = document.getElementById('matter-container')?.clientHeight as number
        // add mouse control
        const element = document.getElementById('matter') as HTMLElement;
        const mouse = Matter.Mouse.create(document.getElementById('matter-container')!);
        const mouseConstraint = Matter.MouseConstraint.create(engine.current, {
            mouse: mouse,
            constraint: {
                render: {visible: false,},
                stiffness: 0.2,
            },
        });
        const render = Matter.Render.create({
            element: element,
            engine: engine.current,
            options: {
                width: cw,
                height: ch,
                wireframes: false,
                background: 'transparent'
            }});
            const runner = Matter.Runner.create({delta: 1000 / 60, isFixed: true});
            addBodies(engine.current, mouseConstraint);
            function handleResize() {
                const cw = document.getElementById('matter-container')?.clientWidth as number
                const ch = document.getElementById('matter-container')?.clientHeight as number
                const scaleX = cw / render.canvas.width;
                const scaleY = ch / render.canvas.height;
                render.canvas.width = cw;
                render.canvas.height = ch;
                render.options.width = cw;
                render.options.height = ch;
                // scale Walls
                Matter.Body.scale(engine.current.world.bodies[0], scaleX, 1);
                Matter.Body.scale(engine.current.world.bodies[2], 1, scaleY);
                Matter.Body.scale(engine.current.world.bodies[3], 1, scaleY);
                Matter.Body.setPosition(engine.current.world.bodies[0], {x: cw / 2, y: ch + wallHeight / 2});
                Matter.Body.setPosition(engine.current.world.bodies[2], {x: -wallWidth / 2, y: ch / 2});
                Matter.Body.setPosition(engine.current.world.bodies[3], {x: cw + wallWidth / 2, y: ch / 2});
                // print world bounds
            }
            function frameUpdate() {ballProtect(engine.current);}
            Matter.Runner.run(runner, engine.current);
            window.addEventListener('resize', handleResize);
            Matter.Events.on(engine.current, 'beforeUpdate', frameUpdate);
            Matter.Events.on(mouseConstraint, "mousemove", (e) => magnetize(e, mouseConstraint, engine.current));
            Matter.Render.run(render);
            const enginePointer = engine.current;
            return () => {
                Matter.Events.off(enginePointer, 'beforeUpdate', frameUpdate);
                Matter.Events.off(mouseConstraint, "mousemove", (e) => magnetize(e, mouseConstraint, enginePointer));
                window.removeEventListener('resize', handleResize);
                Matter.Render.stop(render);
                Matter.Runner.stop(runner);
                Matter.Composite.clear(enginePointer.world, false);
                Matter.Engine.clear(enginePointer);
                render.canvas.remove();
                render.textures = {};
            };
    }, []);
    return (<div id='matter' className='flex absolute'/>)
}