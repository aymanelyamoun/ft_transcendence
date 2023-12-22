import Matter from 'matter-js';
import React, { use, useEffect, useRef } from 'react';

interface BodyProps {
    offset: { x: number; y: number };
    percentWidth: number;
    percentHeight: number;
}

const rectProps : BodyProps = {
    offset: { x: 0.2, y: 0.3 },
    percentWidth: 0.02,
    percentHeight: 0.4,
}

const addBodies = (engine  : Matter.Engine) => {
    const cw = document.getElementById('matter-container')?.clientWidth as number
    const ch = document.getElementById('matter-container')?.clientHeight as number
    const rect = Matter.Bodies.rectangle(
        cw * rectProps.offset.x,
        ch * rectProps.offset.y,
        cw * rectProps.percentWidth,
        ch * rectProps.percentHeight,
        {
            isStatic: false,
            render: {
                fillStyle: '#9A9BD3',
                strokeStyle: '#9A9BD3',
            },
            restitution: 1,
            // let it fall slowly
            frictionAir: 0.01,
        }
    );
    
    Matter.Composite.add(engine.world, [rect]);
  };
export default function AnimationFX(){
    const engine = useRef(Matter.Engine.create({gravity: {x: 0, y: 0.2}}));
    useEffect(() => {
        const cw = document.getElementById('matter-container')?.clientWidth as number
        const ch = document.getElementById('matter-container')?.clientHeight as number
        const element = document.getElementById('matter') as HTMLElement;
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
        render.canvas.style.width = '100%';
        render.canvas.style.height = '100%';
        render.canvas.style.background = 'transparent';
        addBodies(engine.current);
        Matter.Runner.run(runner, engine.current);
        Matter.Render.run(render);
        return () => {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
            Matter.Composite.clear(engine.current.world, false);
            Matter.Engine.clear(engine.current);
            render.canvas.remove();
            render.textures = {};
        };
    }, []);
    return (<div id='matter' className='flex absolute ' style={{ width: '100%', height: '100%' }} />)
}