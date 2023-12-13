import React, { use, useContext } from "react";
import { Conversation } from "../../../../../../backend_service/backend/types/chatTypes";
import { useState, useEffect, createContext } from "react";
import Image from "next/image";
import msg from "../../../../public/msg_icon.png";
import msgs from "../../../../public/msgs_icons.png";
import msg2 from "../../../../public/msg2_icon.png";
import msgs2 from "../../../../public/msgs2_icons.png";
import avatar from "../../../../public/garou-kid.jpeg";

export const IsChannelContext = createContext(false);

const ConversationIthem = (props: Conversation) => {
  // const conversationProps = props;
  const { id, name, profilePic, type, createdAt, channelId, lastMessage } = props;
  // console.log("conversationp:", conversationProps);
  return (
    <>
      <li
        // key={props.id}
        className="friendsItem sm:w-full w-2/3 flex items-center gap-2 rounded-lg my-2 px-3 py-2 cursor-pointer"
      >
        <Image
          className=" w-[49px] h-[49px] rounded-full"
          src={avatar}
          // src={conversationProps.profilePic}
          // alt={conversationProps.name}
          alt={name}
        />
        <p className="friendsName">{name}</p>
      </li>
    </>
  );
};

export const ConversationList = () => {
  const [conversation, setConversation] = useState<Conversation[]>([]);

  const userId = "0e1d8b57-aef4-45e6-9cf8-b834b87d0788";
  const isAdmin = "false";

  useEffect(() => {
    const fetchFun = async () => {
      const res = await fetch(
        `http://localhost:3001/api/channels/getUserConversationsDirect?userId=${userId}&isAdmin=${isAdmin}`,
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
        .then((data) => {
          setConversation(data);
        });
    };
    fetchFun();
  }, []);

  return (
    <div className="friendsScroll overflow-y-auto overflow-x-hidden ">
      <ul className=" flex-col items-center w-full cursor-pointe relative h-full grid gap-y-2">
        {conversation.map((conv) => {
          console.log(conv);
          return (
            <ConversationIthem
              key={conv.id}
              id={conv.id}
              name={conv.name}
              profilePic={conv.profilePic}
              type={conv.type}
              createdAt={conv.createdAt}
              channelId={conv.channelId}
              lastMessage={conv.lastMessage}
            />
          );
        })}
      </ul>
    </div>
  );
};

export const Conversations = ({ children }: { children: React.ReactNode }) => {
  const [isChannel, setIsChannel] = useState<boolean>(false);

  console.log(isChannel);
  return (
    <div>
      <IsChannelContext.Provider value={isChannel}>
        <ChatToggel setIsChannel={setIsChannel} />
        <ConversationList />
        {/* {children} */}
      </IsChannelContext.Provider>
    </div>
  );
};

const ChatButton = ({
  onClick,
  imgUrl,
  imgAlt,
}: {
  onClick: any;
  imgUrl: any;
  imgAlt: string;
}) => {
  return (
    <div>
      <button onClick={onClick} className="mr-[10px] mt-[9px]">
        <Image src={imgUrl} alt={imgAlt} width={24} height={24} />
      </button>
    </div>
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

  return !isChannel ? (
    <div>
      <ChatButton onClick={handleChatClick} imgUrl={msg} imgAlt="msg" />
      <ChatButton onClick={handleChannelClick} imgUrl={msgs2} imgAlt="msgs2" />
    </div>
  ) : (
    <div>
      <ChatButton onClick={handleChatClick} imgUrl={msg2} imgAlt="msg2" />
      <ChatButton onClick={handleChannelClick} imgUrl={msgs} imgAlt="msgs" />
    </div>
  );
};

export default ConversationList;
