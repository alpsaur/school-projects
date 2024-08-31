import React from "react";
import { redirect } from "next/navigation";
import { createProbeGroup, fetchIbisProbes } from "../_lib/graphqlApi";
import { CreateProbeGroupInput, ProbeTypeEnum } from "@/API";
import IbisProbeGroupDetailComponent from "../(probeGroupComponents)/probeGroupDetailComponent";
import { headers } from "next/headers";

async function saveCreatedProbeGroup(
  inputSubmitData: CreateProbeGroupInput
): Promise<void> {
  "use server";
  await createProbeGroup(inputSubmitData);

  redirect("/probegroups");
}

export default async function createProbeGroupServerPage() {
  const headerLists = headers();
  const ownerId: string = headerLists.get("X-IBIS-ID") ?? "";
  console.log("ownerIdValue: ", ownerId);

  const probeData = await fetchIbisProbes();
  const initProbeGroupData: CreateProbeGroupInput = {
    refNo: "",
    name: "",
    description: "",
    isPublic: true,
    ownerId: ownerId,
    probeIds: [],
    type: ProbeTypeEnum.MATCH,
  };

  return (
    <>
      <IbisProbeGroupDetailComponent
        probeDataFromServer={probeData}
        probeGroupDataFromServer={initProbeGroupData}
        finalSubmit={saveCreatedProbeGroup}
        buttonText="Save"
      />
    </>
  );
}
