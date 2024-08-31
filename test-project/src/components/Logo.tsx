"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import Image from "next/image";

const Logo = () => {
  //update the size of the logo when the size of the screen changes
  const [width, setWidth] = useState(0);

  const updateWidth = () => {
    const newWidth = window.innerWidth;
    setWidth(newWidth);
  };

  const logoPath = "/images/betekk-logo.svg";

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    updateWidth();
  }, []);

  // change between the logo and the button when the user scrolls
  const [showButton, setShowButton] = useState(false);

  const changeNavButton = () => {
    if (window.scrollY >= 400 && window.innerWidth < 768) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNavButton);
  }, []);

  return (
    <>
      <Link href="/" style={{ display: showButton ? "none" : "block" }}>
        <Image
          src={logoPath}
          alt="Logo"
          width={80}
          height={60}
          className="relative"
          priority={true}
        />
      </Link>
      <div
        style={{
          display: showButton ? "block" : "none",
        }}
      ></div>
    </>
  );
};

export default Logo;
