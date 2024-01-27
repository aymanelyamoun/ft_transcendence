import React, { use } from "react";
import { useEffect, useState, useRef } from "react";
import chooseFriendIcon from "../../../../../public/chooseFriendIcon.png";
import notchoosenFriendIcon from "../../../../../public/notChoosenFriendIcon.png";
import removeFriends from "../../../../../public/removeFriends_Icon.png";
// import { Friend, friendsData } from "../page";
// import chooseFriendIcon from "../../../../public/chooseFriendIcon.png";
// import notchoosenFriendIcon from "../../../../public/notChoosenFriendIcon.png";
// import removeFriends from "../../../../public/removeFriends_Icon.png";
// import { Friend, friendsData } from "../../../../app/(notRoot)/chat/page";
import Image from "next/image";

import AddChannelSearchBar from "./AddChannelSearchBar";
import { channel } from "diagnostics_channel";

import avatar from "../../../../../public/garou-kid.jpeg";
import { Friend} from "../page";

const AddNewChannel = ({
  setShowAddChannel,
  setGoToCreateChannel,
  selectedFriends,
  setSelectedFriends,
}: {
  setShowAddChannel: React.Dispatch<React.SetStateAction<boolean>>;
  setGoToCreateChannel: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFriends: Friend[];
  setSelectedFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
}) => {
  const activeChat = useRef<"friend" | "channel">("friend");

  const [channelFriends, setChannelFriends] =
    useState<Friend[]>([]);
    // const [showAddChannel, setShowAddChannel] = useState(false);
    const [addChannelSearch, setAddChannelSearch] = useState<boolean>(false);
    // const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
    const cancelAddChannel = useRef<HTMLDivElement>(null);
    const [ChannelFriendSearch, setChannelFriendSearch] = useState<Friend[]>([]);
    
    // to store friends list to reuse it in search bar if it nothisg is written in the search bar
    // const [rowData, setRowData] = useState<Friend[]>([]);
    
    // const goToCreateChannel = useRef<boolean>(false);
    
  useEffect(() => {
    const fetchFriendsListData = async () => {
      fetch(process.env.NEXT_PUBLIC_BACKEND_URL+"user/friends", {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setChannelFriends(data);
        // setRowData(data);
      });
    };
    fetchFriendsListData();
  }, []);
  
  // console.log("channelFriends : ", channelFriends);
  const handleSelectFriend = (friend: Friend) => {
    if (selectedFriends.includes(friend)) {
      setSelectedFriends(
        selectedFriends.filter(
          (selectedFriend) => selectedFriend.id !== friend.id
        )
      );
      return;
    }
    setSelectedFriends([...selectedFriends, friend]);
  };

  const handleCancelAddChannel = (event: any) => {
    if (
      cancelAddChannel.current &&
      !cancelAddChannel.current.contains(event.target)
    ) {
      setShowAddChannel(false);
    }
  };

  return (
    <div
      onClick={handleCancelAddChannel}
      className=" addChannelOverlay flex justify-center items-center "
    >
      <div
        ref={cancelAddChannel}
        id="AddchannelContainer"
        className="addChannelModal felx justify-between rounded-[10px] "
      >
        <div className=" px-4 pt-4">
          <div className="flex justify-between relative h-[73px] items-center">
            {selectedFriends.length > 0 && (
              <div
                className={`bgk scrollbar w-fit ${
                  !addChannelSearch ? "max-w-[62%]" : "max-w-[25%]"
                } flex gap-4 mb-[10px] p-2 rounded-[10px] overflow-x-scroll overflow-y-hidden`}
              >
                {selectedFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex-shrink-0 relative w-[45px] h-[45px] items-center justify-center"
                  >
                    <button
                      className="absolute right-0"
                      onClick={() => handleSelectFriend(friend)}
                    >
                      <Image
                        src={removeFriends}
                        alt="removeFriends"
                        width={15}
                        height={15}
                      />
                    </button>
                    <Image
                      className="rounded-full"
                      // src={friend.profilePic}
                      src={avatar}
                      alt={friend.username}
                      height={45}
                      width={45}
                    />
                  </div>
                ))}
              </div>
            )}
            <AddChannelSearchBar
              addChannelSearch={addChannelSearch}
              setAddChannelSearch={setAddChannelSearch}
              setChannelFriendSearch={setChannelFriendSearch}
              friendsList={channelFriends}
            />
          </div>
          <div className="scrollbar rounded-t-[10px] h-[458px] overflow-y-auto ">
            {channelFriends.map((friend) => (
              <li
                onClick={() => handleSelectFriend(friend)}
                key={friend.id}
                className="listInaddChannel relative sm:w-full w-2/3 flex items-center gap-2 rounded-lg my-2 px-3 py-2 cursor-pointer"
              >
                <Image
                  className=" w-[45px] h-[45px] rounded-full"
                  src={avatar}
                  alt={friend.username}
                />
                <p className="friendsName">{friend.username}</p>
                <Image
                  src={
                    selectedFriends.includes(friend)
                      ? chooseFriendIcon
                      : notchoosenFriendIcon
                  }
                  alt=""
                  className="shooseFriend"
                />
              </li>
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            setGoToCreateChannel(true);
            setShowAddChannel(false);
          }}
          className="next w-[526px] h-[73px] bg-[#9A9BD3] rounded-b-[10px]"
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default AddNewChannel;
