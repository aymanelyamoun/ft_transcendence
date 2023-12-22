'use client';
import React from 'react';
import { useEffect, useRef, useState } from "react";
import Matter, {Engine, Bodies, World, Render, Composite} from 'matter-js';

var BALLSPEED = 8;
var ballVelocity = { x: BALLSPEED, y: BALLSPEED };
const getScale = (cw: number, ch: number, w: number, h: number) : number => {
    const scaleX = cw / w;
    const scaleY = ch / h;
    return Math.min(scaleX, scaleY);
}

const addBodies = (engine: Matter.Engine, cw: number, ch: number) => {
  // paddles will have an offset of 2% of the canvas width
  // and a height of 20% of the canvas height

    const paddleWidth = cw * 0.025; // 3% of canvas width
    const paddleHeight = ch * 0.13; // 13% of canvas height
    const paddleOffset = cw * 0.01; // 1% offset
    const ballRadius = cw * 0.01; // 1% of canvas width
    const wallHeight = ch * 0.01; // 1% of canvas height
    const ball = Bodies.circle(cw / 2, ch / 2, ballRadius, { isStatic: false, restitution: 1,
      render:{fillStyle: "white"}})
    const paddleA = Matter.Bodies.rectangle(paddleOffset, ch / 2, paddleWidth, paddleHeight,
      { isStatic: true, render:{fillStyle: "white"} });
    const paddleB = Matter.Bodies.rectangle(cw - paddleOffset, ch / 2, paddleWidth, paddleHeight,
      { isStatic: true, render:{fillStyle: "white"} });
    const wallTop = Bodies.rectangle(cw / 2, 0, cw, wallHeight, { isStatic: true, render:{visible: false} })
    const wallBottom = Bodies.rectangle(cw / 2, ch, cw, wallHeight, { isStatic: true, render:{visible: false} })
    World.add(engine.world, [wallTop, wallBottom, paddleA, paddleB, ball])
}

const collisionDetect = (engine: Matter.Engine, event: Matter.IEventCollision<Matter.Engine>) =>  {
      const pairs = event.pairs;
      const ball = engine.world.bodies[4];
      const paddleA = engine.world.bodies[2];
      const paddleB = engine.world.bodies[3];
      const topWall = engine.world.bodies[0];
      const bottomWall = engine.world.bodies[1];
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        const relativeY = pair.collision.normal.y;
        // create a random number between 2 and 3
        const rand = Math.floor(Math.random() * 2) + 2;
        if (pair.bodyA === ball && pair.bodyB === paddleA) {
          ballVelocity.x = -ballVelocity.x;

          ballVelocity.y = ballVelocity.y + relativeY * rand;
        }
        if (pair.bodyA === ball && pair.bodyB === paddleB) {
          ballVelocity.x = -ballVelocity.x;
          ballVelocity.y = ballVelocity.y + relativeY * rand;
        }
        if (pair.bodyA === ball && pair.bodyB === topWall) {
          ballVelocity.y = -ballVelocity.y;
        }
        if (pair.bodyA === ball && pair.bodyB === bottomWall) {
          ballVelocity.y = -ballVelocity.y;
        }
      }
      const speed = Math.sqrt(ballVelocity.x ** 2 + ballVelocity.y ** 2);
      const scaleFactor = BALLSPEED / speed;
      ballVelocity.x *= scaleFactor;
      ballVelocity.y *= scaleFactor;
}

const beforeMove = (body: Matter.Body, position: Matter.Vector, engine : Engine) => {
  const topWall = engine.world.bodies[0];
  const bottomWall = engine.world.bodies[1];
  const topBounds = topWall.bounds.min.y;
  const bottomBounds = bottomWall.bounds.max.y;
  const paddleHeight = body.bounds.max.y - body.bounds.min.y;
  if (position.y - paddleHeight / 2 > topBounds && position.y + paddleHeight / 2 < bottomBounds)
      Matter.Body.setPosition(body, position);
}

const aiMoveOne = (engine : Engine) => {
    const paddleA = engine.world.bodies[2];
    const ball = engine.world.bodies[4];
    // move the paddle to the ball position Y only if the ball is moving to the paddle
    if (ball.velocity.x < 0) {
      if (paddleA.position.y > ball.position.y) {
        beforeMove(paddleA, { x: paddleA.position.x, y: paddleA.position.y - BALLSPEED}, engine)
      }
      if (paddleA.position.y < ball.position.y) {
        beforeMove(paddleA, { x: paddleA.position.x, y: paddleA.position.y + BALLSPEED}, engine)
      }
    }
} 

const aiMoveTwo = (engine : Engine) => {
    const paddleB = engine.world.bodies[3];
    const ball = engine.world.bodies[4];
    // move the paddle to the ball position Y only if the ball is moving to the paddle
    if (ball.velocity.x > 0) {
      if (paddleB.position.y > ball.position.y) {
        beforeMove(paddleB, { x: paddleB.position.x, y: paddleB.position.y - BALLSPEED}, engine)
      }
      if (paddleB.position.y < ball.position.y) {
        beforeMove(paddleB, { x: paddleB.position.x, y: paddleB.position.y + BALLSPEED}, engine)
      }
    }
} 

const repositionBall = (engine : Engine, render : Render) => {
    const ball = engine.world.bodies[4];
    if (ball.position.x < 0 || ball.position.x > render.canvas.width)
      Matter.Body.setPosition(ball, { x: render.canvas.width / 2, y: render.canvas.height / 2});
}

export default function Simulation() { // DO NOT FORGET TO MAKE THE PARENT OF THIS COMPONENT RELATIVE A W9
  // AND MODIFY THE PARENT ID TO "ParentSim"
    const engine = useRef(Matter.Engine.create({ enableSleeping: false, gravity: { x: 0, y: 0 }}));
    useEffect(() => {
        const cw = document.getElementById('ParentSim')?.clientWidth as number
        const ch = document.getElementById('ParentSim')?.clientHeight as number
        const element = document.getElementById('Scene') as HTMLElement
        const render = Render.create({
          element: element,
          engine: engine.current,
          options: {
            width: cw,
            height: ch,
            wireframes: false,
            background: 'transparent'
          }
        })
        const runner = Matter.Runner.create(
          { isFixed: true,
          delta: 1000 / 60 },
        );
        const CollisionEvent =  (event: Matter.IEventCollision<Matter.Engine>) => {collisionDetect(engine.current, event)}
        render.canvas.style.width = '100%'
        render.canvas.style.height = '100%'
        render.canvas.style.background = 'transparent'
        addBodies(engine.current, render.canvas.width, render.canvas.height);
        const ball = engine.current.world.bodies[4];
        var oldWidth = render.canvas.width;
        var oldHeight = render.canvas.height;
        BALLSPEED = render.canvas.width * 0.01;
        ballVelocity = { x: BALLSPEED, y: BALLSPEED - render.canvas.width * 0.005 };
        const renderLoop = () => {
          BALLSPEED = render.canvas.width * 0.01;
          const scaleX = render.canvas.width / oldWidth;
          const scaleY = render.canvas.height / oldHeight;
          render.options.width = render.canvas.width;
          render.options.height = render.canvas.height; 
          Matter.Body.setVelocity(ball, ballVelocity);
          Matter.Composite.scale(engine.current.world, scaleX, scaleY, { x: 0, y: 0 });
          repositionBall(engine.current, render);
          aiMoveOne(engine.current);
          aiMoveTwo(engine.current);
          Matter.Render.world(render)
        }
        Matter.Events.on(engine.current, 'collisionStart', CollisionEvent);
        Matter.Events.on(engine.current, "beforeUpdate", renderLoop);
        Matter.Runner.run(runner, engine.current);
        return () => {
            Matter.Runner.stop(runner)
            Matter.Events.off(engine.current, "beforeUpdate", renderLoop)
            Matter.Events.off(engine.current, 'collisionStart', CollisionEvent)
            Render.stop(render)
            Composite.clear(engine.current.world, false);
            Engine.clear(engine.current)
            render.canvas.remove()
            render.textures = {}
        }
      }, [])
      
      return (
        <div className='absolute flex' id='Scene' style={{ width: '100%', height: '100%' }} />
      )
}