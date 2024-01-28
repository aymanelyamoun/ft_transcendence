import React from 'react';
import Link from 'next/link';
import { IoSettingsOutline } from 'react-icons/io5';
import Image from 'next/image';

interface TwoFaSettingsProps {
  isTofaVisible: boolean;
  isChecked: boolean;
  isDisabled: boolean;
  handleToggleClick: () => void;
  qrCode: string | null;
  handleToggleVisibility: () => void;
  handleEnableTwoFa: () => void;
  setCodeTwoFa: React.Dispatch<React.SetStateAction<string | null>>;
}

const TwoFaSettings: React.FC<TwoFaSettingsProps> = ({
  isTofaVisible,
  isChecked,
  isDisabled,
  handleToggleClick,
  qrCode,
  handleToggleVisibility,
  handleEnableTwoFa,
  setCodeTwoFa,
}) => {
  return (
    <div
      style={{ background: 'rgba(154, 155, 211, 0.20)' }}
      className="flex-row items-center mb-8 rounded-md w-full justify-between shadow"
    >
      <div
        style={{
          background: isTofaVisible ? '#050A27' : 'rgba(154, 155, 211, 0)',
        }}
        className="justify-between flex items-center rounded p-2 "
      >
        <div>
          <span
            className="text-white text-xs"
            style={{ fontFamily: 'Poppins', fontSize: '1rem' }}
          >
            2FA
          </span>
        </div>
        <div>
          <Link className="text-white" href="" onClick={handleToggleVisibility}>
            <IoSettingsOutline />
          </Link>
        </div>
      </div>

      {isTofaVisible && (
        <div style={{ background: 'rgba(154, 155, 211, 0)' }} className="flex items-center">
          <div
            style={{ background: 'rgba(154, 155, 211, 0)' }}
            className="p-2 flex-row items-center mb-2 rounded-md w-full justify-between "
          >
            <div className="justify-between flex items-center">
              <div>
                <span
                  style={{ fontFamily: 'Poppins', fontSize: '0.9rem' }}
                  className="ms-3 text-sm font-medium text-white dark:text-gray-300"
                >
                  activate 2FA
                </span>
              </div>
              <div>
                <label className="relative inline-flex items-center me-5 cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    checked={isChecked}
                    disabled={isDisabled}
                  />
                  <div
                    className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"
                    onClick={handleToggleClick}
                  ></div>
                </label>
              </div>
            </div>
            {qrCode && isChecked && (
              <div
                style={{ background: 'rgba(154, 155, 211, 0)' }}
                className="flex flex-col items-center"
              >
                <div className="mb-7 mt-3">
                  <Image src={qrCode} alt="QR Code" />
                </div>
                <span
                  className="outline-none text-sm flex-1 text-white mb-2"
                  style={{ fontFamily: 'Poppins', fontSize: '0.9rem' }}
                >
                  CODE
                </span>

                <div
                  style={{ background: 'rgba(154, 155, 211, 0.20)' }}
                  className="p-2 flex-row items-center mb-2 rounded-md w-full justify-between shadow"
                >
                  <input
                    type="text"
                    name="code"
                    style={{
                      background: 'rgba(154, 155, 211, 0)',
                      overflowWrap: 'break-word',
                    }}
                    className="outline-none text-sm flex-1 max-w-full"
                    onChange={(e) => setCodeTwoFa(e.target.value)}
                  />
                </div>
              </div>
            )}
            <Link
              href=""
              className="border text-white rounded-full px-12 py-2 inline-block font-semibold mt-4 mb-4 shadow-xl hover:bg-[#999BD3] max-w-full"
              onClick={handleEnableTwoFa}
            >
              Confirm
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoFaSettings;
