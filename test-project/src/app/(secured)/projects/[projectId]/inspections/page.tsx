import React from "react";
import { headers } from "next/headers";
import InspectionsPageClientComponent from "./InspectionsPageClientComponent";
import { GetIbisInspections } from "./actions";

export default async function InspectionPage({
  params,
}: {
  params: { projectId: string };
}) {
  const headerLists = headers();
  const ownerIdValue: string = headerLists.get("X-IBIS-ID") ?? "";
  console.log("ownerIdValue: ", ownerIdValue);

  const inspectionsDataFromServer = await GetIbisInspections(params.projectId);

  return (
    <InspectionsPageClientComponent
      inspectionsDataFromServer={inspectionsDataFromServer}
    />
  );
}
