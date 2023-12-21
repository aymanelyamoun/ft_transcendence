import React, { useEffect, useState } from 'react'
import styles from './EditProfile.module.css'
import { RiEditBoxLine } from "react-icons/ri";
import Link from 'next/link';
import styled from 'styled-components';
import EditProfileShow from './EditProfileShow';


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
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const handleEdit = () => {
    { setShowEdit(true) }
  }
  useEffect(() => {
    console.log(showEdit);
  }, [showEdit]); 
  return (
    <>
      {showEdit ? (<EditProfileShow />) : null}
      <EditProfileContainer >
        <RiEditBoxLine />
        <div  className='edit-profile-text ' >
          <button onClick={handleEdit} >
          edit profile
          </button>
        </div>
      </EditProfileContainer>
    </>
  );
}

export default EditProfile;