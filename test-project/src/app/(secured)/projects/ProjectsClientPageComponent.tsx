"use client";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import { usePathname, useRouter } from "next/navigation";
import { IbisProject, ListIbisProjectsQuery } from "@/API";
import { IbisButton } from "@/components/IbisComponent";
import GeneralTable from "@/components/Table/GeneralTable";

interface TableRow {
  id: string;
  NO: number;
  Name: string;
  Description: string | null | undefined;
}

function filterQueryProject(query: string, tableRows: TableRow[]) {
  if (query != "") {
    return tableRows.filter((row) => {
      return row.Name.toLowerCase().includes(query.toLowerCase());
    });
  }
  return tableRows;
}

function filterProject(
  filterQueryTable: any,
  currentPage: string,
  itemsPerPage: number
) {
  const startIndex = (parseInt(currentPage) - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  filterQueryTable = filterQueryTable.slice(startIndex, endIndex);
  return filterQueryTable;
}

export default function ProjectsClientPageComponent({
  // data,
  searchParams,
  projectsFromServer,
}: {
  // data: ListIbisProjectsQuery;
  searchParams?: { query?: string; page?: string };
  projectsFromServer?: IbisProject[];
}) {
  const pathname = usePathname();
  const router = useRouter();

  // let projects = data.listIbisProjects;
  let projects = projectsFromServer;
  if (projects === null || projects === undefined) {
    projects = [];
  }

  const TABLE_HEAD = ["NO", "Name", "Description"];
  const tableRows: TableRow[] =
    projects.length > 0
      ? projects.map((project, index) => ({
          id: project.id || "",
          NO: index + 1,
          Name: project.name || "",
          Description: project.description,
        }))
      : [];

  const query = searchParams?.query || "";

  const currentPage = query ? "1" : searchParams?.page || "1";

  const itemsPerPage = 6;

  let filterQueryTable = filterQueryProject(query, tableRows);

  const totalPages =
    Math.floor(filterQueryTable.length / itemsPerPage) +
    (filterQueryTable.length % itemsPerPage == 0 ? 0 : 1);

  let filterTable = filterProject(filterQueryTable, currentPage, itemsPerPage);

  return (
    <div className="w-full">
      <div className="flex items-center justify-center mt-2 mx-5 h-20">
        <h1 className="text-4xl/loose font-bold bg-gradient-to-r from-slate-700 to-indigo-500 text-transparent bg-clip-text">
          Projects
        </h1>
      </div>
      <div className="mx-5">
        <IbisButton
          normalOnClick={() => {
            router.push(pathname + "/create");
          }}
        >
          Create Project
        </IbisButton>
      </div>
      <div className="mt-5 flex items-center justify-between gap-2 mx-5">
        <Search placeholder="Search projects..." />
      </div>

      <div className="mt-5 flex items-center justify-between gap-2 mx-5">
        <GeneralTable<TableRow>
          columns={TABLE_HEAD}
          rows={filterTable}
          pathname={pathname}
          operationType="Edit"
        />
      </div>

      <div className="mt-5 flex w-full justify-center mb-5">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
