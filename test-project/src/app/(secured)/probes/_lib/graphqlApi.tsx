"use server";

import {
  CreateProbeInput,
  CreateSubProbeInput,
  CreateParameterInput,
} from "@/API";

import config from "@/amplifyconfiguration.json";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { cookies } from "next/headers";
import {
  createIbisParameter,
  createIbisProbe,
  createIbisSubProbe,
  deleteIbisParameter,
  deleteIbisProbe,
  deleteIbisSubProbe,
  updateIbisParameter,
  updateIbisProbe,
  updateIbisSubProbe,
} from "@/graphql/mutations";

const client = generateServerClientUsingCookies({
  config,
  cookies,
});

export async function removeTypename(obj: any): Promise<any> {
  if (Array.isArray(obj)) {
    return obj.map(removeTypename);
  } else if (typeof obj === "object" && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && key !== "__typename") {
        newObj[key] = removeTypename(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

// For Create
async function createNewProbe(
  createProbeData: CreateProbeInput
): Promise<string> {
  console.log("Final Check Create Probe Data: ", createProbeData);
  const createdProbe = await client.graphql({
    query: createIbisProbe,
    variables: {
      input: createProbeData,
    },
  });
  console.log("Return: ", createdProbe);
  return createdProbe.data.createIbisProbe;
}

async function createNewSubProbe(
  createSubProbeData: CreateSubProbeInput
): Promise<string> {
  console.log("Final Check Create SubProbe Data: ", createSubProbeData);
  const createdSubProbe = await client.graphql({
    query: createIbisSubProbe,
    variables: {
      input: createSubProbeData,
    },
  });
  console.log("Return: ", createdSubProbe);
  return createdSubProbe.data.createIbisSubProbe;
}

async function createNewParameter(
  createParameterData: CreateParameterInput
): Promise<string> {
  console.log("Final Check Parameter: ", createParameterData);
  const createdParameter = await client.graphql({
    query: createIbisParameter,
    variables: {
      input: createParameterData,
    },
  });
  console.log("Return: ", createdParameter);
  return createdParameter.data.createIbisParameter;
}

// For Update
async function updateProbe(updateProbeData: CreateProbeInput): Promise<void> {
  const updatedProbe = await client.graphql({
    query: updateIbisProbe,
    variables: {
      input: updateProbeData,
    },
  });
  console.log("Updated Probe: ", updatedProbe);
}

async function updateSubProbe(
  updateSubProbeData: CreateSubProbeInput
): Promise<void> {
  const updatedSubProbe = await client.graphql({
    query: updateIbisSubProbe,
    variables: {
      input: updateSubProbeData,
    },
  });
  console.log("Updated SubProbe: ", updatedSubProbe);
}

async function updateParameter(
  updateParameterData: CreateParameterInput
): Promise<void> {
  const updatedParameter = await client.graphql({
    query: updateIbisParameter,
    variables: {
      input: updateParameterData,
    },
  });
  console.log("Update Parameter: ", updatedParameter);
}

// For Delete
async function deleteProbe(deleteProbeId: string): Promise<void> {
  await client.graphql({
    query: deleteIbisProbe,
    variables: {
      deleteId: deleteProbeId,
    },
  });
  console.log("Delete Probe ", deleteProbeId);
}

async function deleteSubProbe(deleteSubProbeId: string): Promise<void> {
  await client.graphql({
    query: deleteIbisSubProbe,
    variables: {
      deleteId: deleteSubProbeId,
    },
  });
  console.log("Delete SubProbe ", deleteSubProbeId);
}

async function deleteParameter(deleteParameterId: string): Promise<void> {
  await client.graphql({
    query: deleteIbisParameter,
    variables: {
      deleteId: deleteParameterId,
    },
  });
  console.log("Delete Parameter ", deleteParameterId);
}

export { createNewProbe, createNewSubProbe, createNewParameter };
export { updateProbe, updateSubProbe, updateParameter };
export { deleteProbe, deleteSubProbe, deleteParameter };
