"use client";
import IbisTable from "@/components/IbisComponent/IbisTable";
import IbisTableCell from "@/components/IbisComponent/IbisTableCell";
import IbisTableRow from "@/components/IbisComponent/IbisTableRow";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface GeneralTableProps<T extends { id: string }> {
    columns: string[];
    rows: T[];
    pathname: string;
    needOperation?: boolean;
    operationType?: string;
}

const GeneralTable = <T extends { id: string }>({
    columns,
    rows,
    pathname,
    needOperation = true,
    operationType = "Detail",
}: GeneralTableProps<T>) => {
    const router = useRouter();
    const singleOperation = operationType === "";

    const handleCellClick = (id: string) => {
        if (!singleOperation) {
            router.push(`${pathname}/${id}`);
            console.log(`${pathname}/${id}`);
        }
    };

    return (
        <IbisTable>
            {/** <--- HEADER ---> */}
            <IbisTableRow>
                {columns.map((column) => {
                    let className = "";
                    if (column === "NO") {
                        className = "w-10 flex-none";
                    }
                    return (
                        <IbisTableCell
                            isBold
                            key={column}
                            className={className}
                        >
                            {column}
                        </IbisTableCell>
                    );
                })}
                {needOperation && (
                    <IbisTableCell isBold>
                        Operation
                    </IbisTableCell>
                )}
            </IbisTableRow>

            {/** <--- BODY ---> */}
            {rows.map((row) => (
                <IbisTableRow key={row.id} isBlueBackground={false} >
                    {columns.map((columnName) => {
                        let className = "";
                        if (columnName === "NO") {
                            className = "w-10 flex-none font-bold text-gray-500 bg-slate-300";
                        }
                        if (columnName === "Status") {
                            const valueOfStatus = String(row[columnName as keyof T]);
                            if (valueOfStatus === "CREATED") {
                                className = "font-bold text-blue-500";
                            }
                            if (valueOfStatus === "FAILED") {
                                className = "font-bold text-red-500";
                            }
                            if (valueOfStatus === "COMPLETED" || valueOfStatus === "PASS") {
                                className = "font-bold text-green-500";
                            }
                            if (valueOfStatus === "ONGOING") {
                                className = "font-bold text-yellow-500";
                            }
                        }
                        return (
                            <IbisTableCell
                                key={columnName}
                                onClick={() => handleCellClick(row.id)}
                                className={className}
                            >
                                {String(row[columnName as keyof T])}
                            </IbisTableCell>
                        );
                    })}
                    {needOperation && (
                        singleOperation ? (
                            <IbisTableCell>
                                <Link href="#">Delete</Link>
                            </IbisTableCell>
                        ) : (
                            <IbisTableCell>
                                <Link href={`${pathname}/${row.id}`}>{operationType}</Link> / <Link href="#">Delete</Link>
                            </IbisTableCell>
                        )
                    )}
                </IbisTableRow>
            ))}
        </IbisTable>
    );
};

export default GeneralTable;
