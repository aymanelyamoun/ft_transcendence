import React, { use, useContext, useEffect } from "react";
import { ConversationIthemProps } from "@/utils/types/chatTypes";
import { useState, createContext } from "react";
import Image from "next/image";
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2";
import { HiMiniChatBubbleLeft } from "react-icons/hi2";

import {
  ConversationListContext,
  LstConversationSetStateContext,
  LstConversationStateContext,
  alertInviteFriendContext,
  goBackContext,
  inviteFriendToChannelContext,
  refreshContext,
  setAlertInviteFriendContext,
  setGoBackContext,
  setRefreshContext,
  setShowDeleteChannelContext,
  setShowEditChannelContext,
  setShowExitChannelContext,
  showDeleteChannelContext,
  showEditChannelContext,
  showExitChannelContext,
} from "./conversationInfo";

export const IsChannelContext = createContext(false);

// import { AlertMessage } from "./AlertMessage";
import CreateChannel from "./CreateChannel";
import CreateChannelButton from "./CreateChannelButton";
import AddNewChannel from "./AddNewChannel";
import { Friend } from "../page";
import EditChannel from "./EditChannel";
import { AlertMessage } from "./alertMessage";
import { UserContext } from "@/utils/createContext";

// const ConversationIthem = ({props , setRefresh}: {props:ConversationIthemProps, setRefresh:React.Dispatch<React.SetStateAction<boolean>>}) => {
const ConversationIthem = (props : ConversationIthemProps) => {
  const conversationProps = props;
  // const { id, name, profilePic, type, title, createdAt, channelId, lastMessage } = props.props;
  // const { id, name, profilePic, type, createdAt, channelId, lastMessage } =
  const setConversationList = useContext(LstConversationSetStateContext);
  props;

  const isChannel = useContext(IsChannelContext);
  // const setRefresh = useContext(setRefreshContext);
  const refresh = useContext(refreshContext);
  console.log("refresh in conversationIthem: ", refresh);
  //  console.log("conversationProps.Pic: ", conversationProps.profilePic);
  const handleChatClick = () => {
    console.log("conversationProps: WWWWWWW", conversationProps);
    // setRefresh(!refresh);
    setConversationList(conversationProps);
    // conversationProps.setRefresh!((prev) => !prev);
    // setRefresh((prev) => !prev);
    console.log("refresh in conversationIthem 2: ", refresh);
  };

//  const avatar = "frontend_service/frontend/public/garou-kid.jpeg";
// const conversationProps = useContext(LstConversationStateContext);
console.log("conversationProps.name HHHHHHHHHHH: ", conversationProps?.name)
  return (
    <li
      onClick={handleChatClick}
      // key={props.id}
      className="friendsItem sm:w-full w-2/3 flex items-center gap-2 rounded-lg my-2 px-3 py-2 cursor-pointer"
    >
      <Image
        className=" w-[49px] h-[49px] rounded-full"
       // src={avatar}
        // src={`${conversationProps.profilePic !== "some link" ? conversationProps.profilePic : avatar}`}
         src={conversationProps?.profilePic as string}
        // alt={conversationProps.name}
        alt={conversationProps?.name as string}
        width={49}
        height={49}
      />
      <div className="flex flex-col mb-[4%}">
        <p className="friendsName">{conversationProps?.name}</p>
        <p className="text-xs font-thin w-[208.327px] truncate whitespace-nowrap overflow-hidden text-[#FFFFFF]">
          {
            // "tmp message hi Your welcome message should ur welcome message should generally be succinct, fri ur welcome message should generally be succinct, frigur welcome message should generally be succinct, frienerally be succinct, friendly, and informative. It should clearly confirm and clarify what your subscriber signed up for, as well as provide instructions on how they can opt out."
            conversationProps?.lastMessage
          }
        </p>
      </div>
    </li>
  );
};

export const ConversationList = ({
  setRefresh,
  refresh,
  isChannel,
  setIsChannel,
  setShowAddChannel,
}: // rowData,
// conversation,
// setConversation,
{
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  isChannel: boolean;
  setIsChannel: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAddChannel: React.Dispatch<React.SetStateAction<boolean>>;
  // rowData: Conversation[];
  // conversation: ConversationIthemProps[];
  // setConversation: React.Dispatch<
  //   React.SetStateAction<ConversationIthemProps[]>
  // >;
}) => {

  // useEffect(() => {
  //   setIsChannel((prev) => !prev);
  //   setIsChannel((prev) => !prev);
  // }, [refresh]);
  const ConversationListData = useContext(ConversationListContext);
  const channelType = useContext(IsChannelContext);
  console.log("ConversationListData", ConversationListData);
  // const lastConv = useContext(LstConversationStateContext);
  if (!channelType) {
    {
      return (
        <ul className=" flex-col items-center w-full cursor-pointe relative h-full grid gap-y-2">
          {Array.isArray(ConversationListData) &&
            ConversationListData.map((conv) => {
              if (conv.type === "DIRECT") {
                return (
                  <ConversationIthem
                      key={conv.id}
                      id={conv.id}
                      name={conv.name}
                      profilePic={conv.profilePic}
                        type={conv.type}
                        title={conv.title}
                        createdAt={conv.createdAt}
                        channelId={conv.channelId}
                        lastMessage={conv.lastMessage}
                        />
                        );
                      }
                    })}
        </ul>
      );
    }
  }
  return (
    <ul className=" flex-col items-center w-full cursor-pointe relative h-full grid gap-y-2">
      {Array.isArray(ConversationListData) &&
        ConversationListData.map((conv) => {
          if (conv.type === "CHANNEL_CHAT") {
            return (
              <ConversationIthem
              key={conv.id}
              id={conv.id}
              name={conv.name}
              profilePic={conv.profilePic}
              type={conv.type}
              title={conv.title}
              createdAt={conv.createdAt}
              channelId={conv.channelId}
              lastMessage={conv.lastMessage}
              />
            );
          }
        })}
      {isChannel && (
        <CreateChannelButton
          setShowAddChannel={setShowAddChannel}
          setRefresh={setRefresh}
        />
      )}
    </ul>
  );
};

export const Conversations = ({
  setRefresh,
  refresh,
  // conversationList,
  // setConversationList,
  children,
}: {
  refresh: boolean,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  // conversationList: ConversationIthemProps[];
  // setConversationList: React.Dispatch<
  // React.SetStateAction<ConversationIthemProps[]>
  // >;
  children: React.ReactNode;
}) => {
  const [isChannel, setIsChannel] = useState<boolean>(false);
  // states
  const editChannel = useContext(showEditChannelContext);
  const exitChannel = useContext(showExitChannelContext);
  const deleteChannel = useContext(showDeleteChannelContext);
  const inviteFriend = useContext(alertInviteFriendContext);
  const userInfo = useContext(UserContext);

  // setstates
  const setEditChannel = useContext(setShowEditChannelContext);
  const setExitChannel = useContext(setShowExitChannelContext);
  const setDeleteChannel = useContext(setShowDeleteChannelContext);
  const setInviteFriend = useContext(setAlertInviteFriendContext);

  const conversationProps = useContext(LstConversationStateContext);

  // for add friend to channel
  const showInviteFriendToChannel = useContext(inviteFriendToChannelContext);
  const setInviteFriendToChannel = useContext(setAlertInviteFriendContext);

  // const [conversation, setConversation] = useState<ConversationIthemProps[]>(
  //   []
  // );

  // const userId = "010a3e90-75db-4df0-9cb1-bb6f8e9a5c60";
  // const isAdmin = "false";
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [rowData, setRowData] = useState<ConversationIthemProps[]>([]);

  // useEffect(() => {
  //   const fetchFun = async () => {
  //     const res = await fetch(
  //       `http://localhost:3001/api/channels/getUserConversationsIthemList?userId=${userId}&isAdmin=${isAdmin}`,
  //       {
  //         method: "GET",
  //         credentials: "include",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //       .then((res) => {
  //         return res.json();
  //         // const data: Conversation[];
  //       })
  //       .then((data) => {
  //         setRowData(data);
  //         setConversation(data);
  //       });
  //   };
  //   fetchFun();
  // }, []);
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [goToCreateChannel, setGoToCreateChannel] = useState<boolean>(false);
  // const [showCreateChannel, setShowCreateChannel] = useState<boolean>(false);

  // console.log(
  //   "conversationProps.channelId: ----------",
  //   conversationProps?.channelId
  // );
  // console.log("userInfo?.id: ----------", userInfo?.id);

  // const lastConversation = useContext(LstConversationStateContext);
  // const lastConvId = lastConversation?.id;
  // const setConversationList = useContext(LstConversationSetStateContext);
  // console.log("lastConvId: ", lastConvId);
  // console.log("lastConversation: ", lastConversation);

  // const handleGoBack = () => {

  //   const channelType = "D";
  //   setConversationList(
  //     (prevConversation: ConversationIthemProps | undefined) => {
  //       if (prevConversation && prevConversation.id && lastConvId === lastConvId) {
  //         // setRefresh(true);
  //         return {
  //           ...prevConversation,
  //           type: channelType,
  //         };
  //       }
  //       setRefresh((prev) => !prev);
  //       return prevConversation;
  //     }
  //   );
  // }
const setGoBack = useContext(setGoBackContext);
  const handleExitChannel = () => {
    const channelData = {
      channelId: conversationProps?.channelId,
      // userId:  userInfo?.id,
      userId2: "some_random_id",
    };
    // console.log("channelData: ", channelData);
    const fetchFun = async () => {
      await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+"channels/leaveChannel", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(channelData),
      })
        .then((res) => {
          // console.log("res: ", res);
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          else{
            // handleGoBack();
            setExitChannel(false);
            setRefresh((prev) => !prev);
            // setGoBack(true);
          }
        })
        .catch((error) => {
          console.error("Error during fetch:", error);
        });
    };
    fetchFun();
  };

  const handleDeleteChannel = () => {
    const channelData = {
      channelId: conversationProps?.channelId,
      userId2: "some_random_id",
    };
    // console.log("channelData of Delete: ", channelData);
    const fetchFun = async () => {
      await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+"channels/deleteChannel", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(channelData),
      })
        .then((res) => {
          // console.log("res: ", res);
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          else{
            // handleGoBack();
            setRefresh((prev) => !prev);
            setDeleteChannel(false);
            // setGoBack(true);
          }
        })
        .catch((error) => {
          console.error("Error during fetch:", error);
        });
    };
    fetchFun();
  };

  // console.log("refresh in channels : ", setRefres)

  // console.log("goToCreateChannel", goToCreateChannel);

  return (
    <div className="friendList w-full h-full mr-12 relative">
      <IsChannelContext.Provider value={isChannel}>
        <ChatToggel setIsChannel={setIsChannel} />
        <div className="friendsScroll overflow-y-auto overflow-x-hidden ">
          {/* <ul className=" flex-col items-center w-full cursor-pointe relative h-full grid gap-y-2"> */}
          {/* <SearchBar
                  rowData={rowData}
                  // conversation={conversationList}
                  // setConversation={setConversationList}
                  // friendSearch={friendSearch}
                  // setFriendSearch={setFriendSearch}
                  // channelSearch={channelSearch}
                  // setChannelSearch={setChannelSearch}
                /> */}
          <ConversationList
            setRefresh={setRefresh}
            refresh={refresh}
            isChannel={isChannel}
            setIsChannel={setIsChannel}
            setShowAddChannel={setShowAddChannel}
            // conversationListData={conversationList}
            // rowData={rowData}
            // setConversation={setConversationList}
          />
          {/* {isChannel && <CreateChannelButton setShowAddChannel={setShowAddChannel}/>} */}

          {showAddChannel && (
            <AddNewChannel
              setShowAddChannel={setShowAddChannel}
              setGoToCreateChannel={setGoToCreateChannel}
              selectedFriends={selectedFriends}
              setSelectedFriends={setSelectedFriends}
            />
          )}
          {goToCreateChannel && (
            <CreateChannel
              selectedFriends={selectedFriends}
              setSelectedFriends={setSelectedFriends}
              setChannelCreated={setGoToCreateChannel}
              setRefresh={setRefresh}
            />
          )}
          {editChannel && <EditChannel setEditChannel={setEditChannel} setRefresh={setRefresh} />}
          {exitChannel && (
            <AlertMessage
              onClick={handleExitChannel}
              message={`are you sure you want to exit ${conversationProps?.name} you can no longer send or see messages in this group .`}
              type={"exit"}
            />
          )}
          {deleteChannel && (
            <AlertMessage
              onClick={handleDeleteChannel}
              message={`are you sure you want to delete ${conversationProps?.name}, all the messages will be lost .`}
              type={"delete"}
            />
          )}
          {
            inviteFriend && (
              <AlertMessage
                onClick={() => setInviteFriend(false)}
                message={`you sent an invite request to ${conversationProps?.name} .`}
                type={"notify"}
              />
            )
          }
          {/* {
            showInviteFriendToChannel && (
              <ShowGroups
              parentType="AddUser"
              onClose={() => setInviteFriendToChannel(false)}/>
            )
          } */}

          {/* {children} */}
          {/* </ul> */}
        </div>
      </IsChannelContext.Provider>
    </div>
  );
};

const ChatButton = ({
  onClick,
  children,
}: {
  onClick: any;
  children: React.ReactNode;
}) => {
  return (
    <>
      <button onClick={onClick}>
        {children}
        {/* <Image src={imgUrl} alt={imgAlt} width={width} height={hight} /> */}
      </button>
    </>
  );
};

export const ChatToggel = ({
  setIsChannel,
}: {
  setIsChannel: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const isChannel = useContext(IsChannelContext);

  const handleChatClick = () => {
    setIsChannel(false);
  };

  const handleChannelClick = () => {
    setIsChannel(true);
  };
  ``;

  return !isChannel ? (
    // add space-evenly using tailwindcss
    <div className="msgs flex justify-evenly">
      <ChatButton onClick={handleChatClick}>
        <HiMiniChatBubbleLeft size={22} color={`white`} />
      </ChatButton>

      {/* <Image className="" src={splitBar} alt="splitBar" height={5} width={1}></Image> */}
      <div className="w-[1px] h-[20px] bg-white"></div>

      <ChatButton onClick={handleChannelClick}>
        <HiMiniChatBubbleLeftRight
          size={22}
          color={`rgba(154, 155, 211, 0.5)`}
        />
      </ChatButton>
    </div>
  ) : (
    <div className="msgs flex justify-evenly">
      <ChatButton onClick={handleChatClick}>
        <HiMiniChatBubbleLeft size={22} color={`rgba(154, 155, 211, 0.5)`} />
      </ChatButton>

      <div className="w-[1px] h-[20px] bg-white"></div>
      {/* <Image className="" src={splitBar} alt="splitBar" width={1} height={5}></Image> */}

      <ChatButton onClick={handleChannelClick}>
        <HiMiniChatBubbleLeftRight size={22} color={`white`} />
      </ChatButton>
    </div>
  );
};

export default ConversationList;
