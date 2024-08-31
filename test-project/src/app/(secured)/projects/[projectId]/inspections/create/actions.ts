"use server";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import config from "@/amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import { cookies } from "next/headers";
import { getIbisInspection } from "@/graphql/queries";
import {
  CreateInspectionInput,
  GetIbisInspectionQuery,
  UpdateInspectionInput,
} from "@/API";
import { createIbisInspection } from "@/graphql/mutations";

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
    console.log("i am inside the actions.ts");
    const results: GetIbisInspectionQuery = { getIbisInspection: null };

    return results;
  }
}

export async function createInspectionAction(
  inspectionDetail: CreateInspectionInput
): Promise<string> {
  // new created inspection, should call CREATE mutation ...
  const result = await client.graphql({
    query: createIbisInspection,
    variables: {
      input: inspectionDetail,
    },
  });
  console.log("Create Inspection End...");

  return result.data.createIbisInspection;
}
