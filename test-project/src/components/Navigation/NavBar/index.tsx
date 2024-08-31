"use client";
import { useEffect, useState } from "react";
import WebNavBar from "./WebNavBar";
import MobileNavbar from "./MobileNavBar";
import { Hub } from "aws-amplify/utils";

const Navigation = (ownerId: any) => {
  const initialSignedIn = ownerId !== "" ? true : false;
  const [isSignedIn, setIsSignedIn] = useState(initialSignedIn);
  const [isOpen, setIsOpen] = useState(false);
  function handleToggle() {
    setIsOpen(!isOpen);
  }
  useEffect(() => {
    const hubListenerCancelToken = Hub.listen("auth", ({ payload }) => {
      console.log(payload);
      switch (payload.event) {
        case "signedIn":
          console.log("user have been signedIn successfully. from WebNavBar");
          setIsSignedIn(true);
          break;
        case "signedOut":
          console.log("user have been signedOut successfully.");
          setIsSignedIn(false);
          break;
        case "tokenRefresh":
          console.log("auth tokens have been refreshed.");
          break;
        case "tokenRefresh_failure":
          console.log("failure while refreshing auth tokens.");
          break;
        case "signInWithRedirect":
          console.log("signInWithRedirect API has successfully been resolved.");
          break;
        case "signInWithRedirect_failure":
          console.log(
            "failure while trying to resolve signInWithRedirect API."
          );
          break;
      }
    });
    return () => {
      hubListenerCancelToken();
    };
  }, []);

  useEffect(() => {
    console.log("useEffect trigger", isSignedIn);
  }, [isSignedIn]);

  // toggle sidebar

  return (
    <>
      <MobileNavbar isOpen={isOpen} toggle={handleToggle} />
      <WebNavBar toggle={handleToggle} isSignedIn={isSignedIn} />
    </>
  );
};

export default Navigation;
