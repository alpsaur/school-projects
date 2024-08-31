"use server";

import config from "@/amplifyconfiguration.json";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { cookies } from "next/headers";
import { CreateProbeGroupInput, IbisProbe, IbisProbeGroup } from "@/API";
import { getIbisProbeGroup, listIbisProbes } from "@/graphql/queries";
import {
  createIbisProbeGroup,
  updateIbisProbeGroup,
} from "@/graphql/mutations";

const client = generateServerClientUsingCookies({
  config,
  cookies,
});

function formatProbeGroupData(
  rawData: IbisProbeGroup | null
): CreateProbeGroupInput | null {
  if (rawData === null) return null;

  const probeDatas: IbisProbe[] = rawData.probes as IbisProbe[];
  const probeIds: string[] = probeDatas.map((p) => p.id);

  return {
    id: rawData.id,
    refNo: rawData.refNo,
    name: rawData.name,
    description: rawData.description,
    isPublic: rawData.isPublic,
    ownerId: rawData.ownerId,
    probeIds: probeIds,
    type: rawData.type,
  };
}

async function getProbeGroupById(
  probeGroupId: string
): Promise<CreateProbeGroupInput | null> {
  const result = await client.graphql({
    query: getIbisProbeGroup,
    variables: {
      id: probeGroupId,
    },
  });

  const data = result.data.getIbisProbeGroup;
  if (data === undefined || data === null) {
    return null;
  }

  return formatProbeGroupData(data);
}

async function fetchIbisProbes(type?: string): Promise<IbisProbe[]> {
  const result = await client.graphql({
    query: listIbisProbes,
    variables: {
      type: type,
    },
  });

  const rawData = result.data.listIbisProbes;
  return rawData || [];
}

async function createProbeGroup(
  inputProbeGroupData: CreateProbeGroupInput
): Promise<void> {
  console.log("Final Check Create Probe Group: ", inputProbeGroupData);

  const result = await client.graphql({
    query: createIbisProbeGroup,
    variables: {
      input: inputProbeGroupData,
    },
  });

  console.log("Created Probe Group: ", result);
}

async function updateProbeGroup(
  inputProbeGroupData: CreateProbeGroupInput
): Promise<void> {
  console.log("Final Check Update Probe Group Data: ", inputProbeGroupData);
  await client.graphql({
    query: updateIbisProbeGroup,
    variables: {
      input: inputProbeGroupData,
    },
  });
}

export {
  fetchIbisProbes,
  createProbeGroup,
  getProbeGroupById,
  updateProbeGroup,
};
