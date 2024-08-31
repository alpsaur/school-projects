"use client";
import React, { FC, ReactNode, useState } from "react";

interface IbisLoadingBtnProps {
  className?: string;
  btnText?: string;
  children?: ReactNode;
  onclick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  disabled?: boolean;
  color?: string;
}

export const IbisLoadingBtn: FC<IbisLoadingBtnProps> = ({
  className = "w-full",
  btnText = "Save",
  children,
  onclick,
  disabled = false,
  color = "blue",
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleBtnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // console.log("Click button !!!");
    e.preventDefault();
    setIsLoading(true);
    await onclick(e);
    setIsLoading(false);
  };

  return (
    <>
      <button
        className={`${className} inline-flex items-center justify-center bg-${color}-400 hover:bg-${color}-900 text-white font-bold py-2 px-4 rounded ${
          !disabled
            ? "cursor-pointer"
            : "disabled:bg-gray-400 cursor-not-allowed"
        }`}
        disabled={disabled}
        onClick={handleBtnClick}
      >
        {isLoading && (
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0a12 12 0 00-12 12h4z"
            ></path>
          </svg>
        )}
        <span>{btnText || children}</span>
      </button>
    </>
  );
};
