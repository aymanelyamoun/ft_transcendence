import Simulation from '@/app/(auth)/game/components/Simulation';
import React from 'react'
import styled from 'styled-components'

const AnimationContainer = styled.div`
grid-row-start: 2;
grid-row-end: 3;
grid-column-start: 3;
grid-column-end: 4;
display: flex;
flex-direction: column;
transition: all 300ms ease;
position: relative;
bottom: 1vh;
height: 113%;

@media (min-width: 1300px) and (max-width: 1900px)
{
    display: none;
}
`;

const Animation = () => {
  return (
    <AnimationContainer id='ParentSim' className='relative flex flex-col justify-center items-center '>
      <Simulation />
    </AnimationContainer>
  )
}

export default Animation