import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default function FileCategoryDetailPage({
  params,
}: {
  params: { fileCategoryId: string };
}) {
  const headerLists = headers();
  const ownerId: string = headerLists.get("X-IBIS-ID") ?? "";
  const userGroups: string = headerLists.get("X-IBIS-USERGROUP") ?? "";
  console.log("userGroup: ", userGroups);
  console.log("ownerIdValue: ", ownerId);
  // Split the string into an array
  const userGroupArray: string[] = userGroups.split(",");
  const isAdmin = userGroupArray.includes("SuperAdmin") ? true : false;
  if (!isAdmin) {
    redirect("/probes");
  }

  return <div>FileCategoryDetailPage {params.fileCategoryId}</div>;
}
