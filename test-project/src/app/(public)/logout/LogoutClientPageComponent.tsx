"use client";
import { useEffect } from "react";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import ClearCookies from "@/app/utils/ClearCookies";

function LogoutClientPageComponent() {
  const router = useRouter();
  async function logOut() {
    try {
      await signOut().then(() => {
        localStorage.clear();
        sessionStorage.clear();
        ClearCookies().then(() => {});
        router.push("/");
      });
    } catch (error) {
      console.log("Error signing out: ", error);
    }
  }
  useEffect(() => {
    logOut();
  });
  return <></>;
}

export default LogoutClientPageComponent;
