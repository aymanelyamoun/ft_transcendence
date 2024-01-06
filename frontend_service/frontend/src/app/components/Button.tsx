// Button.tsx
import React from 'react';
import Link from "next/link";
interface ButtonProps {
  onClick: () => void;
  text: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <Link href="" className='m=0 border-2 border-white text-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-[#999BD3] mb-7' onClick={onClick}>
      {text}
    </Link>
  );
};

export default Button;

