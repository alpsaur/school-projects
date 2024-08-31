import FileComponent from "./FileSummaryClientComponent";
import { headers } from "next/headers";
import { getIbisFilesByProjectId as getIbisFilesByProjectIdAction } from "./actions";

export default async function FilesPage({
  params,
  searchParams,
}: {
  params: { projectId: string };
  searchParams: { query?: string; page?: string };
}) {
  const headerLists = headers();
  const ownerIdValue: string = headerLists.get("X-IBIS-ID") ?? "";
  console.log("ownerIdValue: ", ownerIdValue);

  const ibisFilesQueryFromServer = await getIbisFilesByProjectIdAction(
    params.projectId
  );
  return (
    <>
      <FileComponent
        params={params}
        ibisFilesFromServer={ibisFilesQueryFromServer}
        searchParams={searchParams}
      />
    </>
  );
}
