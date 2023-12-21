import React from 'react'
import styles from './EditProfile.module.css'
import { RiEditBoxLine } from "react-icons/ri";
import Link from 'next/link';
import styled from 'styled-components';


const EditProfileContainer = styled.div`
  position: relative;
  top: 0;
  right: 0;
  padding: 1rem;
  font-size: 1.5rem;
  gap: 0.9rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    border-radius: 1rem;
    transition: all 0.3s ease-in-out;
    background: rgba(52, 65, 139, 0.55);
  }
`;

const EditProfile = () => {
  return (
    <EditProfileContainer>
        <RiEditBoxLine />
        <div className='edit-profile-text'>
          <Link href="/update">
            Edit Profile
          </Link>
          </div> {
        }
    </EditProfileContainer>
  )
}

export default EditProfile