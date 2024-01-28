// "use client";
import React, { useRef, useEffect, useState, use } from "react";
import "./globals.css";
import Matter, {
  Engine,
  Render,
  World,
  Bodies,
  Body,
  Composite,
  Bounds,
} from "matter-js";
// import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { Socket, io } from "socket.io-client";
import { useRouter } from "next/navigation";
import * as Skins from "../utils/Skins";
import GameDialog from "../components/GameDialog";
import Image from "next/image";

// TO DO LIST:
// 1. fix the profile pictures "border-radius" and "image not showing" issue. DONE
// 2. delete the game after it ends. DONE
// 4. add a timer for the game.NOT DONE YET
// 5. add the offline game mode. DONE
// 6. add the online game mode. DONE
// 7. add Fog zone mini game. I DON'T THINK SO

const HEIGHT: number = 800;
const WIDTH: number = 1500;
const PERCENTWIDTH = 100; // %
const PERCENTHEIGHT = 70; // %

const scaleToWindow = (render: Render) => {
  const scaleX = (window.innerWidth * PERCENTWIDTH) / 100 / WIDTH;
  const scaleY = (window.innerHeight * PERCENTHEIGHT) / 100 / HEIGHT;
  const scale = Math.min(scaleX, scaleY);
  const scaledWidth = WIDTH * scale;
  const scaledHeight = HEIGHT * scale;
  render.canvas.width = scaledWidth;
  render.canvas.height = scaledHeight;
  render.canvas.style.backgroundImage = `url(${tableSkin.path})`;
  render.canvas.style.backgroundPosition = "center";
  render.canvas.style.backgroundSize = "cover";
  render.canvas.style.borderRadius = "10px";
  render.canvas.style.width = scaledWidth + "px";
  render.canvas.style.height = scaledHeight + "px";
  render.canvas.style.margin = "auto";
  render.options.width = render.canvas.width;
  render.options.height = render.canvas.height;
  return scale;
};
var ballSkin = Skins.defaultBall;
var paddleSkin = Skins.defaultPaddle;
var tableSkin = Skins.defaultTable;
var parsedBodies: Matter.Body[] = [];

const handleEndGame = (endGameData: any, router: any, winnerImg :React.MutableRefObject<string>) => {
  // setGameEnd(true);
  const winner =
    endGameData.winner === "1"
      ? document.getElementById("playerOneImage")!
      : document.getElementById("playerTwoImage")!;
  const loser =
    endGameData.winner === "1"
      ? document.getElementById("playerTwoImage")!
      : document.getElementById("playerOneImage")!;
  const winnerImage = winner as HTMLImageElement;
  if (winnerImage.src === "" || winnerImage.src === undefined || winnerImage.src === null)
    winnerImage.src = "/pFinger.png";
  winnerImg.current = winnerImage.src;
  winner.style.border = "5px solid green";
  loser.style.border = "5px solid red";
  setTimeout(() => {
    router.push("/game");
  }, 3000);
};

const handleGameLoop = (socketRef: Socket, engine: Engine, render: Render) => {
  render = Render.create({
    element: document.getElementById("RenderMatch") as HTMLElement,
    engine: engine,
    options: {
      wireframes: false,
      background: "transparent",
    },
  });
  var i: number = 0;
  socketRef.on(
    "updateFrames",
    (bodies: any, playersScore: any, playersData: any) => {
      parsedBodies = JSON.parse(bodies).map((bodyJson: Matter.Body) =>
        Body.create(bodyJson)
      );
      var playerOneImage = document.getElementById(
        "playerOneImage"
      )! as HTMLImageElement;
      var playerTwoImage = document.getElementById(
        "playerTwoImage"
      )! as HTMLImageElement;
      const scoreOne = document.getElementById("scoreOne")!;
      const scoreTwo = document.getElementById("scoreTwo")!;
      if (scoreOne && scoreTwo && playerOneImage && playerTwoImage) {
        scoreOne.innerHTML = playersScore[0];
        scoreTwo.innerHTML = playersScore[1];
        playerOneImage.src = playersData[0].profilePic;
        playerTwoImage.src = playersData[1].profilePic;
      }
      if (typeof window !== "undefined") {
        render.element = document.getElementById("RenderMatch") as HTMLElement;
        render.options.wireframes = false;
        if (DEBUG) render.options.wireframes = true;
        Composite.clear(engine.world, false);
        const scale = scaleToWindow(render);
        Composite.add(engine.world, parsedBodies);
        Composite.scale(engine.world, scale, scale, { x: 0, y: 0 });
        var i = 0;
        var ballBody: Matter.Body = engine.world.bodies[4];
        engine.world.bodies.forEach((body: Matter.Body) => {
          if ((i === 2 || i === 3) && body.render.sprite !== undefined) {
            const sprite = body.render.sprite as any;
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
          if (i === 4 && body.render.sprite != undefined) {
            // body.render.sprite = undefined;
            const sprite = body.render.sprite as any;
            body.render.sprite.texture = ballSkin.path;
            const scaleX = (body.circleRadius! * 2) / ballSkin.width;
            const scaleY = (body.circleRadius! * 2) / ballSkin.height;
            // const scale = Math.min(scaleX, scaleY);
            sprite.xScale = scaleX;
            sprite.yScale = scaleY;
            sprite.yOffset = 0.5;
            sprite.xOffset = 0.5;
          }
          i++;
        });
        Render.world(render);
      }
    }
  );
};

var DEBUG = false;
const pressHandle = (e: KeyboardEvent, socket: Socket) => {
  if (socket) {
    if (e.key === "w" || e.key === "ArrowUp") socket.emit("onMove", -1);
    if (e.key === "s" || e.key === "ArrowDown") socket.emit("onMove", 1);
  }
};

const releaseHandle = (e: KeyboardEvent, socket: Socket) => {
  if (socket) {
    if (e.key === "w" || e.key === "ArrowUp") socket.emit("onMove", 0);
    if (e.key === "s" || e.key === "ArrowDown") socket.emit("onMove", 0);
  }
};
const setSkins = (selfData: any) => {
  ballSkin = Skins.getBallSkin(selfData.ball);
  paddleSkin = Skins.getPaddleSkin(selfData.paddle);
  tableSkin = Skins.getTableSkin(selfData.table);
};

const MatchScene = () => {
  const socketRef = useRef<Socket | null>(null);
  const render = useRef<Render>(null);
  const router = useRouter();
  const [gameEnd, setGameEnd] = useState(false);
  const engine = useRef<Engine>(Matter.Engine.create());
  const winnerImg = useRef<string>("");
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const matchID = queryParams.get("matchID");
    if (matchID === null) router.push("/game");
    if (socketRef.current === null) {
      socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_URL+"chat", {
        withCredentials: true,
      });
      socketRef.current.emit("joinMatch", matchID);
    }
    socketRef.current.on("redirect", (destination: string, reason: string) => {
      alert(reason);
      router.push(destination);
    });
    socketRef.current.on("startFriendGame", (playersData: any) => {
      console.log('GAME STARTING')
      socketRef.current!.on("selfData", setSkins);
      socketRef.current!.on("endGame", (eData: any) => {
        handleEndGame(eData, router, winnerImg);
        setGameEnd(true);
      });
      document.addEventListener("keydown", (e) =>
        pressHandle(e, socketRef.current!)
      );
      document.addEventListener("keyup", (e) =>
        releaseHandle(e, socketRef.current!)
      );
      engine.current.gravity.y = 0;
      handleGameLoop(socketRef.current!, engine.current, render.current!);
    });
    const renderPointer = render.current;
    const enginePointer = engine.current;
    return () => {
      socketRef.current?.off("endGame");
      socketRef.current?.off("updateFrames");
      socketRef.current?.off("redirect");
      socketRef.current?.off("startFriendGame");
      socketRef.current?.disconnect();
      socketRef.current = null; // 39l 3awtani
      if (renderPointer !== null) Render.stop(renderPointer);
      if (enginePointer !== null) Matter.Engine.clear(enginePointer);
      document.removeEventListener("keydown", (e) =>
        pressHandle(e, socketRef.current!)
      );
      document.removeEventListener("keyup", (e) =>
        releaseHandle(e, socketRef.current!)
      );
    };
  }, [router]);

  return (
    <div
      id="parentDiv"
      className="flex flex-col h-full w-full justify-center items-center gap-[5vh] mt-[5vh]"
    >
      <div id="RenderMatch" className="flex flex-col items-center" />
      <div
        id="scoreDisplay"
        className="flex flex-row space-x-2 gap-[1vw] bg-[#282C4E] h-16 "
      >
        <Image alt="img" src={""}
          id="playerOneImage"
          className="min-w-[64px] max-w-[64px] w-[4vw] h-16 bg-white mb-2"
        />
        <div
          id="scoreOne"
          className="flex items-center justify-center text-lg font-bold w-[4vw] h-16 text-white text-center"
        >
          0
        </div>
        <div className="splitter"></div>
        <div
          id="scoreTwo"
          className="flex items-center justify-center text-lg font-bold w-[4vw] h-16 text-white text-center"
        >
          0
        </div>
        <Image alt="img" src={""}
          id="playerTwoImage"
          className=" min-w-[64px] max-w-[64px] w-[4vw] h-16 bg-white mb-2"
        />
      </div>
        {gameEnd && <GameDialog picture={winnerImg.current}/>}
    </div>
  );
};

export default MatchScene;
