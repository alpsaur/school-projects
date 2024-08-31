import { CreateFileCategoryInput } from "@/API";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";
import IbisFileCategoryDetailComponent from "../(fileCategoryComponents)/fileCategoryDetailComponent";
import { headers } from "next/headers";

async function saveFileCategoryInput(
  inputSubmitData: CreateFileCategoryInput
): Promise<void> {
  "use server";

  redirect("/admin/filecategory");
}

export default function CreateFileCategoryPage() {
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
  const initFileCategoryData: CreateFileCategoryInput = {
    id: uuidv4(),
    name: "",
    description: "",
    acceptableExtensions: [],
  };
  return (
    <>
      <IbisFileCategoryDetailComponent
        fileCategoryDataFromServer={initFileCategoryData}
        finalSubmit={saveFileCategoryInput}
      />
    </>
  );
}
