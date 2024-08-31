import React from "react";
import { redirect } from "next/navigation";
import {
  fetchIbisProbes,
  getProbeGroupById,
  updateProbeGroup,
} from "../_lib/graphqlApi";
import IbisProbeGroupDetailComponent from "../(probeGroupComponents)/probeGroupDetailComponent";
import { CreateProbeGroupInput } from "@/API";
import { headers } from "next/headers";

async function saveUpdatedProbeGroup(
  inputSubmitData: CreateProbeGroupInput
): Promise<void> {
  "use server";
  // console.log("... Currently not connect to database ...");
  await updateProbeGroup(inputSubmitData);

  redirect("/probegroups");
}

export default async function ViewProbeGroupPage({
  params,
}: {
  params: { probegroupId: string };
}) {
  const headerLists = headers();
  const ownerIdValue: string = headerLists.get("X-IBIS-ID") ?? "";
  console.log("ownerIdValue: ", ownerIdValue);

  const probeGroupData = await getProbeGroupById(params.probegroupId);
  const probeDatas = await fetchIbisProbes();

  // const formattedProbeGroupData: CreateProbeGroupInput = formatProbeGroupData(probeGroupData) as CreateProbeGroupInput;

  // console.log("Probe Group Got: ", probeGroupData);
  const isProbeGroupNotFound = probeGroupData === null;
  return (
    <>
      {isProbeGroupNotFound ? (
        <div>Probe Group {params.probegroupId} Not Found ...</div>
      ) : (
        <IbisProbeGroupDetailComponent
          probeDataFromServer={probeDatas}
          probeGroupDataFromServer={probeGroupData}
          finalSubmit={saveUpdatedProbeGroup}
          buttonText="Save Changes"
        />
      )}
    </>
  );
}
