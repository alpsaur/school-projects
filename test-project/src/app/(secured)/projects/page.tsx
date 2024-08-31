import ProjectsClientPageComponent from "./ProjectsClientPageComponent";
import { headers } from "next/headers";
import { IbisProject } from "@/API";
import { getProjects } from "./actions";

export default async function ProjectsServerPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  console.log("i am here in projects page");
  const headerLists = headers();
  const ownerIdValue: string = headerLists.get("X-IBIS-ID") ?? "";
  console.log("ownerIdValue: ", ownerIdValue);

  let projectsFromServer: IbisProject[] = [];
  const projectsFound = await getProjects(ownerIdValue);
  if (projectsFound) {
    projectsFromServer = projectsFound;
  }

  return (
    <ProjectsClientPageComponent
      searchParams={searchParams}
      projectsFromServer={projectsFromServer}
    />
  );
}
