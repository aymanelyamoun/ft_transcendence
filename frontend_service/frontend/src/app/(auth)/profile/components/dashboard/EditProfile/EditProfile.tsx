"use client"
import React, { useEffect, useState } from 'react';
import styles from './EditProfile.module.css';
import { RiEditBoxLine } from "react-icons/ri";
import Link from 'next/link';
import styled from 'styled-components';
import EditProfileShow from './EditProfileShow';

interface EditProfileProps {
  setShowEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfileContainer = styled.div`
  position: relative;
  top: 0;
  right: 0;
  padding: 1rem 1rem 1rem 2.5rem;
  font-size: 1.5rem;
  gap: 0.6rem;
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

const EditSpan = styled.span`

`;

const EditProfile: React.FC<EditProfileProps> = (props) => {
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const setShowEditProfile = props.setShowEditProfile;

  const handleEdit = () => {
    { setShowEdit(true) }
  }

  const handleShowProfile = () => {
    setShowEditProfile(true);
  }
  useEffect(() => {
    console.log(showEdit);
  }, [showEdit]); 
  return (
    <>
      <EditProfileContainer >
        <RiEditBoxLine />
        <div className='edit-profile-text' onClick={handleShowProfile}>
            <EditSpan>Edit Profile</EditSpan>
          </div>
    </EditProfileContainer>
    </>
  )
}

export default EditProfile;