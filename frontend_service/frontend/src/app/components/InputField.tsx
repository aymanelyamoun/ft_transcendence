// InputField.tsx
import React from 'react';

interface InputFieldProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ type, name, placeholder, value, onChange }) => {
  return (
    <div style={{ background: 'rgba(154, 155, 211, 0.20)'}} className="p-2 flex items-center mb-7 rounded-md w-full">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        style={{ background: 'rgba(154, 155, 211, 0)' }}
        className="outline-none text-sm flex-1 max-w-full text-white"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
