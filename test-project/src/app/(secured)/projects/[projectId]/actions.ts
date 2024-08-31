"use server";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import config from "@/amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import { cookies } from "next/headers";
import { getIbisProject, listIbisInspections } from "@/graphql/queries";
import { GetIbisProjectQuery, ListIbisInspectionsQuery } from "@/API";

Amplify.configure(config, { ssr: true });
const client = generateServerClientUsingCookies({
  config,
  cookies,
});

export async function getIbisProjectByIdAction(
  projectId: string
): Promise<GetIbisProjectQuery> {
  try {
    const results = await client.graphql({
      query: getIbisProject,
      variables: {
        id: projectId,
      },
    });

    return results.data;
  } catch (err) {
    const results: GetIbisProjectQuery = { getIbisProject: null };

    return results;
  }
}

export async function getIbisInspectionsByProjectIdAction(
  projectId: string
): Promise<ListIbisInspectionsQuery> {
  try {
    const results = await client.graphql({
      query: listIbisInspections,
      variables: {
        projectId: projectId,
      },
    });

    return results.data;
  } catch (err) {
    const results: ListIbisInspectionsQuery = { listIbisInspections: [] };

    return results;
  }
}
