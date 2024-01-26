import React from 'react';
import { RiExternalLinkLine } from 'react-icons/ri';

const MyIcon = () => {
    return (
      <div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg"
          alt="42 Logo"
          style={{ width: '15px', height: '15px' }}
          className="text-sm text-white"
        />
        {/* <RiExternalLinkLine /> */}
      </div>
    );
  };

export default MyIcon;
