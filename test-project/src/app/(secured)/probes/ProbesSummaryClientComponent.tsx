"use client";
import { IbisProbe, ListIbisProbesQuery } from "@/API";
import { usePathname, useRouter } from "next/navigation";
import GeneralTable from "@/components/Table/GeneralTable";

interface ProbeTableRow {
  id: string;
  NO: number;
  refNo: string | null | undefined;
  Name: string;
  Description: string | null | undefined;
}

export default function ProbesSummaryClientComponent({
  isAdmin,
  probesFromServer,
}: {
  isAdmin?: boolean;
  probesFromServer: IbisProbe[];
}) {
  const pathname = usePathname();
  const router = useRouter();

  const columnNames = ["NO", "refNo", "Name", "Description", "Type"];
  const tableRows: ProbeTableRow[] =
    probesFromServer?.map((probe, index) => ({
      id: probe.id,
      NO: index + 1,
      refNo: probe.refNo,
      Name: probe.name || "",
      Description: probe.description,
      Type: probe.type || "",
    })) || [];

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-center mt-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-indigo-500 text-transparent bg-clip-text">
          Probes
        </h1>
      </div>

      <div className="flex justify-center items-center p-4 w-full">
        <GeneralTable<ProbeTableRow>
          columns={columnNames}
          rows={tableRows}
          pathname="probes"
          needOperation={isAdmin}
        ></GeneralTable>
      </div>

      {isAdmin && (
        <div className="flex justify-center items-center p-4 w-full">
          <label className="text-center bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer hover:bg-blue-700 focus:outline-none focus:shadow-outline w-full">
            <button
              onClick={() => {
                router.push(pathname + "/create");
              }}
            >
              Create Probe
            </button>
          </label>
        </div>
      )}
    </div>
  );
}
