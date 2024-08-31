"use client";
import { ListIbisProbeGroupsQuery } from "@/API";
import { usePathname, useRouter } from "next/navigation";
import GeneralTable from "@/components/Table/GeneralTable";

interface ProbeGroupTableRow {
    id: string;
    NO: number;
    Name: string;
    Description: string;
    Type: string;
};

export default function ProbeGroupListComponent({
    data,
    isAdmin,
}: {
    data: ListIbisProbeGroupsQuery,
    isAdmin?: boolean,
}) {
    const pathname = usePathname();
    const router = useRouter();

    const probeGroups = data.listIbisProbeGroups;

    const isProbeGroupEmpty = (probeGroups?.length === 0 || probeGroups === undefined || probeGroups === null);

    const columnNames = ["NO", "Name", "Description", "Type"];
    const tableRows: ProbeGroupTableRow[] = probeGroups?.map((probegroup, index) => ({
        id: probegroup.id,
        NO: index + 1,
        Name: probegroup.name || "",
        Description: probegroup.description || "",
        Type: probegroup.type || "",
    })) || [];

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-center mt-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-indigo-500 text-transparent bg-clip-text">Probe Groups</h1>
            </div>

            {isProbeGroupEmpty ? (
                <div className="flex justify-center items-center p-4 w-full">
                    No Probe Group Data Found...
                </div>
            ) : (
                <div className="flex justify-center items-center p-4 w-full">
                    <GeneralTable<ProbeGroupTableRow> columns={columnNames} rows={tableRows} pathname="probegroups" needOperation={isAdmin} />
                </div>
            )}

            {isAdmin && (
                <div className="flex justify-center items-center p-4 w-full">
                    <label className="text-center bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer hover:bg-blue-700 focus:outline-none focus:shadow-outline w-full">
                        <button
                            onClick={() => {
                                router.push(pathname + "/create");
                            }}
                        >
                            Create Probe Group
                        </button>
                    </label>
                </div>
            )}
        </div>
    );
};