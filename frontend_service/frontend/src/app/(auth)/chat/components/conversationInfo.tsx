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
import { Backend_URL } from '@/lib/Constants';
// export const userId = "0ff6efbc-78ff-4054-b36f-e517d19f7103";
// export const isAdmin = false;

// import { $Enums } from "@prisma/client";
// import { CONVERSATION_TYPE } from "../../../../../../backend_service/backend/types/chatTypes";
// import { CONVERSATION_TYP } from "../../../../../../backend_service/backend/types/chatTypes";
interface Friend {
  id: string;
  username: string;
  profilePic: string;
  title? : string;
  status: string;
}
export const ConversationInfo = ({ type , setRefresh, refresh}: { type: string, setRefresh:React.Dispatch<React.SetStateAction<boolean>>, refresh:boolean}) => {
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
  const [selectedFriend, setSelectedFriend] = React.useState<Friend | false>(false);
  // const [goBack, setGoBack] = React.useState<boolean>(false);

  const socket = useContext(SocketContext);


  const [members, setMembers] = useState<MemberProps[]>([]);
  // handle if the conversationProps is undefined
  // if (conversationProps?.id === undefined) {
  //   return;
  // }

  // const handleExitChannel = () => {
  //   setExitChannel(true);
  //   const channelData = {
  //     channelId: conversationProps.channelId,
  //     userId:  userInfo?.id,
  //     // here i should add the selected friends
  //   };
  //     const fetchFun = async () => {
  //       await fetch(
  //         `http://localhost:3001/api/channels/leaveChannel`,
  //         {
  //           method: "PATCH",
  //           mode: "cors",
  //           credentials: "include",
  //           headers: {
  //             "Content-Type": "application/json",
  //             "Access-Control-Allow-Origin": "*",
  //           },
  //           body: JSON.stringify(channelData),
  //         }
  //       )
  //       .then((res) => {
  //         if (!res.ok) {
  //           throw new Error("Network response was not ok");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error during fetch:", error);
  //       });
  //     };
  //     fetchFun();
  
  // }
  
  
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
          // setRefresh((prev) => !prev);
          return prevConversation;
        }
        );
      };
      
      // const goBack = useContext(goBackContext);
  //     // if (goBack)
      // {
      //   handleGoBack();
      //   return;
      // }
    
    useEffect(() => {
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
            return res.json();
          })
          .then((data) => {
            setMembers(data);
            // setMembers((prev) => { return [...prev, data] })
            // console.log("Members data: 2", data);
            // console.log("hereeeeeeeeeee");
            // if (data) setIsSet(true);
          });
        };
        // console.log("Members data:", data);
        
        if (lastConversation?.id !== undefined) {
          // if (lastConversation?.type === "DIRECT" || lastConversation?.type === "CHANNEL_CHAT")
          // {
            fetchFun();
          // }
        }
      },[lastConversation]);
      
    // lastConversation?.
    const recieverUserId = members.filter((member) => member.user.id !== userInfo.user?.id)[0]?.user.id;
    const recieverUserName = members.filter((member) => member.user.id !== userInfo.user?.id)[0]?.user.username;
    
    // const inviteFriend = () => {
    const inviteFriend = async () => {
      // console.log("invite friend");
      // useEffect(() => {
        // const fetchFun = async () => {
        const fetchFun = async () => {
          await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}request/send/${recieverUserId}`, {
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
            }
            else {
              // setRequestSent(true);
              setAlertInviteFriend(true);
              // alert("the request has been sent");
            }
          }
          )
          .catch((error) => {
            console.error("Error during fetch:", error);
          });
        }   
  
        if (lastConversation?.id !== undefined) {
          fetchFun();
        }
      // }, [lastConversation]);
    }

    const inviteFriendTochannel = () => {
      // console.log("add friends to channel");
      setShowInviteToChannel(true);
    }
  //   console.log("recieverUserId :", recieverUserId);
    
  // console.log("***************ConversationListData :", ConversationListData);
  // console.log("***************userInfo?.username :", userInfo?.username);
  // console.log("***************userInfo?.id :", userInfo?.id);
  // console.log("***************members :", members);

  // console.log("last conversation data :", lastConversation);
  const inviteToPlay = () => {
    // console.log('inviting this man', recieverUserName, 'to play whose id is', recieverUserId)
    // socket.emit("inviteGame", {id: lastConversation?.id})
    socket.emit("inviteGame", {id: recieverUserId})
  };

  // console.log(
  //   "conversationProps?.type ;;;;;;;;;;;;;;;;;;;;:",
  //   conversationProps?.type
  // );
  // if (goBack)
  // {
  //   setIsCreator(false);
  // }
  // const [isSet, setIsSet] = useState(false);
  // const setGoBack = useContext(setGoBackContext);
  // if (conversationProps?.type === "CHANNEL_CHAT")
  // {
  //   setGoBack(false);
  // }
  // const [types, setTypes] = useState<string>("");
  // const setGoBack = useContext(setGoBackContext);
  // let typesSelected = "";
  // if (goBack)
  // {
  //   typesSelected = "D";
  //   // setGoBack(false);
  // }
  // else
  // {
  //   if (conversationProps?.type === "DIRECT") {
  //     typesSelected = "DIRECT";
  //     console.log("direct");
  //   }
  //   else if (conversationProps?.type === "CHANNEL_CHAT") {
  //     typesSelected = "CHANNEL_CHAT";
  //     console.log("channel");
  //   }
  //   else {
  //     typesSelected = "D";
  //   }
  // }
  // console.log("typesSelected :", typesSelected);
  console.log("typesSelected :", conversationProps?.type);
  // else
  //   typesSelected = conversationProps?.type as string;

  return (
    <>
      {/* {typesSelected === "DIRECT" ? ( */}
      { conversationProps?.type === "DIRECT" ? (
        <ConversationInfoWrapper
          name={conversationProps?.name as string}
          title={conversationProps?.title as string}
          imgUrl={conversationProps?.profilePic as string}
        >
          <ButtonInfo width="10" hight="10">
            <div className="flex gap-3 justify-center flex-wrap pr-10 pl-10 mx-12">
              <CostumeButton
                onClick={() => inviteFriend()}
                bgColor="bg-white-blue border-[#FEFFFF]"
                color="white"
                width="w-20"
                hight="h-11"
              >
                <MdPersonAddAlt1 color="#1C2041" size={24} />
              </CostumeButton>

              <CostumeButton
                onClick={() => inviteFriendTochannel()}
                bgColor="bg-white-blue border-[#FEFFFF]"
                color="white"
                width="w-20"
                hight="h-11"
              >
                <MdGroupAdd color="#1C2041" size={24} />
              </CostumeButton>

              <CostumeButton
                onClick={() => inviteToPlay()}
                bgColor="bg-white-blue border-[#FEFFFF]"
                color="white"
                width="w-44"
                hight="h-11"
              >
                <IoGameController color="#1C2041" size={24}/>
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
          <MemberList setIsCreator={setIsCreator} setRefresh={setRefresh} refresh={refresh}/>
          {isCreator && (
            <ButtonInfo width="10" hight="10">
              <div className="flex min-h-3b max-w-button-max w-40 flex-col justify-between items-center mt-12">
                <CostumeButton
                  onClick={() => {setEditChannel(true);}}
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
                  onClick={() => {setExitChannel(true); handleGoBack();}}
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
                  onClick={() => {setDeleteChannel(true); handleGoBack();}}
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
          {!isCreator && (
            <div className="flex min-h-3b max-w-button-max w-40 flex-col justify-between items-center mt-60">
              <CostumeButton
                onClick={() => {setExitChannel(true); handleGoBack();}}
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
    ) :
    (
        <div className="profileInfo basis-1/4 flex flex-col items-center overflow-y-auto overflow-x-hidden pb-12 min-w-96 ">
          <div className="mt-10 flex justify-center items-center gap-10 flex-col">
            {/* <GiAstronautHelmet size={120} /> */}
            <FaUserAstronaut size={140} color='#FEFFFF' className="opacity-40" />
            <h1 className="font-poppins text-lg text-[#FEFFFF]">
              {" "}
              No Conversation Is Selected{" "}
            </h1>
          </div>
        </div>
      )
    }
    </>
  );
};

// {
//   typesSelected === "D" && 
//   (
//     <div className="profileInfo basis-1/4 flex flex-col items-center overflow-y-auto overflow-x-hidden pb-12 min-w-96 ">
//       <div className="mt-10 flex justify-center items-center gap-10 flex-col">
//         {/* <GiAstronautHelmet size={120} /> */}
//         <FaUserAstronaut size={140} color='#FEFFFF' className="opacity-40" />
//         <h1 className="font-poppins text-lg text-[#FEFFFF]">
//           {" "}
//           No Conversation Is Selected{" "}
//         </h1>
//       </div>
//     </div>
//   )

// } 
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
  // console.log("before isAdmin:", isAdmin);
  const [asAdmin, setAsAdmin] = useState<boolean>(isAdmin);
  // const [selectedOption, setSelectedOption] = useState("public");
  const [selectedMuteTime, setSelectedMuteTime] = useState<string>("");

  const conversationProps = useContext(LstConversationStateContext);
  // const userInfo = useContext(UserContext);

  // const [isAdmine, setIsAdmine] = useState(isAdmin);
  // console.log("isAdmin:", isAdmin);
  // console.log("asAdmin:", asAdmin);
  // console.log("userId:", userId);
  const options = [
    {
      id: 0,
      label: !asAdmin ? "Make As Admin" : "Remove Admin",
      action: !asAdmin ? "makeAsAdmin" : "removeAdmin",
    },
    { id: 1, label: "Mute", subOptions: ["5 min", "30 min", "1 hour"] },
    { id: 2, label: "Kick", action: "kick" },
    { id: 3, label: "Ban", action: "ban" },
    {
      id: 4,
      label: !asAdmin ? "Block" : "Unblock",
      action: !asAdmin ? "blockUser" : "UnBlockUser",
    },
  ];

  const userOptions = [
    {
      id: 0,
      label: !asAdmin ? "Block" : "Unblock",
      action: !asAdmin ? "blockUser" : "UnBlockUser",
    },
  ];

  // const handleSubOptionClick =
  //   (option: { id: number; label: string; subOptions?: string[] }) => () => {
  //     console.log("clicked :", option);
  //     // setSelectedMuteTime(option.label);
  //     // console.log("selectedMuteTime:", selectedMuteTime);
  //     // setSelectedOption(option.label);
  //   };
  function addMinutes(date: Date, minutes: number) {
    date.setMinutes(date.getMinutes() + minutes);

    return date;
  }

  const handleSubOptionClick =
    (option: { id: number; label: string; subOptions?: string[] }) =>
    (subOption: string) => {
      // console.log(`You clicked "${subOption}"`);

      if (subOption === "5 min") {
        // fetching the mute time to the backend and set it to the database and then set it to the state of the user in the frontend
        const userData = {
          channelId: conversationProps?.channelId,
          userToMute: userId, 
          muteUntil: addMinutes(new Date(), 1),
        };
        console.log("userData Mute :", userData);
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL+"channels/muteUser", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      }
      // else if (subOption === "30 min") {
      //   // fetching the mute time to the backend and set it to the database and then set it to the state of the user in the frontend
      // }
      // else if (subOption === "1 hour") {
      //   // fetching the mute time to the backend and set it to the database and then set it to the state of the user in the frontend
      // }

      // setSelectedMuteTime(subOption);
    };

  const handleOptionClick =
    (option: { id: number; label: string; action?: string }) => () => {

      console.log("clicked", option);
      if (option.action === "makeAsAdmin") {
        setAsAdmin(!asAdmin);
        // console.log("isAdmin:", asAdmin);
        const userData = {
          channelId: conversationProps?.channelId,
          userId2: userId,
        };
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL+"channels/addAdmin", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      } else if (option.action === "removeAdmin") {
        setAsAdmin(!asAdmin);
        // console.log("isAdmin:", asAdmin);
        const userData = {
          channelId: conversationProps?.channelId,
          userId2: userId,
        };
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL+"channels/removeAdmin", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      } else if (option.action === "ban") {
        // console.log("BANNING A USER");
        const userData = {
          channelId: conversationProps?.channelId,
          userId2: userId,
        };
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL+"channels/banUser", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }).then((res) => {
          if (!res.ok)
            throw new Error("Network response was not ok");
          else
            setRefresh((prev) => !prev);
        }).catch((error) => {
          console.error("Error during fetch:", error);
        });
      } else if (option.action === "kick") {
        // console.log("KICKING A USER");
        const userData = {
          channelId: conversationProps?.channelId,
          userId2: userId,
        };
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL+"channels/removeUserFromChannel", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })
        .then((res) => {
          if (!res.ok)
            throw new Error("Network response was not ok");
          else
            setRefresh((prev) => !prev);
        }).catch((error) => {
          console.error("Error during fetch:", error);
        } );
      }
      // setSelectedOption(option.label);
    };
  
    // console.log("imgUrl 2222", imgUrl);
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
      {
        !isAdmin && (
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
                {userOptions.map((option) => (
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
}: {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreator: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const conversation = useContext(LstConversationStateContext);
  const [members, setMembers] = useState<MemberProps[]>([]);
  const [membersInfo, setMembersInfo] = useState<ChannelInfoProps>(
    {} as ChannelInfoProps
  );
  const conversationProps = useContext(LstConversationStateContext);
  const userInfo = useContext(UserContext);

  const [isSet, setIsSet] = useState(false);
  // const refresh = use / real time

  // const userData = {
  //   channelId: conversation?.id,
  //   userId2: "381512f8-e314-490f-8c5e-a624dc5cee49",
  // };

  // fetch("http://localhost:3001/api/channels/addAdmin", {
  //   method: "PATCH",
  //   credentials: "include",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(userData),
  // })
  //   .then((res) => {
  //     return res.json();
  //   })
  //   .then((data) => {
      // console.log("data admin:", data);
  //   });
// const refresh = useContext(RefreshContext);
// const refresh = useContext(refreshContext);
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
          return res.json();
        })
        .then((data) => {
          setMembers(data);
          // setMembers((prev) => { return [...prev, data] })
          // console.log("Members data:", data);
          // console.log("hereeeeeeeeeee");
          if (data) setIsSet(true);
        });
    };
    // console.log("Members data:", data);

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
          // setMembers((prev) => { return [...prev, data] })
          // console.log("channels info data:", data);
          // if (data) setIsSet(true);
        });
    };
    if (conversation?.id !== undefined) {
      fetchFun();
      fetchFun2();
    }
  }, [conversation, isSet, conversationProps?.channelId, refresh]);

  // useEffect(() => {

  // }, []);
  
  const setBlockedUsers = useContext(setBlockedUsersContext);

  const isAdmin = (): boolean => {
    return membersInfo.members?.some(
      (member) => member.userId === userInfo.user?.id && member.isAdmin === true
    );
  };
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
  }, [membersInfo, userInfo.user?.id, setIsCreator]);

  // console.log("membersInfo:", membersInfo);
  // console.log("userInfo?.id:", userInfo.user?.id);
  // console.log("userInfo?.name:", userInfo.user?.username);
  // console.log("isSet:", isSet);
  // console.log("members:", members);
  return (
    <>
      <MemberSeparator />
      {isSet &&
        // members.filter((member => member.user.id !== membersInfo.creator?.id)).map((member) => {
        members.filter((member => member.user.id !== userInfo.user?.id)).map((member) => {
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
      {/* <BanedMemberSeparator /> */}
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

// const BanedMemberSeparator = () => {
//   return (
//     <div className="flex w-full justify-between mt-8 font-poppins font-light items-center">
//       <div className="border-b-2 border-light-purple min-w-3 w-1/4 mt-2 mb-2"></div>
//       <h3 className="text-light-purple">Baned Members</h3>
//       <div className="border-b-2 border-light-purple min-w-3 w-1/4 mt-2 mb-2"></div>
//     </div>
//   );
// };

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
  // console.log("name ----------------------- :", name);
  // console.log("hyyyyyyyyyyyyy:", imgUrl);
  return (
    <div className="profileInfo basis-1/4 flex flex-col items-center overflow-y-auto overflow-x-hidden pb-12 min-w-96">
      {title !== "" ? (
        <ProfileInfos name={name} picUrl={imgUrl}>
          {/* {" "} */}
          <p className="titleInfo">{title}</p>
          {/* {" "} */}
        </ProfileInfos>
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

export interface BlockedUser{
  id: string;
}[]

const Conversation = ({setRefresh, refresh} : {setRefresh:React.Dispatch<React.SetStateAction<boolean>>, refresh:boolean}) => {
  return (
    <div className="chatNprofile h-full basis-3/4 flex gap-9 px-12 py-24">
      <ConversationChatSection setRefresh={setRefresh} refresh={refresh}/>
      {/* <ChatSection /> */}
      <ConversationInfo type="D" setRefresh={setRefresh} refresh={refresh}></ConversationInfo>
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

export const ConversationListContextSet = createContext(
  {} as any
);
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
  // const [lastMessageFrom, setLastMessageFrom] = useState<string[]>([]);
  // const userId = "010a3e90-75db-4df0-9cb1-bb6f8e9a5c60";

  const [showEditChannel, setShowEditChannel] = useState<boolean>(false);
  const [showExitChannel, setShowExitChannel] = useState<boolean>(false);
  const [showDeleteChannel, setShowDeleteChannel] = useState<boolean>(false);
  const [showInviteFriend, setShowInviteFriend] = useState<boolean>(false);
  const [showInviteFriendToChannel, setShowInviteFriendToChannel] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [goBack, setGoBack] = useState<boolean>(false);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  // console.log("conversationId:", conversation?.id);

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
          // console.log("channelsHHHH:", data);
          setConversationList(
            data.sort((a: ConversationIthemProps, b :ConversationIthemProps) => {
              const bDate = new Date(b?.updatedAt as Date);
              const aDate = new Date(a?.updatedAt as Date);
              return bDate.getTime() - aDate.getTime();
            })
            // data
            );
            // setGoBack(false);
          });
        };
        fetchFun();
  }, [refresh, userInfo.user?.id]);
      

  useEffect(() => {
    // console.log("conversation?.id:", conversation?.id);
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
          return res.json();
        })
        .then((data) => {
          // console.log("MESSAGESSSS data:", data);
          if (data) 
          {
            // setMessages(data.reverse());
            setMessages(data);
            console.log('fetched and reversed')
          }
        })
        .catch((err) => {
          // console.log(err);
        });
        // return res;
      };
      fetchFun();
    }, [conversation]);
    console.log("messages:   TTT", messages);
    
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
                                          <setGoBackContext.Provider value={setGoBack}>
                                            <goBackContext.Provider value={goBack}>
                                              <refreshContext.Provider value={refresh}>
                                                <setRefreshContext.Provider value={setRefresh}>
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
                                                {/* <Conversations conversationList={ConversationList} setConversationList={setConversationList}> <ConversationList /></Conversations> */}
                                              </div>
                                                  <MessagesContext.Provider value={messages}>
                                                    <Conversation setRefresh={setRefresh} refresh={refresh}/>
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

  // console.log("name------------ :", name);
  // console.log("picUrl------------ :", picUrl);
  return (
    <div className="flex flex-col items-center">
        <Image className="w-18 h-18 rounded-full mt-[40px] mb-[20px] sm:w-24 sm:h-24 md:w-38 md:h-38 lg:w-40 lg:h-40 xl:w-48 xl:h-48" src={picUrl} alt={"avatar"}/>
      {/* <img className="avatar w-20 h-20 object-cover rounded-full sm:w-24 sm:h-24 md:w-38 md:h-38 lg:w-40 lg:h-40 xl:w-48 xl:h-48" src={picUrl} alt="avatar"/> */}
      <h4 className="nameInfo"> {name} </h4>
      {children}
    </div>
  );
};
