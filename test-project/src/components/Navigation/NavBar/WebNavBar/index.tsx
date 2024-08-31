"use client";
import React from "react";
import Logo from "../../../Logo";
import SignInButton from "../../SignInButton";
import NavBarSelection from "./NavBarSelection";

const WebNavBar = ({
  toggle,
  isSignedIn,
}: {
  toggle: React.MouseEventHandler<HTMLButtonElement>;
  isSignedIn: boolean;
}) => {
  return (
    <>
      <div className="h-16 bg-gradient-to-r from-teal-950 to-indigo-900 sticky shadow-xl">
        <div className="container mx-auto px-5 h-full w-full">
          <div className="flex justify-between items-center h-full w-full px-5">
            <Logo />
            <button
              type="button"
              className="inline-flex items-center md:hidden"
              onClick={toggle}
            >
              {/* Menu Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#fff"
                  d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"
                />
              </svg>
            </button>
            {isSignedIn ? <NavBarSelection /> : ""}

            <div className="hidden md:block">
              <SignInButton isSignedIn={isSignedIn} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WebNavBar;
