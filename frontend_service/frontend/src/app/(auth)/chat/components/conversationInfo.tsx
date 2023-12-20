import React, {
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import Image, { StaticImageData } from "next/image";
import avatar from "../../../../../public/garou-kid.jpeg";
import { MdDelete, MdPersonAddAlt1} from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { MdGroupAdd } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { FaRunning } from "react-icons/fa";
import ChatSection, { ConversationChatSection } from "./ChatSection";
import { jwtDecode } from "jwt-decode";
import { Conversations } from "./ConversationList";
import Cookies from 'js-cookie';

import {
  ConversationIthemProps,
  MemberProps,
  MessageProps,
} from "../../../../../../../backend_service/backend/types/chatTypes";
import { UserContext } from "../page";

// const authToken = Cookies.get('access_token');
// console.log("authToken:", authToken);
// const decodedToken = jwtDecode(authToken) as any;

// console.log("decodedToken:", decodedToken);
// export const userId = decodedToken.id;
export const isAdmin = false;

// import { $Enums } from "@prisma/client";
// import { CONVERSATION_TYPE } from "../../../../../../backend_service/backend/types/chatTypes";
// import { CONVERSATION_TYP } from "../../../../../../backend_service/backend/types/chatTypes";

export const ConversationInfo = ({ type }: { type: string }) => {
  const conversationProps = useContext(LstConversationStateContext);

  // handle if the conversationProps is undefined
  // if (conversationProps?.id === undefined) {
  //   return;
  // }
  return (
    <>
      {conversationProps?.type === "DIRECT" ? (
        <ConversationInfoWrapper
          username="username"
          title={conversationProps?.title}
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
                bgColor="bg-transparent border-[#FEFFFF]"
                color="#FC2B5D"
                width="w-full"
                hight="h-11"
              >
                <p className=" text-[#FEFFFF] font-semibold font-poppins text-sm">
                  Edit Channel
                </p>
                <FiEdit color="#FEFFFF" size={24} />
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
                bgColor="bg-[#FC2B5D] border-[#FC2B5D]"
                color="#FC2B5D"
                width="w-full"
                hight="h-11"
              >
                <p className=" text-[#FEFFFF] font-poppins font-medium text-sm">
                  Delete channel
                </p>
                <MdDelete color="#FEFFFF" size={24} />
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
  const conversation = useContext(LstConversationStateContext);
  const [members, setMembers] = useState<MemberProps[]>([]);

  const [isSet, setIsSet] = useState(false);

  useEffect(() => {
    const fetchFun = async () => {
      await fetch(
        `http://localhost:3001/api/channels/getConversationMembers/${conversation?.id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setMembers(data);
          if (data) setIsSet(true);
        });
    };
    if (conversation?.id !== undefined) fetchFun();
  }, [conversation, isSet]);

  // console.log("isSet:", isSet);
  // console.log("members:", members);
  return (
    <>
      <MemberSeparator />
      {isSet &&
        members.map((member) => {
          return (
            <MemberIthem
              imgUrl="some/url"
              name={member.user.username}
              isAdmin={true}
            />
          );
        })}
      {/* <MemberIthem imgUrl="some/url" name="name" isAdmin={true} /> */}
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
  const conversationProps = useContext(LstConversationStateContext);
  return (
    <div className="profileInfo basis-1/4 bg-purple-600 flex flex-col items-center overflow-y-auto overflow-x-hidden pb-12">
      {title !== "" ? (
        <ProfileInfos username={conversationProps?.name}>
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

interface User {
  id: string;
  email: string;
  username: string;
  profilePic?: string;
  hash: string;
  typeLog: string;
  isTwoFactorEnabled: Boolean;
  isConfirmed2Fa: Boolean;
}



const Conversation = () => {


  return (
    <div className="chatNprofile h-full basis-3/4 flex gap-9 px-12 py-24">
      <ConversationChatSection />
      {/* <ChatSection /> */}
      <ConversationInfo type="D"></ConversationInfo>
    </div>
  );
};

export const ConversationListContext = createContext(
  {} as ConversationIthemProps[]
);

export const MessagesContext = createContext({} as MessageProps[]);

export const LstConversationSetStateContext = createContext(
  {} as React.Dispatch<React.SetStateAction<ConversationIthemProps | undefined>>
);
export const LstConversationStateContext = createContext(
  {} as ConversationIthemProps | undefined
);

export const ConversationListContextSet = createContext( {} as React.Dispatch<React.SetStateAction<ConversationIthemProps[]>>);

export const ChatPage = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [ConversationList, setConversationList] = useState< ConversationIthemProps[] >([]);
  const [conversation, setConversation] = useState<ConversationIthemProps>();
  const userInfo = useContext(UserContext) as User;
  // const [lastMessageFrom, setLastMessageFrom] = useState<string[]>([]);
  // const userId = "010a3e90-75db-4df0-9cb1-bb6f8e9a5c60";

  console.log("conversationId:", conversation?.id);
  useEffect(() => {
    const fetchFun = async () => {
      await fetch(
        `http://localhost:3001/api/channels/getUserConversationsIthemList?userId=${userInfo.id}&isAdmin=${isAdmin}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          return res.json();
          // const data: Conversation[];
        })
        .then((data:ConversationIthemProps[]) => {
          setConversationList(data.sort((a, b) => {
            const bDate = new Date(b.updatedAt);
            const aDate = new Date(a.updatedAt);
            return(bDate.getTime() - aDate.getTime())
          }));
        });
    };
    fetchFun();
  }, []);

  useEffect(() => {
    const fetchFun = async () => {
      await fetch(
        `http://localhost:3001/api/channels/conversation/${conversation?.id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setMessages(data);
        })
        .catch((err) => {
          console.log(err);
        });
      // return res;
    };
    fetchFun();
  }, [conversation]);

  return (
    <main className="main flex justify-center items-center h-full w-full ">
      <ConversationListContextSet.Provider value={setConversationList}>
      <ConversationListContext.Provider value={ConversationList}>
        <LstConversationSetStateContext.Provider value={setConversation}>
          <LstConversationStateContext.Provider value={conversation}>
            <div className="h-full basis-1/4 flex">
              <Conversations> {/* <ConversationList /> */}</Conversations>
              {/* <Conversations conversationList={ConversationList} setConversationList={setConversationList}> <ConversationList /></Conversations> */}
            </div>
            <MessagesContext.Provider value={messages}>
              <Conversation />
            </MessagesContext.Provider>
          </LstConversationStateContext.Provider>
        </LstConversationSetStateContext.Provider>
      </ConversationListContext.Provider>
      </ConversationListContextSet.Provider>
    </main>
  );
};

export const CostumeButton = ({
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
  username: string | undefined;
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
