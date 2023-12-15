import React from "react";
import Image, { StaticImageData } from "next/image";
import avatar from "../../../../public/garou-kid.jpeg";
import { MdPersonAddAlt1 } from "react-icons/md";
import { MdGroupAdd } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { FaRunning } from "react-icons/fa";
// import { $Enums } from "@prisma/client";
// import { CONVERSATION_TYPE } from "../../../../../../backend_service/backend/types/chatTypes";
// import { CONVERSATION_TYP } from "../../../../../../backend_service/backend/types/chatTypes";

export const ConversationInfo = ({ type }: { type: string }) => {
  return (
    <>
      {type === "DIRECT" ? (
        <ConversationInfoWrapper
          username="username"
          title="title"
          imgUrl={avatar}
        >
          <ButtonInfo width="10" hight="10">
            <div className="flex gap-3 justify-center flex-wrap pr-10 pl-10">
              <CostumeButton
                bgColor="bg-white-blue border-[#FEFFFF]"
                color="white"
                width="w-20"
                hight="h-11"
              >
                <MdPersonAddAlt1 color="#1C2041" size={24} />
              </CostumeButton>

              <CostumeButton
                bgColor="bg-white-blue border-[#FEFFFF]"
                color="white"
                width="w-20"
                hight="h-11"
              >
                <MdGroupAdd color="#1C2041" size={24} />
              </CostumeButton>

              <CostumeButton
                bgColor="bg-white-blue border-[#FEFFFF]"
                color="white"
                width="w-44"
                hight="h-11"
              >
                <IoGameController color="#1C2041" size={24} />
              </CostumeButton>
            </div>
          </ButtonInfo>
        </ConversationInfoWrapper>
      ) : (
        <ConversationInfoWrapper
          username="channel name"
          title=""
          imgUrl={avatar}
        >
          <ButtonInfo width="10" hight="10">
            {/* <div className="flex min-h-3b max-w-button-max flex-col justify-between items-center"> */}
            <>
              <CostumeButton
                bgColor="bg-transparent border-[#FC2B5D]"
                color="wthie"
                width="w-4/5"
                hight="h-11"
              >
                <p className="bg-red">exit</p>
                <FaRunning color="red" />
              </CostumeButton>

              <CostumeButton
                bgColor="bg-transparent border-[#FC2B5D]"
                color="wthie"
                width="w-4/5"
                hight="h-11"
              >
                <p className="bg-red">exit</p>
                <FaRunning color="red" />
              </CostumeButton>

              <CostumeButton
                bgColor="bg-transparent border-[#FC2B5D]"
                color="wthie"
                width="w-4/5"
                hight="h-11"
              >
                <p className="bg-red">exit</p>
                <FaRunning color="red" />
              </CostumeButton>
            </>
          </ButtonInfo>
        </ConversationInfoWrapper>
      )}
    </>
  );
};

const ConversationInfoWrapper = ({
  username,
  title,
  imgUrl,
  children,
}: {
  username: string;
  title: string;
  imgUrl: StaticImageData;
  children: React.ReactNode;
}) => {
  return (
    <div className="profileInfo basis-1/4 bg-purple-600 flex flex-col text-center">
      {title !== "" ? (
        <ProfileInfos username="tmp">
          {" "}
          <p className="titleInfo">{title}</p>{" "}
        </ProfileInfos>
      ) : (
        <ProfileInfos username="tmp2"> </ProfileInfos>
      )}
      {children}
    </div>
  );
};

const CostumeButton = ({
  bgColor,
  color,
  children,
  width,
  hight,
}: {
  bgColor: string;
  color: string;
  width: string;
  hight: string;
  children: React.ReactNode;
}) => {
  return (
    <button
      className={`flex items-center justify-around ${bgColor} text-[${color}] p-2 ${width} ${hight} rounded-sm border-2`}
    >
      {children}
    </button>
  );
};

export const ButtonInfo = ({
  children,
}: {
  width: string;
  hight: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex min-h-3b max-w-button-max flex-col justify-between items-center">
      {children}
    </div>
  );
};

const ProfileInfos = ({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center ">
      <Image className="avatar" src={avatar} alt={"avatar"} />
      <h4 className="nameInfo"> {username} </h4>
      {children}
    </div>
  );
};

// export default conversationInfo;
