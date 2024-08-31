"use server";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import config from "@/amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import { cookies } from "next/headers";
import { listIbisProjects } from "@/graphql/queries";

Amplify.configure(config, { ssr: true });
const client = generateServerClientUsingCookies({
  config,
  cookies,
});

export async function getProjects(ownerId: string) {
  try {
    const results = await client.graphql({
      query: listIbisProjects,
      variables: {
        ownerId: ownerId,
      },
    });
    return results.data.listIbisProjects;
  } catch (err) {
    return [];
  }
}
