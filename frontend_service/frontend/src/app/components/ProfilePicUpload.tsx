// ProfilePicUpload.jsx
import React from 'react';

interface ProfilePicUploadProps {
  profilePic: string | undefined;
  handlePicUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfilePicUpload: React.FC<ProfilePicUploadProps> = ({
  profilePic,
  handlePicUpdate,
}) => {
  return (
    <div className="flex items-center shrink-0 mb-8">
      <label htmlFor="fileInput" className="cursor-pointer">
      <img
      id="preview_img"
      className="w-20 h-20 object-cover rounded-full sm:w-24 sm:h-24 md:w-38 md:h-38 lg:w-40 lg:h-40 xl:w-48 xl:h-48"
      src={profilePic}
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
  );
};

export default ProfilePicUpload;
