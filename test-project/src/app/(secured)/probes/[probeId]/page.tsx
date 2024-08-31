import { CreateProbeInput, UpdateProbeInput } from "@/API";
import React from "react";
import IbisProbesDetailComponent from "../(probeComponents)/ibisProbesDetailComponent";
import { handleEditProbePageSubmit } from "../_lib/submitFunc";
import { notFound, redirect } from "next/navigation";
import {
  getIbisFileGroupSettingsAction,
  getIbisProbeByIdAction,
} from "./actions";

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
  const probeQueryFromServer = await getIbisProbeByIdAction(params.probeId);
  const probeFromServer = probeQueryFromServer.getIbisProbe;
  if (probeFromServer === null || probeFromServer === undefined) {
    notFound(); // This triggers a 404 page
  }
  const fileGroupSettingsQueryFromServer =
    await getIbisFileGroupSettingsAction();
  const fileGroupSettings =
    fileGroupSettingsQueryFromServer.listIbisFileGroupSettings;

  console.log(
    "Fetched Probe Data is: ",
    JSON.stringify(probeFromServer, null, 2)
  );

  const isAdmin = true; // dummy admin check, should be changed after usergroup works ...

  return (
    <>
      <div>
        {probeFromServer ? (
          <IbisProbesDetailComponent
            isCreate={false}
            initialProbeInput={probeFromServer}
            fileGroupsFromServer={fileGroupSettings}
            finalBtnText="Save Changes"
            handleProbeSubmitFunction={saveChangesToDB}
            isReadOnly={!isAdmin}
          />
        ) : (
          <div>Probe with id {params.probeId} not Found</div>
        )}
      </div>
    </>
  );
}
