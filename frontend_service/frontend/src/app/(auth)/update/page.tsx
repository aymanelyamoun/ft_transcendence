'use client'
import { Backend_URL } from '@/lib/Constants';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { IoSettingsOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Loading from "../../components/Loading";
import Authorization from '@/utils/auth';
import { AlertMessage } from '@/app/components/alertMessage';


let data : any
var notify : string

export default function page() {
  const [isError, setIsError] = useState<boolean>(false);
  const [isNotify, setIsNotify] = useState<boolean>(false);
  const handleClick = () => {
    setIsError(false);
    setIsNotify(false);
  }


  const [isUsernameVisible, setIsUsernameVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isTofaVisible, setIsTofaVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isToggleChecked, setIsToggleChecked] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  // const [notify, setNotify] = useState<string | null>(null);
  const [codeTwoFa, setCodeTwoFa] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const router = useRouter();

  const handleToggleClick = () => {
      setIsChecked(!isChecked);
      setIsDisabled(!isDisabled);
  };    
    
    const gradientStyle = {
        background:
        "linear-gradient(170deg, rgba(255, 255, 255, 0.00) -50.22%, #040924 -9.3%, #111534 -1.17%, rgba(68, 71, 111, 0.96) 83.26%, rgba(154, 155, 211, 0.90) 136.85%)",
    };
  
    interface UserData {
      username: string;
      profilePic: string;
      hash: string;
      typeLog: string;
      isTwoFactorEnabled: Boolean
    }
  
  interface UserPass {
    oldPass: string;
    newPass: string;
    confirmPass: string;
  }

  const [userPass, setUserPass] = useState<UserPass | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const res = await fetch(Backend_URL + "auth/check", {
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
          if (res.ok) {
            setAuthenticated(true);
            const data = await res.json();
            setUserData(data);
           setIsToggleChecked(data.isTwoFactorEnabled);
          } else {
           // router.push("/");
            setAuthenticated(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }, []);
  
  
const handlePicUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const profilePic = reader.result as string;
        const response = await fetch(Backend_URL + "user/update/image", {
          method: "PATCH",
          mode: "cors",
          credentials: "include",
          body: JSON.stringify({ pic: profilePic }),
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
        data = await response.json();
        if (response.ok) {
          notify = "Your new profile picture has been successfully updated"
          setUserData(data.newupdat);
          setIsNotify(true);
        } else {
          setIsError(true);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error updating image:", error);
    }
  }
};




  
   
  const handlUpdateUsername = async () => {
    try
    {
      const res = await fetch(Backend_URL + "user/update/username", {
        method: "PATCH",
        mode: "cors",
        credentials: "include",
        body: JSON.stringify({
          username: username,
        }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
         data = await res.json();
        if (res.ok) {
          notify = "the Username is updated"
          setIsNotify(true);
        } else {
          setIsError(true);
        }
    }
    catch (error) {
      console.error("Error fetching:", error);
    }
  }
  
  const handlUpdatePass = async () => {
    try {
    const res = await fetch(Backend_URL + "user/update/password", {
      method: "PATCH",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        oldPass: userPass?.oldPass,
        newPass: userPass?.newPass,
        confirmPass: userPass?.confirmPass,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
      data = await res.json();
      if (res.ok)
      {
        notify = "Password Updated Successfully"
        setUserData(data.newupdat);
        setIsNotify(true);
      } else {
        setIsError(true);
      }
    }
    catch (error) {
      console.error("Error fetching:", error);
    }
  }
  const handlEnableTwoFa = async () => {
    if (isChecked)
    {
      try {
        const res = await fetch(Backend_URL + "auth/2FA/enable", {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            token: codeTwoFa,
          }),
        });
        data = await res.json();
        if (res.ok) {
          notify = "the code is coeerect and 2FA enabled successfully!"
          setIsNotify(true);
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.error("Error fetching:", error);
      }
    }
    else if (isDisabled)
    {
       try {
         const res = await fetch(Backend_URL + "auth/2FA/disable", {
           method: "POST",
           mode: "cors",
           credentials: "include",
           headers: {
             "Content-Type": "application/json",
             "Access-Control-Allow-Origin": "*",
           },
         });
          data = await res.json();
         if (res.ok) {
           notify = data.message
           setIsNotify(true)
         } else {
           setIsError(true)
         }
       } catch (error) {
         console.error("Error fetching:", error);
       }
    }
  }

  
    useEffect(() => {
      if (isChecked) {
        fetch(Backend_URL + "auth/2FA/generate", {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setQrCode(data);
          })
          .catch((error) => {
            console.error("Error fetching QR code data:", error);
          });
      }
    }, [isChecked]);
  return (
    <div>
    <div
      style={{ background: "#050A27" }}
      className=" flex flex-col items-center justify-center w-full flex-1 px-20 text-center h-screen"
    >
      <div
        style={gradientStyle}
        className=" max-w-lg sm:w-2/3 w-80 p-1 rounded-md sm:block px-20  overflow-y-auto"
      >
        <div className="py-10">
          <div className="flex flex-col items-center ">
            <div className="flex items-center shrink-0 mb-8">
              <label htmlFor="fileInput" className="cursor-pointer">
                <img
                  id="preview_img"
                  className="w-20 h-auto object-cover rounded-full sm:w-24 md:w-32 lg:w-40 xl:w-48"
                  src={userData?.profilePic}
                  alt="Current profile photo"
                />
              </label>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                className="hidden"
                onChange={handlePicUpdate}
              />
            </div>
            <div
              style={{ background: "rgba(154, 155, 211, 0.20)" }}
              className="p-0 flex-row items-center mb-8 rounded-md w-full  justify-between shadow"
            >
              <div
                style={{
                  background: isUsernameVisible
                    ? "#050A27"
                    : "rgba(154, 155, 211, 0)",
                }}
                className="justify-between flex items-center rounded p-2 "
              >
                <div>
                  <span
                    className="text-white text-xs"
                    style={{ fontFamily: "Poppins", fontSize: "1rem" }}
                  >
                    username
                  </span>
                </div>
                <div>
                  <Link
                    className="text-white"
                    href=""
                    onClick={() =>
                      setIsUsernameVisible((prevState) => !prevState)
                    }
                  >
                    <IoSettingsOutline />
                  </Link>
                </div>
              </div>

              {isUsernameVisible && (
                <div
                  style={{
                    background: "rgba(154, 155, 211, 0)",
                  }}
                  className="flex flex-col items-center"
                >
                  <span
                    className="outline-none text-sm flex-1 text-white mb-2 mt-2"
                    style={{ fontFamily: "Poppins", fontSize: "0.9rem" }}
                  >
                    new username
                  </span>
                  <div
                    style={{ background: "rgba(154, 155, 211, 0.20)" }}
                    className="p-2 flex-row items-center mb-2 rounded-md w-full  justify-between shadow"
                  >
                    <input
                      // value={userData?.username}
                      type="text"
                      name="Username"
                      style={{
                        background: "rgba(154, 155, 211, 0)",
                      }}
                      className="outline-none text-sm flex-1  max-w-full"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <Link
                    href=""
                    className=" border  text-white rounded-full px-12 py-2 inline-block font-semibold  mt-4 mb-4 shadow-xl hover:bg-[#999BD3]"
                    onClick={handlUpdateUsername}
                  >
                    Confirm
                  </Link>
                </div>
              )}
            </div>

            <div
              style={{ background: "rgba(154, 155, 211, 0.20)" }}
              className="flex-row items-center mb-8 rounded-md w-full  justify-between shadow"
            >
              <div
                style={{
                  background: isPasswordVisible
                    ? "#050A27"
                    : "rgba(154, 155, 211, 0)",
                }}
                className="justify-between flex items-center rounded p-2 "
              >
                <div>
                  <span
                    className="text-white text-xs"
                    style={{ fontFamily: "Poppins", fontSize: "1rem" }}
                  >
                    password
                  </span>
                </div>
                <div>
                  <Link
                    className="text-white"
                    href=""
                    onClick={() =>
                      setIsPasswordVisible((prevState) => !prevState)
                    }
                  >
                    <IoSettingsOutline />
                  </Link>
                </div>
              </div>
              {isPasswordVisible && (
                <div
                  style={{
                    background: "rgba(154, 155, 211, 0)",
                  }}
                  className="flex flex-col items-center"
                >
                  <span
                    className="outline-none text-sm flex-1 text-white mb-2 mt-2"
                    style={{ fontFamily: "Poppins", fontSize: "0.9rem" }}
                  >
                    old password
                  </span>
                  <div
                    style={{ background: "rgba(154, 155, 211, 0.20)" }}
                    className="p-2 flex-row items-center mb-2  rounded-md w-full  justify-between shadow"
                  >
                    <input
                      // value={userData?.username}
                      type="password"
                      name="password"
                      style={{
                        background: "rgba(154, 155, 211, 0)",
                      }}
                      className="outline-none text-sm flex-1 max-w-full "
                      onChange={(e) =>
                        setUserPass(
                          (prevUserPass) =>
                            ({
                              ...prevUserPass,
                              oldPass: e.target.value,
                            } as UserPass)
                        )
                      }
                    />
                  </div>
                  <span
                    className="outline-none text-sm flex-1 text-white mb-2 mt-2"
                    style={{ fontFamily: "Poppins", fontSize: "0.9rem" }}
                  >
                    new password
                  </span>
                  <div
                    style={{ background: "rgba(154, 155, 211, 0.20)" }}
                    className="p-2 flex-row items-center mb-2 rounded-md w-full  justify-between shadow"
                  >
                    <input
                      // value={userData?.username}
                      type="password"
                      name="password"
                      style={{
                        background: "rgba(154, 155, 211, 0)",
                      }}
                      className="outline-none text-sm flex-1 max-w-full"
                      onChange={(e) =>
                        setUserPass(
                          (prevUserPass) =>
                            ({
                              ...prevUserPass,
                              newPass: e.target.value,
                            } as UserPass)
                        )
                      }
                    />
                  </div>
                  <span
                    className="outline-none text-sm flex-1 text-white mb-2 mt-2"
                    style={{ fontFamily: "Poppins", fontSize: "0.9rem" }}
                  >
                    confirm password
                  </span>
                  <div
                    style={{ background: "rgba(154, 155, 211, 0.20)" }}
                    className="p-2 flex-row items-center mb-2 rounded-md w-full  justify-between shadow"
                  >
                    <input
                      // value={userData?.username}
                      type="password"
                      name="password"
                      style={{
                        background: "rgba(154, 155, 211, 0)",
                      }}
                      className="outline-none text-sm flex-1 max-w-full"
                      onChange={(e) =>
                        setUserPass(
                          (prevUserPass) =>
                            ({
                              ...prevUserPass,
                              confirmPass: e.target.value,
                            } as UserPass)
                        )
                      }
                    />
                  </div>
                  <Link
                    href=""
                    className=" border mb-5  text-white rounded-full px-12 py-2 inline-block font-semibold  mt-4 shadow-xl hover:bg-[#999BD3]"
                    onClick={handlUpdatePass}
                  >
                    Confirm
                  </Link>
                </div>
              )}
            </div>

            <div
              style={{ background: "rgba(154, 155, 211, 0.20)" }}
              className="flex-row items-center mb-8 rounded-md w-full  justify-between shadow"
            >
              <div
                style={{
                  background: isTofaVisible
                    ? "#050A27"
                    : "rgba(154, 155, 211, 0)",
                }}
                className="justify-between flex items-center rounded p-2 "
              >
                <div>
                  <span
                    className="text-white text-xs"
                    style={{ fontFamily: "Poppins", fontSize: "1rem" }}
                  >
                    2FA
                  </span>
                </div>
                <div>
                  <Link
                    className="text-white"
                    href=""
                    onClick={() => setIsTofaVisible((prevState) => !prevState)}
                  >
                    <IoSettingsOutline />
                  </Link>
                </div>
              </div>

              {isTofaVisible && (
                <div
                  style={{
                    background: "rgba(154, 155, 211, 0)",
                  }}
                  className="flex"
                >
                  <div
                    style={{ background: "rgba(154, 155, 211, 0)" }}
                    className="p-2 flex-row items-center mb-2 rounded-md w-full  justify-between "
                  >
                    <div className="justify-between flex items-center">
                      <div>
                        <span
                          style={{ fontFamily: "Poppins", fontSize: "0.9rem" }}
                          className="ms-3 text-sm font-medium text-white dark:text-gray-300"
                        >
                          activate 2FA
                        </span>
                      </div>
                      <div>
                        <label className="relative inline-flex items-center me-5 cursor-pointer">
                          <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            checked={isChecked}
                            disabled={isDisabled}
                          />
                          <div
                            className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"
                            onClick={handleToggleClick}
                          ></div>
                        </label>
                      </div>
                    </div>
                    {qrCode && isChecked && (
                      <div
                        style={{
                          background: "rgba(154, 155, 211, 0)",
                        }}
                        className="flex flex-col items-center"
                      >
                        <div className="mb-7 mt-3">
                          <img src={qrCode} alt="QR Code" />
                        </div>

                        <span
                          className="outline-none text-sm flex-1 text-white mb-2"
                          style={{ fontFamily: "Poppins", fontSize: "0.9rem" }}
                        >
                          CODE
                        </span>

                        <div
                          style={{ background: "rgba(154, 155, 211, 0.20)" }}
                          className="p-2 flex-row items-center mb-2 rounded-md w-full  justify-between shadow"
                        >
                          <input
                            type="text"
                            name="code"
                            style={{
                              background: "rgba(154, 155, 211, 0)",
                              overflowWrap: "break-word",
                            }}
                            className="outline-none text-sm flex-1 max-w-full"
                            onChange={(e) => setCodeTwoFa(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                    <Link
                      href=""
                      className=" border  text-white rounded-full px-12 py-2 inline-block font-semibold  mt-4 mb-4 shadow-xl hover:bg-[#999BD3] max-w-full"
                      onClick={handlEnableTwoFa}
                    >
                      Confirm
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
          {isError === true ? <AlertMessage onClick={handleClick} message={data.message} type="error" /> : isNotify === true ? <AlertMessage onClick={handleClick} message={notify as string} type="notify" /> : ""}

        </div>
      </div>
    </div>
    {/* )}  */}
    </div>
  );
}

