import React from "react";
import Image from "next/image";
// import sendIcon from '../../../../public/sendButton.png';
import sendIcon from "../../../../public/sendButton.png";
import { KeyboardEvent } from "react";
import { useState } from "react";
import { MessageProps } from "../../../../../../../backend_service/backend/types/chatTypes";

interface TypeMsgProps {
  sendMessage: (message: MessageProps) => void;
}

const TypeMsg = ({ 
    // sendMessage,
     userId, conversationId , messages ,setMessages}:
    {
    // sendMessage:TypeMsgProps,
    userId:string,
    conversationId:string | undefined,
    messages:MessageProps[] ,
    setMessages: React.Dispatch<React.SetStateAction<MessageProps[]>>
}) => {
  let newMessage: MessageProps;
  const [inputValue, setInputValue] = useState<string>("");

  const handleSendMessage = (message: MessageProps) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

const handleSendMsg = () => {
    if (inputValue.trim() !== "") {
            newMessage = {
                    id: "1",
                    message: inputValue,
                    userId: userId,
                    conversationId: conversationId ?? "", // Provide a default value for conversationId
                    createdAt: new Date(),
            };
    // setMessages(newMessage);
        handleSendMessage(newMessage);
        setInputValue("");
    }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClick = () => {
    handleSendMsg();
    setInputValue("");
  };

  const handlePressKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleSendMsg();
      setInputValue("");
    }
  };

  return (
    <div onKeyDown={handlePressKey} className="TypeMsgcontainer flex">
      <input
        value={inputValue}
        type="text"
        onChange={handleInputChange}
        placeholder="Type Something ..."
        className="typeMsg"
      />
      <Image
        onClick={handleClick}
        className="sendIcon"
        src={sendIcon}
        alt="sendIcone"
      />
    </div>
  );
};

export default TypeMsg;
