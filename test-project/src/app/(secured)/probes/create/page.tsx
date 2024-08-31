import React from "react";
import { redirect } from "next/navigation";
import { CreateProbeInput, ProbeTypeEnum, UpdateProbeInput } from "@/API";
import { v4 as uuidv4 } from "uuid";
import IbisProbesDetailComponent from "../(probeComponents)/ibisProbesDetailComponent";
import { handleCreateProbePageSubmit } from "../_lib/submitFunc";
import { createFlag } from "@/ibisTypes";
import { headers } from "next/headers";
import { getIbisFileGroupSettingsAction } from "../[probeId]/actions";

async function finalProbeDataSubmit(
  submitProbeData: CreateProbeInput | UpdateProbeInput
): Promise<void> {
  "use server";
  // console.log("Test probe submit data: ", JSON.stringify(submitProbeData, null, 2));
  await handleCreateProbePageSubmit(submitProbeData as CreateProbeInput);
  redirect("/probes");
}

export default async function CreateProbeServerPage() {
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

  const initialProbeInput: CreateProbeInput = {
    id: createFlag + uuidv4(),
    refNo: "",
    name: "",
    url: "",
    description: "",
    fileGroupSettingId: "",
    ownerId: ownerId,
    type: ProbeTypeEnum.MATCH,
    isPublic: true,
    subprobes: [
      {
        id: createFlag + uuidv4(),
        name: "",
        description: "",
        isVisible: true,
        ownerId: ownerId,
        probeId: "",
        parameters: [],
      },
    ],
  };
  return (
    <div>
      <IbisProbesDetailComponent
        isCreate={true}
        fileGroupsFromServer={fileGroupSettings}
        initialProbeInput={initialProbeInput}
        finalBtnText="Submit"
        handleProbeSubmitFunction={finalProbeDataSubmit}
      />
    </div>
  );
}
