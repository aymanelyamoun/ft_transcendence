import React, { useRef } from 'react';
import styled from 'styled-components';
import styles from './search.module.css'
import { ProtectedPassProps } from '../interfaces';

const ProtectedPassword = React.forwardRef<HTMLDivElement, ProtectedPassProps>((props, ref) => {
  const infoRef = useRef<HTMLDivElement>(null);
  const setInputPassword = props.setInputPassword;
  const setPasswordSent = props.setPasswordSent

  const handleClickOutside = (event: any) => {
    console.log("Clicked outside");
    if (infoRef.current && !infoRef.current.contains(event.target as Node))
    {
      setPasswordSent(true)
    }
  }

  return (
    <>
      <div onClick={handleClickOutside} className="addChannelOverlay flex justify-center items-center">
        <div ref={infoRef} className={styles['PasswordContainer']}></div>
      </div>
    </>
  );
});

export default ProtectedPassword;