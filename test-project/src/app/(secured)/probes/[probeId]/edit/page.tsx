import { CreateProbeInput, UpdateProbeInput } from "@/API";
import React from "react";
import IbisProbesDetailComponent from "@/app/(secured)/probes/(probeComponents)/ibisProbesDetailComponent";
import { handleEditProbePageSubmit } from "@/app/(secured)/probes/_lib/submitFunc";
import { notFound, redirect } from "next/navigation";
import { getIbisProbeByIdAction } from "./actions";
import { headers } from "next/headers";
import { getIbisFileGroupSettingsAction } from "../actions";

async function saveChangesToDB(
  submitProbeData: CreateProbeInput | UpdateProbeInput
): Promise<void> {
  "use server";

  // console.log("Test probe submit data: ", JSON.stringify(submitProbeData, null, 2));
  await handleEditProbePageSubmit(submitProbeData as CreateProbeInput);

  redirect("/probes");
}

export default async function ViewProbePage({
  params,
}: {
  params: { probeId: string };
}) {
  //1. check for admin and headers
  const headerLists = headers();
  const ownerId: string = headerLists.get("X-IBIS-ID") ?? "";
  const userGroups: string = headerLists.get("X-IBIS-USERGROUP") ?? "";
  // console.log("userGroup: ", userGroups);
  // console.log("ownerIdValue: ", ownerId);
  // Split the string into an array
  const userGroupArray: string[] = userGroups.split(",");
  const isAdmin = userGroupArray.includes("SuperAdmin") ? true : false;
  if (!isAdmin) {
    redirect("/probes");
  }
  // 2. pull data
  const probeQueryFromServer = await getIbisProbeByIdAction(params.probeId);
  const probeFromServer = probeQueryFromServer.getIbisProbe;
  if (probeFromServer === null || probeFromServer === undefined) {
    notFound(); // This triggers a 404 page
  }
  const fileGroupSettingsQueryFromServer =
    await getIbisFileGroupSettingsAction();
  const fileGroupSettings =
    fileGroupSettingsQueryFromServer.listIbisFileGroupSettings;

  const initialProbeInput: UpdateProbeInput = {
    id: probeFromServer.id,
    refNo: probeFromServer.refNo,
    name: probeFromServer.name,
    url: probeFromServer.url,
    description: probeFromServer.description,
    fileGroupSettingId: probeFromServer.fileGroupSetting?.id,
    ownerId: probeFromServer.ownerId,
    type: probeFromServer.type,
    isPublic: probeFromServer.isPublic,
    subprobes: probeFromServer.subprobes,
  };

  return (
    <div>
      <IbisProbesDetailComponent
        isCreate={true}
        initialProbeInput={initialProbeInput}
        fileGroupsFromServer={fileGroupSettings}
        finalBtnText="Save Changes"
        handleProbeSubmitFunction={saveChangesToDB}
        isReadOnly={!isAdmin}
      />
    </div>
  );
}
