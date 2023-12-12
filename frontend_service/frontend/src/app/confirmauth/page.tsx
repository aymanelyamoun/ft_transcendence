import React from 'react'

export default function page() {
 const gradientStyle = {
    background: 'linear-gradient(170deg, rgba(255, 255, 255, 0.00) -50.22%, #040924 -9.3%, #111534 -1.17%, rgba(68, 71, 111, 0.96) 83.26%, rgba(154, 155, 211, 0.90) 136.85%)',
    };
  
    return (
      <div
        style={{ background: "#050A27" }}
        className=" flex flex-col items-center justify-center w-full flex-1 px-20 text-center h-screen"
      >
        <h2 className=" text-white shadow-2xl  text-3xl font-bold mb-3">
          {" "}
          2FA{" "}
        </h2>
        <div className=" py-5">
          <div
            style={{ background: "rgba(154, 155, 211, 0.20)" }}
            className=" p-2 flex items-center mb-7 rounded-md w-full"
          >
            <input
              // value={userData?.username}
              type="text"
              name="Username"
              placeholder="CODE"
              style={{ background: "rgba(154, 155, 211, 0)" }}
              className=" outline-none text-sm flex-1 text-white"
              // onChange={(e) => (data.current.username = e.target.value)}
              // onChange={(e) =>
              //   setUserData(
              //     (prev) =>
              //       ({
              //         username: e.target.value,
              //         // id: prev?.id || undefined,

              //         profilePic: prev?.profilePic || undefined,
              //       } as UserData)
              //   )
              // }
            />
          </div>
        </div>
      </div>
    );
}
