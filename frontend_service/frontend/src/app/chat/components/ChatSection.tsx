import React, { useContext } from "react";
import TypeMsg from "./TypeMsg";
import { useState, useEffect, useRef } from "react";
import {
  LstConversationStateContext,
  MessagesContext,
} from "./ConversationInfo";
import { MessageProps } from "../../../../../../backend_service/backend/types/chatTypes";

const ChatSection = () => {
  const messagesData = useContext(MessagesContext);
  const conversation = useContext(LstConversationStateContext);
  const [messages, setMessages] = useState<MessageProps[]>([])

  // const handleSendMessage = (message: MessageProps) => {
  //   setMessages((prevMessages) => [...prevMessages, message]);
  // };

  useEffect(() => {
    setMessages(messagesData);
  }, [messagesData]);


  const userId = "04b357c8-ba9f-4198-b434-7d2f4a74e4a0";
  console.log("messages:", messages);
  console.log("messagesData:", messagesData);
  return (
    <div className="chatSection flex-grow flex flex-col justify-between">
      <div className="message flex flex-col overflow-y-auto overflow-x-hidden pr-12">
        {messages
          .map((message, index) => (
            <div>
              {<li className="rcvMsg"> ok thank you !</li>}
              <li className="sendMsg" key={index}>
                {" "}
                {message.message}{" "}
              </li>
            </div>
          ))
          .reverse()}
      </div>
      <TypeMsg
        userId={userId}
        conversationId={conversation?.id}
        // sendMessage={handleSendMessage}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
};
export default ChatSection;
