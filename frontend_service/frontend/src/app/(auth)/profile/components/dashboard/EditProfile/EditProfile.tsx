import React from 'react'
import styles from './EditProfile.module.css'
import { RiEditBoxLine } from "react-icons/ri";
import Link from 'next/link';

const EditProfile = () => {
  return (
    <div className={styles.EditProfile}>
        <RiEditBoxLine />
        <div className='edit-profile-text'>
          <Link href="/update">
            Edit Profile
          </Link>
          </div> {
        }
    </div>
  )
}

export default EditProfile