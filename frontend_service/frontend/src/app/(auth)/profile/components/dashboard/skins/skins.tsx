"use client"
import React from 'react';
import styles from "./skins.module.css";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import styled from 'styled-components';
import Link from 'next/link';

// const SpanRoot = styled.button`
//   border: none;
//   transition: all 0.3s ease;
//   overflow: hidden;
//   height: 100%;
//   width: 100%;
//   position: relative;

//     &:after {
//       position: absolute;
//       content: " ";
//       top: 0;
//       left: 0;
//       width: 100%;
//       height: 100%;
//       background-color: rgb(154 155 211 / 49%);
//       /* background-image: linear-gradient(31deg, #ffffff 0%, #453b87 74%); */
//       transition: all 0.3s ease;
//     }
//     }

//     &:hover {
//       // background: transparent;
//       // box-shadow:  4px 4px 6px 0 rgba(255,255,255,.5),
//       //             -4px -4px 6px 0 rgba(116, 125, 136, .2), 
//       //   inset -4px -4px 6px 0 rgba(255,255,255,.5),
//       //   inset 4px 4px 6px 0 rgba(116, 125, 136, .3);
//       // color: #fff;
//     }

//     &:hover:after {
//       -webkit-transform: scale(1) rotate(180deg);
//       transform: scale(1) rotate(180deg);
//       box-shadow:  4px 4px 6px 0 rgba(255,255,255,.5),
//                   -4px -4px 6px 0 rgba(116, 125, 136, .2), 
//         inset -4px -4px 6px 0 rgba(255,255,255,.5),
//         inset 4px 4px 6px 0 rgba(116, 125, 136, .3);
//     }
//   }
// `;

// const ButtonSpan = styled.span`
// position: relative;
// right: 2.3rem;
// top: 0.5rem;
// display: block;
// width: 100%;
// height: 100%;
// font-family: "Inter",sans-serif;
// font-weight: 800;
// font-size: 30px;
// font-weight: 500;
// color: aliceblue;
// align-self: flex-start;
// margin-left: 40px;
// z-index: 1;
// `;


const SpanContainer = styled.div`
position: relative;
top: 1rem;
left: 1rem;
height: 5rem;
width: 12rem;
`;

const Skins: React.FC = () => {
  return (
    <div className={styles.Skins}>
        <Link href="/profile/skins" className={`${styles['skins-container']} group hover:cursor-pointer hover:opacity-[0.8]`}>
        {/* <div className={`${styles['skins-container']} group hover:cursor-pointer hover:opacity-[0.8]`}> */}
          <SpanContainer>
          <span className={styles['skins-title']}>Skins</span>
          </SpanContainer>
          <div className={`${styles['Skins-rectangle']}`}>
            <div className={`${styles['Skins-circle']} `}></div>
            <div className={`${styles['Skins-stick']} `}></div>
          </div>
        {/* </div> */}
    </Link>
      </div>
  );
};

export default Skins;