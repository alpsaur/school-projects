"use server";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import config from "@/amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import { cookies } from "next/headers";
import { getIbisInspection, listIbisProbeGroups } from "@/graphql/queries";
import {
  GetIbisInspectionQuery,
  ListIbisProbeGroupsQuery,
  UpdateInspectionInput,
} from "@/API";
import { updateIbisInspection } from "@/graphql/mutations";

Amplify.configure(config, { ssr: true });
const client = generateServerClientUsingCookies({
  config,
  cookies,
});

export async function getIbisInspectionByIdAction(
  inspectionId: string
): Promise<GetIbisInspectionQuery> {
  try {
    const results = await client.graphql({
      query: getIbisInspection,
      variables: {
        id: inspectionId,
      },
    });

    return results.data;
  } catch (err) {
    console.log("error found in `getIbisInspectionByIdAction`", err);
    const results: GetIbisInspectionQuery = { getIbisInspection: null };
    console.log(results);
    return results;
  }
}
export async function getIbisProbeGroupsAction(): Promise<ListIbisProbeGroupsQuery> {
  try {
    const results = await client.graphql({
      query: listIbisProbeGroups,
    });

    return results.data;
  } catch (err) {
    const results: ListIbisProbeGroupsQuery = { listIbisProbeGroups: [] };
    return results;
  }
}

export async function updateInspectionAction(
  inspectionDetailInput: UpdateInspectionInput
): Promise<string> {
  // new created inspection, should call CREATE mutation ...
  const result = await client.graphql({
    query: updateIbisInspection,
    variables: {
      input: inspectionDetailInput,
    },
  });
  console.log("Update Inspection End...");

  return result.data.updateIbisInspection;
}
