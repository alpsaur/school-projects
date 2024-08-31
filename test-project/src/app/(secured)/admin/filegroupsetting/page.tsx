import React from "react";
import ListFileGroupSettingComponent from "./listFileGroupSettingComponent";
import { getIbisFileGroupSettingsAction } from "../../probes/[probeId]/actions";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function fileGroupSettingPage() {
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

  const fileGroupSettingsQueryFromServer =
    await getIbisFileGroupSettingsAction();
  const fileGroupSettings =
    fileGroupSettingsQueryFromServer.listIbisFileGroupSettings;

  return (
    <>
      <ListFileGroupSettingComponent data={fileGroupSettings} />
    </>
  );
}
