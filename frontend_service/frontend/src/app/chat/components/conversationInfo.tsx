import React, { use, useState } from "react";
import Image, { StaticImageData } from "next/image";
import avatar from "../../../../public/garou-kid.jpeg";
import { MdPersonAddAlt1 } from "react-icons/md";
import { MdGroupAdd } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { FaRunning } from "react-icons/fa";
import ChatSection from "./ChatSection";
import { Conversations } from "./ConversationList";
import { ConversationIthemProps } from "../../../../../../backend_service/backend/types/chatTypes";
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
            <div className="flex gap-3 justify-center flex-wrap pr-10 pl-10 mx-12">
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
          <MemberList />
          <ButtonInfo width="10" hight="10">
            <div className="flex min-h-3b max-w-button-max w-40 flex-col justify-between items-center mt-12">
              <CostumeButton
                bgColor="bg-transparent border-[#FC2B5D]"
                color="#FC2B5D"
                width="w-full"
                hight="h-11"
              >
                <p className=" text-light-red font-semibold font-poppins text-sm">
                  Exit Channel
                </p>
                <FaRunning color="#FC2B5D" size={24} />
              </CostumeButton>

              <CostumeButton
                bgColor="bg-transparent border-[#FC2B5D]"
                color="wthie"
                width="w-full"
                hight="h-11"
              >
                <p className=" text-light-red font-semibold font-poppins text-sm">
                  Exit Channel
                </p>
                <FaRunning color="#FC2B5D" size={24} />
              </CostumeButton>

              <CostumeButton
                bgColor="bg-transparent border-[#FC2B5D]"
                color="wthie"
                width="w-full"
                hight="h-11"
              >
                <p className=" text-light-red font-semibold font-poppins text-sm">
                  Exit Channel
                </p>
                <FaRunning color="#FC2B5D" size={24} />
              </CostumeButton>
            </div>
          </ButtonInfo>
        </ConversationInfoWrapper>
      )}
    </>
  );
};

const MemberIthem = ({
  imgUrl,
  name,
  isAdmin,
}: {
  imgUrl: string;
  name: string;
  isAdmin: boolean;
}) => {
  return (
    <div className="flex justify-between w-full  m-2 items-center ">
      <div className="flex w-24 justify-between items-center">
        <div className="w-10 h-10">
          <Image className="avatar-small" src={avatar} alt={"avatar"} />
        </div>
        <h3>{name}</h3>
      </div>
      <p>Admin</p>
    </div>
  );
};

const MemberList = ({}: {}) => {
  return (
    <>
      <MemberSeparator />
      <MemberIthem imgUrl="some/url" name="name" isAdmin={true} />
      <MemberIthem imgUrl="some/url" name="name" isAdmin={true} />
      <MemberIthem imgUrl="some/url" name="name" isAdmin={true} />
      <MemberIthem imgUrl="some/url" name="name" isAdmin={true} />
      <MemberIthem imgUrl="some/url" name="name" isAdmin={true} />
      <MemberIthem imgUrl="some/url" name="name" isAdmin={true} />
      <MemberIthem imgUrl="some/url" name="name" isAdmin={true} />
      <MemberIthem imgUrl="some/url" name="name" isAdmin={true} />
      <MemberIthem imgUrl="some/url" name="name" isAdmin={true} />
      <MemberIthem imgUrl="some/url" name="name" isAdmin={true} />
      <MemberIthem imgUrl="some/url" name="name" isAdmin={true} />
      <MemberIthem imgUrl="some/url" name="name" isAdmin={true} />
      <MemberIthem imgUrl="some/url" name="name" isAdmin={true} />
      <MemberIthem imgUrl="some/url" name="name" isAdmin={true} />
      <MemberIthem imgUrl="some/url" name="name" isAdmin={true} />
      <MemberIthem imgUrl="some/url" name="name" isAdmin={true} />
      <MemberIthem imgUrl="some/url" name="name" isAdmin={true} />
      <MemberIthem imgUrl="some/url" name="name" isAdmin={true} />
    </>
  );
};

const MemberSeparator = () => {
  return (
    <div className="flex w-full justify-between mt-8 font-poppins font-light items-center">
      <div className="border-b-2 border-light-purple min-w-3 w-1/4 mt-2 mb-2"></div>
      <h3 className="text-light-purple">Members</h3>
      <div className="border-b-2 border-light-purple min-w-3 w-1/4 mt-2 mb-2"></div>
    </div>
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
    <div className="profileInfo basis-1/4 bg-purple-600 flex flex-col items-center overflow-y-auto pb-12">
      {title !== "" ? (
        <ProfileInfos username="tmp">
          {" "}
          <p className="titleInfo">{title}</p>{" "}
        </ProfileInfos>
      ) : (
        <ProfileInfos username="tmp2">
          <></>
        </ProfileInfos>
      )}
      {children}
    </div>
  );
};

const Conversation = () => {
  return (
    <div className="chatNprofile h-full basis-3/4 flex gap-9 px-12 py-24">
      <ChatSection />
      <ConversationInfo type="D"></ConversationInfo>
    </div>
  );
};

export const ChatPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [ConversationList, setConversationList] = useState<ConversationIthemProps[]>([]);
  // const [lastMessageFrom, setLastMessageFrom] = useState<string[]>([]);

  return (
    <main className="main flex justify-center items-center h-full w-full ">
      <div className="h-full basis-1/4 flex">
        <Conversations>{/* <ConversationList /> */}</Conversations>
      </div>
      <Conversation />
    </main>
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
    <div className="flex min-h-3b max-w-button-max w-40 flex-col justify-between items-center">
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
