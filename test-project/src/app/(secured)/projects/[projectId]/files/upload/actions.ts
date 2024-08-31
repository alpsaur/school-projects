"use server";

import { CreateFileInput } from "@/API";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import config from "@/amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import { cookies } from "next/headers";
import { listIbisFileCategories } from "@/graphql/queries";
import { ListIbisFileCategoriesQuery } from "@/API";

Amplify.configure(config, { ssr: true });
const client = generateServerClientUsingCookies({
  config,
  cookies,
});

export async function getIbisFileCategories(): Promise<ListIbisFileCategoriesQuery> {
  try {
    const results = await client.graphql({
      query: listIbisFileCategories,
    });

    return results.data;
  } catch (err) {
    const results: ListIbisFileCategoriesQuery = { listIbisFileCategories: [] };

    return results;
  }
}
