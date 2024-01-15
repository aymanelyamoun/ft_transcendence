import React from 'react';

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ label, value, onChange }) => {
  return (
    <>
      <span
        className="outline-none text-sm flex-1 text-white mb-2 mt-2"
        style={{ fontFamily: 'Poppins', fontSize: '0.9rem' }}
      >
        {label}
      </span>
      <div
        style={{ background: 'rgba(154, 155, 211, 0.20)' }}
        className="p-2 flex-row items-center mb-2 rounded-md w-full justify-between shadow"
      >
        <input
          type="password"
          name={label.toLowerCase()}
          style={{
            background: 'rgba(154, 155, 211, 0)',
          }}
          className="outline-none text-sm flex-1 max-w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </>
  );
};

export default PasswordInput;
