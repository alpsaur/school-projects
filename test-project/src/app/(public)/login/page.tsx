import React from "react";
import LoginClientPageComponent from "./LoginClientPageComponent";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function LoginServerPage() {
  const headerLists = headers();
  const ownerIdValue: string = headerLists.get("X-IBIS-ID") ?? "";
  console.log("ownerIdValue: ", ownerIdValue);

  if (ownerIdValue !== "") {
    console.log("i am in login page but i am being redirected");
    redirect("/projects");
  }
  return <LoginClientPageComponent />;
}
