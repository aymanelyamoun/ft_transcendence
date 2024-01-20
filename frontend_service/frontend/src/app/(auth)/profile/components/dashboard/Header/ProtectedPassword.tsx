import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import styles from './search.module.css'
import { ProtectedPassProps } from '../interfaces';

const ProtectedPassword = React.forwardRef<HTMLDivElement, ProtectedPassProps>((props, ref) => {
  const infoRef = useRef<HTMLDivElement>(null);
  const setInputPassword = props.setInputPassword;
  const setPasswordSent = props.setPasswordSent;
  const setOpenPassComp = props.setOpenPassComp;
  const inputPassword = props.inputPassword;

  const handleClickOutside = (event: any) => {
    console.log("Clicked outside");
    if (infoRef.current && !infoRef.current.contains(event.target as Node))
    {
      // setPasswordSent(true);
      setOpenPassComp(false);
    }
  }
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputPassword(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => 
  {
    if (event.key === 'Enter')
    {
      if (inputPassword)
      {
        setPasswordSent(true);
        setOpenPassComp(false);
      }
      else
      {
        alert("fikra ghalata a Imane!");
      }
    }
  };
  

  return (
    <>
      <div onClick={handleClickOutside} className="addChannelOverlay flex justify-center items-center">
        <div ref={infoRef} className={styles['PasswordContainer']}>
          <div className={styles['span-container']}>
            <span className={styles['span-description']}>{"This channel is protected by a password"}</span>
          </div>
          {/* <div className={styles['input-container']}> */}
          <input className={styles['input-container']}
              type="password"
              placeholder="Enter password"
              // value={passwordInput}
              onChange={handlePasswordChange}
              onKeyPress={handleKeyPress}
            />
          {/* </div> */}
        </div>
      </div>
    </>
  );
});

export default ProtectedPassword;

// I need to check if the password is correct or not in this comp