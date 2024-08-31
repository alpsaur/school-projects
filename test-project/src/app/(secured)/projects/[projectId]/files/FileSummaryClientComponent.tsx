"use client";
import Search from "@/components/Search";
import { usePathname, useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import { ListIbisFilesQuery } from "@/API";
import { IbisButton } from "@/components/IbisComponent";
import GeneralTable from "@/components/Table/GeneralTable";

interface TableRow {
  id: string;
  NO: number;
  Name: string;
  // Type: string | null | undefined;
  Description: string | null | undefined;
  UploadedOn: string | null | undefined;
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

export default function FileComponent({
  params,
  ibisFilesFromServer,
  searchParams,
}: {
  params: { projectId: string };
  ibisFilesFromServer: ListIbisFilesQuery;
  searchParams: { query?: string; page?: string };
}) {
  const query = searchParams.query || "";
  const currentPage = query ? "1" : searchParams.page || "1";
  const itemsPerPage = 6;

  const ibisFilesFiltered = ibisFilesFromServer.listIbisFiles;
  // const ibisFilesFiltered =
  //   ibisFiles?.filter((f) => f.fileCategory?.name !== "JSON") || [];
  const TABLE_HEAD = ["NO", "Name", "Type", "Description", "UploadedOn"];
  const tableRows: TableRow[] =
    ibisFilesFiltered.map((file, index) => ({
      id: file.id,
      NO: index + 1,
      Name: file.name || "",
      // Type: file.fileCategory?.name,
      Description: file.description,
      UploadedOn: file.createdOn,
    })) || [];

  let filterQueryTable = filterQueryProject(query, tableRows);

  const totalPages =
    Math.floor(filterQueryTable.length / itemsPerPage) +
    (filterQueryTable.length % itemsPerPage == 0 ? 0 : 1);

  let filterTable = filterProject(filterQueryTable, currentPage, itemsPerPage);

  const pathname = usePathname();
  const router = useRouter();

  const handleFileUploadButton = () => {
    router.push(pathname + "/upload");
  };

  return (
    <>
      <div className="flex container mx-auto px-4 justify-center mt-5 mb-5 h-auto">
        <p className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-indigo-500 text-transparent bg-clip-text">
          File Repository
        </p>
      </div>

      <div className="flex mx-auto justify-center ml-5 mr-5">
        <Search placeholder="Enter the file name to search the file..." />
      </div>

      <div className="flex mx-auto justify-center ml-5 mr-5 mt-5">
        <GeneralTable<TableRow>
          columns={TABLE_HEAD}
          rows={filterTable}
          pathname={pathname}
          operationType=""
        />
      </div>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>

      <div className="mt-2 px-5">
        <IbisButton normalOnClick={handleFileUploadButton}>
          Upload File
        </IbisButton>
      </div>
    </>
  );
}
