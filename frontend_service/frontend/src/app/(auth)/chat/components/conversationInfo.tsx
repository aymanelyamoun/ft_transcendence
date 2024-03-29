import React, {
  SetStateAction,
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
// import avatar from "../../../../../public/garou-kid.jpeg";
import avatar from "../../../../../public/garou-kid.jpeg";
import { useRouter } from "next/navigation";
import { MdDelete, MdPersonAddAlt1 } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { MdGroupAdd } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { FaRunning } from "react-icons/fa";
import { ConversationChatSection } from "./ChatSection";
import { Conversations } from "./ConversationList";

import {
  ConversationIthemProps,
  MemberProps,
  MessageProps,
} from "@/utils//types/chatTypes";
import { SlOptions } from "react-icons/sl";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { MdArrowForwardIos } from "react-icons/md";
import { SocketContext } from "@/utils/socketContext";
import { GiAstronautHelmet } from "react-icons/gi";
import { FaUserAstronaut } from "react-icons/fa";
import { ChannelInfoProps } from "@/utils/types/chatTypes";
import { UserContext } from "@/utils/createContext";
import { Backend_URL } from "@/lib/Constants";
// import router from "next/router";
import Link from "next/link";
interface Friend {
  id: string;
  username: string;
  profilePic: string;
  title?: string;
  status: string;
}
export const ConversationInfo = ({
  type,
  setRefresh,
  refresh,
}: {
  type: string;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}) => {
  const conversationProps = useContext(LstConversationStateContext);
  const ConversationListData = useContext(ConversationListContext);
  const setEditChannel = useContext(setShowEditChannelContext);
  const setExitChannel = useContext(setShowExitChannelContext);
  const setDeleteChannel = useContext(setShowDeleteChannelContext);
  const setAlertInviteFriend = useContext(setAlertInviteFriendContext);
  const editChannel = useContext(showEditChannelContext);
  const userInfo = useContext(UserContext);
  const lastConversation = useContext(LstConversationStateContext);
  const [isCreator, setIsCreator] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const setShowInviteToChannel = useContext(setInviteFriendToChannelContext);
  // fore invite friend to channel
  const [selectedFriend, setSelectedFriend] = React.useState<Friend | false>(
    false
  );
  // const [goBack, setGoBack] = React.useState<boolean>(false);

  const socket = useContext(SocketContext);

  const [members, setMembers] = useState<MemberProps[]>([]);

  const lastConvId = lastConversation?.id;
  const setConversationList = useContext(LstConversationSetStateContext);

  const handleGoBack = () => {
    const channelType = "D";
    setConversationList(
      (prevConversation: ConversationIthemProps | undefined) => {
        if (prevConversation && prevConversation.id === lastConvId) {
          // setRefresh(true);
          return {
            ...prevConversation,
            type: channelType,
          };
        }
        return prevConversation;
      }
    );
  };

  const router = useRouter();
  const [unauthorized, setUnauthorized] = useState(false);
  useEffect(() => {
    var fetchFailer: boolean = false;
    const fetchFun = async () => {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}channels/getConversationMembers/${lastConversation?.id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error(`${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setMembers(data);
        })
        .catch((error) => {
          if (error.message.includes("403") || error.message.includes("404")) router.push("/unauthorized");
        });
    };

    if (lastConversation?.id !== undefined) {
      fetchFun();
      if (unauthorized) router.push("/unauthorized");
    }
  }, [lastConversation, router, unauthorized]);

  const recieverUserId = members.filter(
    (member) => member.user.id !== userInfo.user?.id
  )[0]?.user.id;
  const recieverUserName = members.filter(
    (member) => member.user.id !== userInfo.user?.id
  )[0]?.user.username;

  const inviteFriend = async () => {
    const fetchFun = async () => {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}request/send/${recieverUserId}`,
        {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          } else {
            setAlertInviteFriend(true);
          }
        })
        .catch((error) => {
        });
    };

    if (lastConversation?.id !== undefined) {
      fetchFun();
    }
  };

  const inviteFriendTochannel = () => {
    setShowInviteToChannel(true);
  };


  const inviteToPlay = () => {
    socket.emit("inviteGame", { id: recieverUserId });
  };
const [isAdmin, setIsAdmin] = useState(false);

  return (
    <>
      {conversationProps?.type === "DIRECT" ? (
        <ConversationInfoWrapper
          name={conversationProps?.name as string}
          title={conversationProps?.title as string}
          imgUrl={conversationProps?.profilePic as string}
        >
          <ButtonInfo width="10" hight="10">
            <div className="flex gap-3 justify-center flex-wrap pr-10 pl-10 mx-12">
              <CostumeButton
                onClick={() => inviteToPlay()}
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
      ) : conversationProps?.type === "CHANNEL_CHAT" ? (
        <ConversationInfoWrapper
          name={conversationProps?.name as string}
          title=""
          imgUrl={conversationProps?.profilePic as string}
        >
          <MemberList
            setIsCreator={setIsCreator}
            setRefresh={setRefresh}
            refresh={refresh}
            setIsAdmin={setIsAdmin}
          />
          {(isCreator && isAdmin) && (
            <ButtonInfo width="10" hight="10">
              <div className="flex min-h-3b max-w-button-max w-40 flex-col justify-between items-center mt-12">
                <CostumeButton
                  onClick={() => {
                    setEditChannel(true);
                  }}
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
                  onClick={() => {
                    setExitChannel(true);
                    handleGoBack();
                  }}
                  bgColor="bg-transparent border-[#FC2B5D]"
                  color="wthie"
                  width="w-full"
                  hight="h-11"
                >
                  <p className=" text-light-red font-semibold font-poppins text-sm">
                    Leave Channel
                  </p>
                  <FaRunning color="#FC2B5D" size={24} />
                </CostumeButton>

                <CostumeButton
                  onClick={() => {
                    setDeleteChannel(true);
                    handleGoBack();
                  }}
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
          )}
          {(!isCreator || (isCreator && !isAdmin) )&& (
            <div className="flex min-h-3b max-w-button-max w-40 flex-col justify-between items-center mt-60">
              <CostumeButton
                onClick={() => {
                  setExitChannel(true);
                  handleGoBack();
                }}
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
          )}
        </ConversationInfoWrapper>
      ) : (
        <div className="profileInfo basis-1/4 flex flex-col items-center overflow-y-auto overflow-x-hidden pb-12 min-w-96 ">
          <div className="mt-10 flex justify-center items-center gap-10 flex-col">
            {/* <GiAstronautHelmet size={120} /> */}
            <FaUserAstronaut
              size={140}
              color="#FEFFFF"
              className="opacity-40"
            />
            <h1 className="font-poppins text-lg text-[#FEFFFF]">
              {" "}
              No Conversation Is Selected{" "}
            </h1>
          </div>
        </div>
      )}
    </>
  );
};


const MemberIthem = ({
  setRefresh,
  imgUrl,
  name,
  isAdmin,
  userId,
}: {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  imgUrl: string;
  name: string;
  isAdmin: boolean;
}) => {
  const [isOptions, setIsOptions] = useState<boolean>(false);
  const [asAdmin, setAsAdmin] = useState<boolean>(isAdmin);
  // const [selectedOption, setSelectedOption] = useState("public");
  const [selectedMuteTime, setSelectedMuteTime] = useState<string>("");

  const conversationProps = useContext(LstConversationStateContext);

  const options = [
    {
      id: 0,
      label: !asAdmin ? "Make As Admin" : "Remove Admin",
      action: !asAdmin ? "makeAsAdmin" : "removeAdmin",
    },
    { id: 1, label: "Mute", subOptions: ["5 min", "30 min", "1 hour"] },
    { id: 2, label: "Kick", action: "kick" },
    { id: 3, label: "Ban", action: "ban" },
  ];

  function addMinutes(date: Date, minutes: number) {
    date.setMinutes(date.getMinutes() + minutes);

    return date;
  }

  const handleSubOptionClick =
    (option: { id: number; label: string; subOptions?: string[] }) =>
    (subOption: string) => {

      if (subOption === "5 min") {
        // fetching the mute time to the backend and set it to the database and then set it to the state of the user in the frontend
        const userData = {
          channelId: conversationProps?.channelId,
          userToMute: userId,
          muteUntil: addMinutes(new Date(), 1),
        };
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "channels/muteUser", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      }
      else if (subOption === "30 min") {
        // fetching the mute time to the backend and set it to the database and then set it to the state of the user in the frontend
        const userData = {
          channelId: conversationProps?.channelId,
          userToMute: userId,
          muteUntil: addMinutes(new Date(), 30),
        };
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "channels/muteUser", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      }
      else if (subOption === "1 hour") {
        // fetching the mute time to the backend and set it to the database and then set it to the state of the user in the frontend
        const userData = {
          channelId: conversationProps?.channelId,
          userToMute: userId,
          muteUntil: addMinutes(new Date(), 60),
        };
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "channels/muteUser", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      }

      // setSelectedMuteTime(subOption);
    };

  const handleOptionClick =
    (option: { id: number; label: string; action?: string }) => () => {
      if (option.action === "makeAsAdmin") {
        setAsAdmin(!asAdmin);
        const userData = {
          channelId: conversationProps?.channelId,
          userId2: userId,
        };
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "channels/addAdmin", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      } else if (option.action === "removeAdmin") {
        setAsAdmin(!asAdmin);
        const userData = {
          channelId: conversationProps?.channelId,
          userId2: userId,
        };
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "channels/removeAdmin", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      } else if (option.action === "ban") {
        const userData = {
          channelId: conversationProps?.channelId,
          userId2: userId,
        };
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "channels/banUser", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Network response was not ok");
            else setRefresh((prev) => !prev);
          })
          .catch((error) => {
          });
      } else if (option.action === "kick") {
        const userData = {
          channelId: conversationProps?.channelId,
          userId2: userId,
        };
        fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL +
            "channels/removeUserFromChannel",
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          }
        )
          .then((res) => {
            if (!res.ok) throw new Error("Network response was not ok");
            else setRefresh((prev) => !prev);
          })
          .catch((error) => {
  
          });
      }
    };


  return (
    <div className="flex justify-between w-full  m-2 items-center relative">
      <div className="flex gap-2 justify-between items-center ">
        <Image
          className="avatar-small ml-[10px]"
          src={imgUrl}
          alt={"avatar"}
          width={40}
          height={40}
        />
        <h3>{name}</h3>
      </div>
      {
        // after adding mute dropdown
        isAdmin && (
          <Menu>
            <Menu.Button className="cursor-pointer left-[95%] absolute">
              <SlOptions
                className=""
                onClick={() => setIsOptions(!isOptions)}
              />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition duration-100 ease-out"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-[#202446] ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                {options.map((option) => (
                  <Menu.Item key={option.id}>
                    {({ active }) => (
                      <div
                        className={`${
                          active
                            ? "bg-[#9A9BD326] text-white rounded-md flex justify-between"
                            : "text-white flex justify-between"
                        } block px-4 py-2 text-sm cursor-pointer`}
                        onClick={handleOptionClick(option)}
                      >
                        {option.label}
                        {option.subOptions && (
                          <Menu as="div" className="relative flex items-center">
                            <Menu.Button className="pl-4 text-white ">
                              <MdArrowForwardIos />
                              {/* <span className="ml-2"> &gt; </span> */}
                            </Menu.Button>
                            <Transition
                              as={Fragment}
                              enter="transition duration-100 ease-out"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition duration-75 ease-out"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="origin-top-right absolute right-0 mr-[127px] mt-[140px] w-36 rounded-md shadow-lg bg-[#202446] ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                {option.subOptions.map((subOption, index) => (
                                  <Menu.Item key={index}>
                                    {({ active }) => (
                                      <div
                                        className={`${
                                          active
                                            ? "bg-[#9A9BD326] text-white rounded-md "
                                            : "text-white "
                                        } block px-4 py-2 text-sm cursor-pointer`}
                                        onClick={() =>
                                          handleSubOptionClick(option)(
                                            subOption
                                          )
                                        }
                                      >
                                        {subOption}
                                      </div>
                                    )}
                                  </Menu.Item>
                                ))}
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        )}
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        )
      }

    </div>
  );
};

const MemberList = ({
  refresh,
  setRefresh,
  setIsCreator,
  setIsAdmin,
}: {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreator: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const conversation = useContext(LstConversationStateContext);
  const [members, setMembers] = useState<MemberProps[]>([]);
  const [membersInfo, setMembersInfo] = useState<ChannelInfoProps>(
    {} as ChannelInfoProps
  );
  const conversationProps = useContext(LstConversationStateContext);
  const userInfo = useContext(UserContext);

  const [isSet, setIsSet] = useState(false);

  
  const router = useRouter();

  const [unauthorized, setUnauthorized] = useState(false);
  useEffect(() => {
    
    const fetchFun = async () => {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}channels/getConversationMembers/${conversation?.id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error(`${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setMembers(data);
          if (data) setIsSet(true);
        })
        .catch((error) => {
          if (error.message.includes("403") || error.message.includes("404")) router.push("/unauthorized");
        });
    };

    const fetchFun2 = async () => {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}channels/channelInfos/${conversationProps?.channelId}`,
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
          setMembersInfo(data);
        });
    };
    if (conversation?.id !== undefined) {
      fetchFun();
      if (unauthorized) router.push("/unauthorized");
      fetchFun2();
    }
  }, [
    conversation,
    isSet,
    conversationProps?.channelId,
    refresh,
    router,
    unauthorized,
  ]);

  const setBlockedUsers = useContext(setBlockedUsersContext);
  const isAdmin = (): boolean => {
    return membersInfo.members?.some(
      (member) => member.userId === userInfo.user?.id && member.isAdmin === true
    );
  };
  if (isAdmin()) {
    setIsAdmin(true);
  }
  else
  {
    setIsAdmin(false);
  }
// }, [membersInfo, userInfo.user?.id]);
  // const isCreator = (): boolean => {
  //   return membersInfo.creator?.id === userInfo.user?.id;
  // };

  // if (isCreator())
  // {
  //   setIsCreator(true);
  // }

  // if (membersInfo.creator?.id === userInfo.user?.id)
  // {
  //   setIsCreator(true);
  // }
  // reason of doing this is setting state (setIsCreator(true)) inside the render method of the MemberList component. cus modifying state during the rendering phase is not recommended in React and can lead to unpredictable behavior.
  useEffect(() => {
    if (membersInfo.creator?.id === userInfo.user?.id) {
      setIsCreator(true);
    }
    else
    {
      setIsCreator(false);
    }
  }, [membersInfo, userInfo.user?.id, setIsCreator]);

  return (
    <>
      <MemberSeparator />
      {isSet &&
        // members.filter((member => member.user.id !== membersInfo.creator?.id)).map((member) => {
        members
          .filter((member) => member.user.id !== userInfo.user?.id)
          .map((member) => {
            return (
              <MemberIthem
                setRefresh={setRefresh}
                imgUrl={member.user.profilePic}
                key={member.user.id}
                name={member.user.username}
                isAdmin={isAdmin()}
                userId={member.user.id}
              />
            );
          })}
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
  name,
  title,
  imgUrl,
  children,
}: {
  name: string;
  title: string;
  imgUrl: string;
  children: React.ReactNode;
}) => {
  const conversationProps = useContext(LstConversationStateContext);
  return (
    <div className="profileInfo basis-1/4 flex flex-col items-center overflow-y-auto overflow-x-hidden pb-12 min-w-96">
      {title !== "" ? (
        <>
        <Link href={`/profile/FriendProfile?username=${name}`}>
        <ProfileInfos name={name} picUrl={imgUrl}>
          <p className="titleInfo">{title}</p>
        </ProfileInfos>
         </Link>
        
        </>
      ) : (
          <ProfileInfos name={name} picUrl={imgUrl}>
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

export interface BlockedUser {
  id: string;
}
[];

const Conversation = ({
  setRefresh,
  refresh,
}: {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}) => {
  return (
    <div className="chatNprofile h-full basis-3/4 flex gap-9 px-12 py-24">
      <ConversationChatSection setRefresh={setRefresh} refresh={refresh} />
      {/* <ChatSection /> */}
      <ConversationInfo
        type="D"
        setRefresh={setRefresh}
        refresh={refresh}
      ></ConversationInfo>
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

export const showEditChannelContext = createContext({} as boolean);
export const setShowEditChannelContext = createContext(
  {} as React.Dispatch<React.SetStateAction<boolean>>
);

export const showExitChannelContext = createContext({} as boolean);
export const setShowExitChannelContext = createContext(
  {} as React.Dispatch<React.SetStateAction<boolean>>
);
export const goBackContext = createContext({} as boolean);
export const setGoBackContext = createContext(
  {} as React.Dispatch<React.SetStateAction<boolean>>
);
export const refreshContext = createContext({} as boolean);
export const setRefreshContext = createContext(
  {} as React.Dispatch<React.SetStateAction<boolean>>
);

export const alertInviteFriendContext = createContext({} as boolean);
export const setAlertInviteFriendContext = createContext(
  {} as React.Dispatch<React.SetStateAction<boolean>>
);

export const inviteFriendToChannelContext = createContext({} as boolean);
export const setInviteFriendToChannelContext = createContext(
  {} as React.Dispatch<React.SetStateAction<boolean>>
);

export const showDeleteChannelContext = createContext({} as boolean);
export const setShowDeleteChannelContext = createContext(
  {} as React.Dispatch<React.SetStateAction<boolean>>
);

export const ConversationListContextSet = createContext({} as any);
export const blockedUsersContext = createContext({} as BlockedUser[]);
export const setBlockedUsersContext = createContext(
  {} as React.Dispatch<React.SetStateAction<BlockedUser[]>>
);

export const ChatPage = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [ConversationList, setConversationList] = useState<
    ConversationIthemProps[]
  >([]);
  const [conversation, setConversation] = useState<ConversationIthemProps>();
  const userInfo = useContext(UserContext);

  const [showEditChannel, setShowEditChannel] = useState<boolean>(false);
  const [showExitChannel, setShowExitChannel] = useState<boolean>(false);
  const [showDeleteChannel, setShowDeleteChannel] = useState<boolean>(false);
  const [showInviteFriend, setShowInviteFriend] = useState<boolean>(false);
  const [showInviteFriendToChannel, setShowInviteFriendToChannel] =
    useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [goBack, setGoBack] = useState<boolean>(false);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchFun = async () => {
      const isAdmin = true; // Replace true with your desired value

      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}channels/getUserConversationsIthemList?userId=${userInfo.user?.id}&isAdmin=${isAdmin}`,
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
          setConversationList(
            data.sort(
              (a: ConversationIthemProps, b: ConversationIthemProps) => {
                const bDate = new Date(b?.updatedAt as Date);
                const aDate = new Date(a?.updatedAt as Date);
                return bDate.getTime() - aDate.getTime();
              }
            )
          );
        });
    };
    fetchFun();
  }, [refresh, userInfo.user?.id]);

  useEffect(() => {
    if (conversation?.id === undefined) return;
    const fetchFun = async () => {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}channels/conversation/${conversation?.id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (!res.ok)
            throw new Error(`${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (data) {
            setMessages(data);
          }
        })
        .catch((err) => {
          // if (err.message.includes("404")) router.push("/unauthorized");
        });
    };
    fetchFun();
  }, [conversation, refresh ]);
  
  return (
    <main className="main flex justify-center items-center h-full w-full ">
      <ConversationListContextSet.Provider value={setConversationList}>
        <ConversationListContext.Provider value={ConversationList}>
          <LstConversationSetStateContext.Provider value={setConversation}>
            <LstConversationStateContext.Provider value={conversation}>
              <setShowEditChannelContext.Provider value={setShowEditChannel}>
                <showEditChannelContext.Provider value={showEditChannel}>
                  <setShowExitChannelContext.Provider
                    value={setShowExitChannel}
                  >
                    <showExitChannelContext.Provider value={showExitChannel}>
                      <setShowDeleteChannelContext.Provider
                        value={setShowDeleteChannel}
                      >
                        <showDeleteChannelContext.Provider
                          value={showDeleteChannel}
                        >
                          <setAlertInviteFriendContext.Provider
                            value={setShowInviteFriend}
                          >
                            <alertInviteFriendContext.Provider
                              value={showInviteFriend}
                            >
                              <setInviteFriendToChannelContext.Provider
                                value={setShowInviteFriendToChannel}
                              >
                                <inviteFriendToChannelContext.Provider
                                  value={showInviteFriendToChannel}
                                >
                                  <setBlockedUsersContext.Provider
                                    value={setBlockedUsers}
                                  >
                                    <setGoBackContext.Provider
                                      value={setGoBack}
                                    >
                                      <goBackContext.Provider value={goBack}>
                                        <refreshContext.Provider
                                          value={refresh}
                                        >
                                          <setRefreshContext.Provider
                                            value={setRefresh}
                                          >
                                            <blockedUsersContext.Provider
                                              value={blockedUsers}
                                            >
                                              <div className="h-full basis-1/4 flex">
                                                <Conversations
                                                  setRefresh={setRefresh}
                                                  refresh={refresh}
                                                >
                                                  {" "}
                                                  {/* <ConversationList /> */}
                                                </Conversations>
                                              </div>
                                              <MessagesContext.Provider
                                                value={messages}
                                              >
                                                <Conversation
                                                  setRefresh={setRefresh}
                                                  refresh={refresh}
                                                />
                                              </MessagesContext.Provider>
                                            </blockedUsersContext.Provider>
                                          </setRefreshContext.Provider>
                                        </refreshContext.Provider>
                                      </goBackContext.Provider>
                                    </setGoBackContext.Provider>
                                  </setBlockedUsersContext.Provider>
                                </inviteFriendToChannelContext.Provider>
                              </setInviteFriendToChannelContext.Provider>
                            </alertInviteFriendContext.Provider>
                          </setAlertInviteFriendContext.Provider>
                        </showDeleteChannelContext.Provider>
                      </setShowDeleteChannelContext.Provider>
                    </showExitChannelContext.Provider>
                  </setShowExitChannelContext.Provider>
                </showEditChannelContext.Provider>
              </setShowEditChannelContext.Provider>
            </LstConversationStateContext.Provider>
          </LstConversationSetStateContext.Provider>
        </ConversationListContext.Provider>
      </ConversationListContextSet.Provider>
    </main>
  );
};

// export const CostumeButton = ({
//   bgColor,
//   color,
//   children,
//   width,
//   hight,
// }: {
//   bgColor: string;
//   color: string;
//   width: string;
//   hight: string;
//   children: React.ReactNode;
// }) => {
//   return (
//     <button
//       className={`flex items-center justify-around ${bgColor} text-[${color}] p-2 ${width} ${hight} rounded-sm border-2`}
//     >
//       {children}
//     </button>
//   );
// };

export const CostumeButton = ({
  onClick,
  bgColor,
  color,
  children,
  width,
  hight,
}: {
  onClick: () => void;
  bgColor: string;
  color: string;
  width: string;
  hight: string;
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
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
  name,
  picUrl,
  children,
}: {
  name: string | undefined;
  picUrl: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <div className="flex flex-col items-center">
        <Image
          className="w-18 h-18 rounded-full mt-[40px] mb-[20px] sm:w-24 sm:h-24 md:w-38 md:h-38 lg:w-40 lg:h-40 xl:w-48 xl:h-48"
          src={picUrl}
          alt={"avatar"}
        />
        <h4 className="nameInfo"> {name} </h4>
        {children}
      </div>
    </>
  );
};
