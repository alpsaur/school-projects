import { headers } from "next/headers";
import ProjectDashboardPageClientComponent from "./ProjectDashboardPageClientComponent";
import {
  getIbisInspectionsByProjectIdAction,
  getIbisProjectByIdAction,
} from "./actions";
import { notFound } from "next/navigation";

export default async function ProjectsServerPage({
  params,
}: {
  params: { projectId: string };
}) {
  const headerLists = headers();
  const ownerIdValue: string = headerLists.get("X-IBIS-ID") ?? "";
  console.log("ownerIdValue: ", ownerIdValue);

  const projectQueryFromServer = await getIbisProjectByIdAction(
    params.projectId
  );
  const projectFromServer = projectQueryFromServer.getIbisProject;

  if (projectFromServer === null || projectFromServer === undefined) {
    notFound(); // This triggers a 404 page
  }

  const inspectionsQueryFromServer = await getIbisInspectionsByProjectIdAction(
    params.projectId
  );
  return (
    <div className="h-full bg-indigo-300 p-5 overflow-auto">
      <ProjectDashboardPageClientComponent
        projectFromServer={projectFromServer}
        inspectionsQueryFromServer={inspectionsQueryFromServer}
      />
    </div>
  );
}
