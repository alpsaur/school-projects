import React from "react";

import config from "@/amplifyconfiguration.json";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { cookies, headers } from "next/headers";
import ProbeGroupListComponent from "./probeGroupListComponent";
import { listIbisProbeGroups } from "@/graphql/queries";

const client = generateServerClientUsingCookies({
  config,
  cookies,
});

export default async function ProbeGroupListPage() {
  const headerLists = headers();
  const ownerIdValue: string = headerLists.get("X-IBIS-ID") ?? "";
  console.log("ownerIdValue: ", ownerIdValue);

  const result = await client.graphql({
    query: listIbisProbeGroups,
  });

  const { data } = result;
  const isAdmin = true; // dummy admin check, should be changed after usergroup works ...

  return (
    <>
      <ProbeGroupListComponent data={data} isAdmin={isAdmin} />
    </>
  );
}
