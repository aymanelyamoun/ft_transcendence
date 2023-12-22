'use client';
import React from 'react';
import { useEffect, useRef, useState } from "react";
import Matter, {Engine, Bodies, World, Render, Composite} from 'matter-js';

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
        // boundaries
        addBodies(engine.current, cw, ch);
        setInterval(() => {
            const ball = engine.current.world.bodies[4];
            Matter.Body.setVelocity(ball, Matter.Vector.create(-5, 0));
            render.canvas.style.width = '100%'
            render.canvas.style.height = '100%'
            render.canvas.style.background = 'transparent'
            Matter.Engine.update(engine.current, 1000 / 60)
            Matter.Render.world(render)
        }, 1000 / 60)
        // unmount
        return () => {
            console.log('unmounting')
          // destroy Matter
            Render.stop(render)
            Composite.clear(engine.current.world, false);
            Engine.clear(engine.current)
            render.canvas.remove()
        //   render.canvas = null
        //   render.context = null
          render.textures = {}
        }
      }, [])
      
      return (
        <div className='absolute flex' id='Scene' style={{ width: '100%', height: '100%' }} />
      )
}