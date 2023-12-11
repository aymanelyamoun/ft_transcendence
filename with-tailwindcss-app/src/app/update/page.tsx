'use client'
import Link from 'next/link';
import React, { useState } from 'react'
import { IoSettingsOutline } from "react-icons/io5";

export default function page() {
  const [isUsernameVisible, setIsUsernameVisible] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isTofaVisible, setIsTofaVisible] = useState(false);
  
    
    
const gradientStyle = {
    background:
    "linear-gradient(170deg, rgba(255, 255, 255, 0.00) -50.22%, #040924 -9.3%, #111534 -1.17%, rgba(68, 71, 111, 0.96) 83.26%, rgba(154, 155, 211, 0.90) 136.85%)",
};
  
  return (
    <div
      style={{ background: "#050A27" }}
      className=" flex flex-col items-center justify-center w-full flex-1 px-20 text-center h-screen"
    >
      <div
        style={gradientStyle}
        className="  sm:w-2/4 w-80 p-1 rounded-md sm:block px-20"
      >
        <div className="py-10">
          <div className="flex flex-col items-center ">
            <div className="flex items-center shrink-0 mb-8">
              <label htmlFor="fileInput" className="cursor-pointer">
                <img
                  id="preview_img"
                  className="w-20 h-auto object-cover rounded-full sm:w-24 md:w-32 lg:w-40 xl:w-48"
                  src="https://cdn.intra.42.fr/users/c06c0753f8262f275a233097381d0190/snouae.jpg"
                  alt="Current profile photo"
                />
              </label>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                className="hidden"
                // onChange={(e) => {
                //   const file = e.target.files?.[0];
                //   if (file) {
                //     const reader = new FileReader();
                //     reader.onloadend = () => {
                //       setUserData((prev) => ({
                //         ...(prev as UserData),
                //         profilePic: reader.result as string,
                //       }));
                //     };
                //     reader.readAsDataURL(file);
                //   }
                // }}
              />
            </div>
            <div
              style={{ background: "rgba(154, 155, 211, 0.20)" }}
              className="p-2 flex-row items-center mb-8 rounded-md w-full  justify-between shadow"
            >
              <div className="justify-between flex items-center">
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
                    onClick={() => setIsUsernameVisible(true)}
                  >
                    <IoSettingsOutline />
                  </Link>
                </div>
              </div>

              {isUsernameVisible && (
                <div
                  style={{
                    background: "rgba(154, 155, 211, 0)",
                    overflowWrap: "break-word",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                    whiteSpace: "pre-line",
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
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                        wordBreak: "break-word",
                        whiteSpace: "pre-line",
                      }}
                      className="outline-none text-sm flex-1 "
                      // onChange={(e) => (data.current.username = e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div
              style={{ background: "rgba(154, 155, 211, 0.20)" }}
              className="p-2 flex-row items-center mb-8 rounded-md w-full  justify-between shadow"
            >
              <div className="justify-between flex items-center">
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
                    onClick={() => setIsPasswordVisible(true)}
                  >
                    <IoSettingsOutline />
                  </Link>
                </div>
              </div>
              {isPasswordVisible && (
                <div
                  style={{
                    background: "rgba(154, 155, 211, 0)",
                    overflowWrap: "break-word",
                    wordWrap: "break-word", // Use camelCase for CSS propertie
                    wordBreak: "break-word",
                    whiteSpace: "pre-line", // Use camelCase for CSS propertie
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
                    className="p-2 flex-row items-center mb-2 rounded-md w-full  justify-between shadow"
                  >
                    <input
                      // value={userData?.username}
                      type="password"
                      name="password"
                      style={{
                        background: "rgba(154, 155, 211, 0)",
                        overflowWrap: "break-word",
                        wordWrap: "break-word", // Use camelCase for CSS propertie
                        wordBreak: "break-word",
                        whiteSpace: "pre-line", // Use camelCase for CSS propertie
                      }}
                      className="outline-none text-sm flex-1 "
                      // onChange={(e) => (data.current.username = e.target.value)}
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
                        overflowWrap: "break-word",
                        wordWrap: "break-word", // Use camelCase for CSS propertie
                        wordBreak: "break-word",
                        whiteSpace: "pre-line", // Use camelCase for CSS propertie
                      }}
                      className="outline-none text-sm flex-1 "
                      // onChange={(e) => (data.current.username = e.target.value)}
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
                        overflowWrap: "break-word",
                        wordWrap: "break-word", // Use camelCase for CSS propertie
                        wordBreak: "break-word",
                        whiteSpace: "pre-line", // Use camelCase for CSS propertie
                      }}
                      className="outline-none text-sm flex-1 "
                      // onChange={(e) => (data.current.username = e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div
              style={{ background: "rgba(154, 155, 211, 0.20)" }}
              className="p-2 flex-row items-center mb-8 rounded-md w-full  justify-between shadow"
            >
              <div className="justify-between flex items-center">
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
                    onClick={() => setIsTofaVisible(true)}
                  >
                    <IoSettingsOutline />
                  </Link>
                </div>
              </div>

              {isTofaVisible && (
                <div
                  style={{
                    background: "rgba(154, 155, 211, 0)",
                    overflowWrap: "break-word",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                    whiteSpace: "pre-line",
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
                            checked
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </div>
                    {/* <input
                      // value={userData?.username}
                      type="text"
                      name="Username"
                      style={{
                        background: "rgba(154, 155, 211, 0)",
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                        wordBreak: "break-word",
                        whiteSpace: "pre-line",
                      }}
                      className="outline-none text-sm flex-1 "
                      // onChange={(e) => (data.current.username = e.target.value)}
                    /> */}
                  </div>
                </div>
              )}
            </div>
            <Link
              href=""
              className=" border  text-white rounded-full px-12 py-2 inline-block font-semibold  mt-12 shadow-xl hover:bg-sky-950"
            >
              Confirm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
