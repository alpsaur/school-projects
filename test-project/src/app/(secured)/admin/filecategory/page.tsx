import React from "react";
import { fetchFileCategories } from "../_lib/graphqlApi";
import { IbisFileCategory } from "@/API";
import ListFileCategoryComponent from "./listFileCategoryComponent";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function FileCategoryPage() {
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

  const fileCategoryList: IbisFileCategory[] = await fetchFileCategories();

  return (
    <>
      <ListFileCategoryComponent data={fileCategoryList} />
    </>
  );
}
