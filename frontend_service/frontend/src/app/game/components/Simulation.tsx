'use client';
import React from 'react';
import { useEffect, useRef, useState } from "react";
import Matter, {Engine, Bodies, World, Render, Composite} from 'matter-js';

var ballVelocity = { x: -8, y: 0 };

export const addBodies = (engine: Matter.Engine, cw: number, ch: number) => {
    // add a pong game bodies
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

const collisionDetect = (engine: Matter.Engine, event: Matter.IEventCollision<Matter.Engine>) => {
      // check if the ball collides with any of the paddles
      const pairs = event.pairs;
      const ball = engine.world.bodies[4];
      const paddleA = engine.world.bodies[2];
      const paddleB = engine.world.bodies[3];
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        if (pair.bodyA === ball && pair.bodyB === paddleA) {
          ballVelocity.x = -ballVelocity.x;
          Matter.Body.setVelocity(ball, ballVelocity);
        }
        if (pair.bodyA === ball && pair.bodyB === paddleB) {
          ballVelocity.x = -ballVelocity.x;
          Matter.Body.setVelocity(ball, ballVelocity);
        }
      }
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
        Matter.Runner.run(runner, engine.current);
        addBodies(engine.current, cw, ch);
        const CollisionEvent =  (event: Matter.IEventCollision<Matter.Engine>) => {collisionDetect(engine.current, event)}
        const ball = engine.current.world.bodies[4];
        const renderLoop = () => {
            Matter.Composite.scale(engine.current.world, 1, 1, { x: 0, y: 0 });
            Matter.Body.setVelocity(ball, ballVelocity);
            render.canvas.style.width = '100%'
            render.canvas.style.height = '100%'
            render.canvas.style.background = 'transparent'

            Matter.Render.world(render)
        }
        Matter.Events.on(engine.current, 'collisionStart', CollisionEvent);
        Matter.Events.on(engine.current, "beforeUpdate", renderLoop);
        // unmount
        return () => {
            console.log('unmounting')
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