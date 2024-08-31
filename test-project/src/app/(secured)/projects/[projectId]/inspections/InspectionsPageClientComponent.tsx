"use client";
import { usePathname, useRouter } from "next/navigation";
import GeneralTable from "@/components/Table/GeneralTable";

import { ListIbisInspectionsQuery } from "@/API";

interface InspectionTableRow {
  id: string;
  NO: number;
  Name: string;
  Description: string;
  Status: string;
}

export default function InspectionsPageClientComponent({
  inspectionsDataFromServer,
}: {
  inspectionsDataFromServer: ListIbisInspectionsQuery;
}) {
  const pathname = usePathname();
  const router = useRouter();

  let inspections = inspectionsDataFromServer.listIbisInspections;

  const columnNames = ["NO", "Name", "Description", "Status"];
  const tableRows: InspectionTableRow[] = inspections.map(
    (inspection, index) => ({
      id: inspection.id,
      NO: index + 1,
      Name: inspection.name || "",
      Description: inspection.description || "",
      Status: inspection.status || "",
    })
  );

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-center mt-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-indigo-500 text-transparent bg-clip-text">
          Inspections
        </h1>
      </div>

      <div className="flex justify-center items-center p-4 w-full">
        <GeneralTable<InspectionTableRow>
          columns={columnNames}
          rows={tableRows}
          pathname={pathname}
        ></GeneralTable>
      </div>

      <div>
        <div className="flex justify-center items-center p-4 w-full">
          <label className="text-center bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer hover:bg-blue-700 focus:outline-none focus:shadow-outline w-full">
            <button
              onClick={() => {
                router.push(pathname + "/create");
              }}
            >
              Create Inspection
            </button>
          </label>
        </div>
      </div>
    </div>
  );
}
