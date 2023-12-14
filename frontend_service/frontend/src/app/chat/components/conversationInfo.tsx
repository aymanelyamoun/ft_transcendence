import React from "react";
import Image, { StaticImageData } from "next/image";
import avatar from "../../../../public/garou-kid.jpeg";
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
          <p className="">here go buttons</p>
        </ConversationInfoWrapper>
      ) : (
        <ConversationInfoWrapper
          username="channel name"
          title=""
          imgUrl={avatar}
        >
          <p>here go members</p>
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

export const ButtonInfo = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
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
