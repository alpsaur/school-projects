"use server";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import config from "@/amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import { cookies } from "next/headers";
import { listIbisFiles } from "@/graphql/queries";
import { ListIbisFilesQuery } from "@/API";

Amplify.configure(config, { ssr: true });
const client = generateServerClientUsingCookies({
  config,
  cookies,
});

export async function getIbisFilesByProjectId(
  projectId: string
): Promise<ListIbisFilesQuery> {
  try {
    const results = await client.graphql({
      query: listIbisFiles,
      variables: {
        projectId: projectId,
      },
    });

    return results.data;
  } catch (err) {
    const results: ListIbisFilesQuery = { listIbisFiles: [] };

    return results;
  }
}
