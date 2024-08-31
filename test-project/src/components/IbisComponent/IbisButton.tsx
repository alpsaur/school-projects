"use client";
import React, { FC, MouseEventHandler, ReactNode, useState } from "react";

interface IbisButtonProps {
  className?: string;
  text?: string;
  children?: ReactNode;
  value?: string;
  aysncOnClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  normalOnClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const IbisButton: FC<IbisButtonProps> = ({
  className: customClassName = "", // Rename the className prop to customClassName
  text,
  children,
  value,
  aysncOnClick,
  normalOnClick,
  type,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // console.log("Click button !!!");
    if (normalOnClick) {
      normalOnClick(e);
    } else {
      aysncOnClick?.(e);
    }
  };

  return (
    <>
      <button
        className={`w-full py-2 px-4 rounded text-white font-bold ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-400 cursor-pointer hover:bg-blue-900"
        } ${customClassName}`}
        onClick={handleClick}
        value={value}
        type={type}
        disabled={disabled}
        {...props}
      >
        <span>{text || children}</span>
      </button>
    </>
  );
};
