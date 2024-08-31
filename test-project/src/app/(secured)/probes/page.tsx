import { headers } from "next/headers";
import ProbesSummaryClientComponent from "./ProbesSummaryClientComponent";
import { getIbisProbesAction } from "./actions";

export default async function Probes() {
  const headerLists = headers();
  const ownerIdValue: string = headerLists.get("X-IBIS-ID") ?? "";
  const userGroups: string = headerLists.get("X-IBIS-USERGROUP") ?? "";
  console.log("userGroup: ", userGroups);
  console.log("ownerIdValue: ", ownerIdValue);
  // Split the string into an array
  const userGroupArray: string[] = userGroups.split(",");
  const isAdmin = userGroupArray.includes("SuperAdmin") ? true : false;
  console.log("isAdmin", isAdmin);
  
  const ibisProbesQueryFromServer = await getIbisProbesAction();
  const ibisProbesFromServer = ibisProbesQueryFromServer.listIbisProbes;
  return (
    <>
      <ProbesSummaryClientComponent
        isAdmin={isAdmin}
        probesFromServer={ibisProbesFromServer}
      />
    </>
  );
}
