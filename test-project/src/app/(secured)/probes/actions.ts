"use server";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import config from "@/amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import { cookies } from "next/headers";
import { listIbisProbes } from "@/graphql/queries";
import { ListIbisProbesQuery } from "@/API";

Amplify.configure(config, { ssr: true });
const client = generateServerClientUsingCookies({
  config,
  cookies,
});

export async function getIbisProbesAction(): Promise<ListIbisProbesQuery> {
  try {
    const results = await client.graphql({
      query: listIbisProbes,
    });

    return results.data;
  } catch (err) {
    const results: ListIbisProbesQuery = { listIbisProbes: [] };

    return results;
  }
}
