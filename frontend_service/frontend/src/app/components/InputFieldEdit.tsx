// InputSection.tsx
import React, { ReactNode } from 'react';
import Link from 'next/link';
import { IoSettingsOutline } from 'react-icons/io5';

interface InputSectionProps {
  title: string;
  children: ReactNode;
  linkText: string;
  onClick: () => void;
  isVisible: boolean;
  toggleVisibility: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  title,
  children,
  linkText,
  onClick,
  isVisible,
  toggleVisibility,
}) => {
  return (
    <div style={{ background: 'rgba(154, 155, 211, 0.20)' }} className="flex-row items-center mb-8 rounded-md w-full justify-between shadow">
      <div
        style={{
          background: isVisible ? '#050A27' : 'rgba(154, 155, 211, 0)',
        }}
        className="justify-between flex items-center rounded p-2"
      >
        <div>
          <span
            className="text-white text-xs"
            style={{ fontFamily: 'Poppins', fontSize: '1rem' }}
          >
            {title}
          </span>
        </div>
        <div>
          <Link className="text-white" href="" onClick={toggleVisibility}>
            <IoSettingsOutline />
          </Link>
        </div>
      </div>

      {isVisible && (
        <div
          style={{ background: 'rgba(154, 155, 211, 0)' }}
          className="flex flex-col items-center"
        >
          {children}
          <Link
            href=""
            className="border mb-5 text-white rounded-full px-12 py-2 inline-block font-semibold mt-4 shadow-xl hover:bg-[#999BD3]"
            onClick={onClick}
          >
            {linkText}
          </Link>
        </div>
      )}
    </div>
  );
};

export default InputSection;
