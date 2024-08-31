"use server";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import config from "@/amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import { cookies } from "next/headers";
import { listIbisInspections } from "@/graphql/queries";
import { ListIbisInspectionsQuery } from "@/API";

Amplify.configure(config, { ssr: true });
const client = generateServerClientUsingCookies({
  config,
  cookies,
});

export async function GetIbisInspections(
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
