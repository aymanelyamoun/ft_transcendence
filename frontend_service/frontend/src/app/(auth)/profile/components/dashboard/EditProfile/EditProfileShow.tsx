"use client"
 
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react'
import { IoSettingsOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Loading from "../../../../../components/Loading";
import Authorization from '@/utils/auth';
import { AlertMessage } from '@/app/components/alertMessage';
import styles from './EditProfile.module.css'
import InputSection from '@/app/components/InputFieldEdit';
import { useUser } from '@/app/(auth)/layout';
import PasswordInput from '@/app/components/PasswordInput';
import TwoFaSettings from '@/app/components/TwoFaSettings';
import ProfilePicUpload from '@/app/components/ProfilePicUpload';
import { fetchAPI } from '@/utils/api';


let data : any
var notify : string

interface EditProfileShowProps {
  onClose: () => void;
}

const EditProfileShow: React.FC<EditProfileShowProps> = ( props ) => {
  const onClose = props.onClose;
  const [isError, setIsError] = useState<boolean>(false);
  const [isNotify, setIsNotify] = useState<boolean>(false);
  const EditRef = useRef<HTMLDivElement>(null);
  const handleClick = () => {
    setIsError(false);
    setIsNotify(false);
  }

  
  useEffect(() => {
  
    const handleClickOutside = (event: MouseEvent) => {
      if (EditRef.current && !EditRef.current.contains(event.target as Node))
      {
        onClose();
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  
  }, [onClose]);

  const [isUsernameVisible, setIsUsernameVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isTofaVisible, setIsTofaVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [codeTwoFa, setCodeTwoFa] = useState<string | null>(null);
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
  const user = useUser();

    useEffect(() => {
      const checkAuthentication = async () => {
          if (user) {
            setUserData({
              username: user.username ?? "",
              profilePic: user.profilePic ?? "",
              hash: user.hash ?? "",
               typeLog: user.typeLog ?? "",
               isTwoFactorEnabled: user.isTwoFactorEnabled ?? false,

            });
          }
      };
      checkAuthentication();
    }, [user, router]); 

    function getExtension(filename : string) {
      return filename.split('.').pop();
    }
  
  
    const handlePicUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
      let profilePic : any
      const file = e.target.files?.[0];
      if (file) {
        const fileExtension = getExtension(file.name)?.toLowerCase();
        const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    
        if (!fileExtension || !allowedImageExtensions.includes(fileExtension)) {
          return;
        }
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'imagesus');
          const resCLoud = await fetch(`https://api.cloudinary.com/v1_1/dapuvf8uk/image/upload`, {
            method: 'POST',
            body: formData,
          } );
          if (resCLoud.ok) {
            const data1 = await resCLoud.json();
            if (data1 && data1.secure_url) {
              profilePic = data1.secure_url;
          
              const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'user/update/image', {
                method: 'PATCH',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify({ pic: profilePic }),
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                },
              });
          
              data = await response.json();
              if (response.ok) {
                notify = 'Your new profile picture has been successfully updated';
                setUserData(data.newupdat);
                setIsNotify(true);
              }
            } 
          } 
        } catch (error) {
        }
      }
    };
    
  const handlUpdateUsername = async () => {
    try {
      await fetchAPI({
        url : process.env.NEXT_PUBLIC_BACKEND_URL + "user/update/username",
        method: "PATCH",
        body: {
          username: username,
        },
      });
      notify = "the Username is updated"
      setIsNotify(true);
      setIsUsernameVisible(false);
    }
    catch (error)
    {
      data =  error;
      setIsError(true);
    }
  }
  const handlUpdatePass = async () => {
    try
    {
      await fetchAPI({
        url : process.env.NEXT_PUBLIC_BACKEND_URL + "user/update/password",
        method: "PATCH",
        body : {
            oldPass: userPass?.oldPass,
            newPass: userPass?.newPass,
            confirmPass: userPass?.confirmPass,
        },
      });
      notify = "Password Updated Successfully"
      setIsPasswordVisible(false);
      setIsNotify(true);
    }
    catch (error)
    {
      data =  error;
      setIsError(true);
    }
  }
  const handlEnableTwoFa = async () => {
    if (isChecked)
    {
      try
      {
        await fetchAPI({
          url : process.env.NEXT_PUBLIC_BACKEND_URL + "auth/2FA/enable",
          method: "POST",
          body : {
            token: codeTwoFa,
          }
        });
        notify = "the code is coeerect and 2FA enabled successfully!"
        setIsNotify(true);
        setIsTofaVisible(false);          
      }
      catch (error)
      {
        data =  error;
        setIsError(true);
      }
    }
    else if (isDisabled)
    {
      try
      {
         await fetchAPI ({
          url : process.env.NEXT_PUBLIC_BACKEND_URL + "auth/2FA/disable",
          method: "POST",
         });
        notify = "2FA disabled successfully";
        setIsNotify(true)
        setIsTofaVisible(false);  
      } catch ( error)
      {
        data =  error;
        setIsError(true);
      }
    }
  }
    useEffect(() => {
      if (isChecked) {
      const generateQr = async () =>
      {
        try { 
          const res =  await fetchAPI({
            url: process.env.NEXT_PUBLIC_BACKEND_URL + "auth/2FA/generate",
            method: "GET",
          });
          setQrCode(res);
        }catch (error)
        {
          data =  error;
          setIsError(true);
        }
      }
      generateQr();
    }
    }, [isChecked]);
  return (
    <>
    <div className="addChannelOverlay flex flex-col  justify-center items-center text-center  ">
      <div
        ref={EditRef}
        style={gradientStyle}
        className=" max-w-lg sm:w-2/3 w-80 p-1 rounded-md sm:block px-20  overflow-y-auto"
      >
        <div className="py-10">
          <div className="flex flex-col items-center ">
          <ProfilePicUpload profilePic={userData?.profilePic} handlePicUpdate={handlePicUpdate} />
              <InputSection
                  title="username"
                  linkText="Confirm"
                  onClick={handlUpdateUsername}
                  isVisible={isUsernameVisible}
                  toggleVisibility={() => setIsUsernameVisible((prevState) => !prevState)}
                >
                  <span
                    className="outline-none text-sm flex-1 text-white mb-2 mt-2"
                    style={{ fontFamily: 'var(--font-poppins)', fontSize: '0.9rem' }}
                  >
                    new username
                  </span>
                  <div
                    style={{ background: 'rgba(154, 155, 211, 0.20)' }}
                    className="p-2 flex-row items-center mb-2 rounded-md w-full justify-between shadow"
                  >
                    <input
                      type="text"
                      name="Username"
                      style={{
                        background: 'rgba(154, 155, 211, 0)',
                      }}
                      className="outline-none text-sm flex-1 max-w-full"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </InputSection>
                <InputSection
                  title="password"
                  linkText="Confirm"
                  onClick={handlUpdatePass}
                  isVisible={isPasswordVisible}
                  toggleVisibility={() => setIsPasswordVisible((prevState) => !prevState)}
                >
                  <PasswordInput label="Old Password" value={userPass?.oldPass || ''} onChange={(value) => setUserPass((prev) => ({ ...prev, oldPass: value } as UserPass))} />
                  <PasswordInput label="New Password" value={userPass?.newPass || ''} onChange={(value) => setUserPass((prev) => ({ ...prev, newPass: value } as UserPass))} />
                  <PasswordInput label="Confirm Password" value={userPass?.confirmPass || ''} onChange={(value) => setUserPass((prev) => ({ ...prev, confirmPass: value } as UserPass))} />
            </InputSection>
              <TwoFaSettings
                isTofaVisible={isTofaVisible}
                isChecked={isChecked}
                isDisabled={isDisabled}
                handleToggleClick={handleToggleClick}
                qrCode={qrCode}
                handleToggleVisibility={() => setIsTofaVisible((prevState) => !prevState)}
                handleEnableTwoFa={handlEnableTwoFa}
                setCodeTwoFa={setCodeTwoFa}
              />
          </div>
          {isError === true ? <AlertMessage onClick={handleClick} message={data.message} type="error" /> : isNotify === true ? <AlertMessage onClick={handleClick} message={notify as string} type="notify" /> : ""}
        </div>
      </div>
      </div>
    </>
  );
};

export default EditProfileShow;
