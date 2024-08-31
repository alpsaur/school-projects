"use server";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import config from "@/amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import { cookies } from "next/headers";
import { getIbisProbe } from "@/graphql/queries";
import { GetIbisProbeQuery } from "@/API";

Amplify.configure(config, { ssr: true });
const client = generateServerClientUsingCookies({
  config,
  cookies,
});
export async function getIbisProbeByIdAction(
  probeId: string
): Promise<GetIbisProbeQuery> {
  try {
    const results = await client.graphql({
      query: getIbisProbe,
      variables: {
        id: probeId,
      },
    });
    return results.data;
  } catch (err) {
    console.log("error found in `getIbisProbeByIdAction`", err);
    const results: GetIbisProbeQuery = { getIbisProbe: null };
    console.log(results);
    return results;
  }
}
