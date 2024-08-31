import IbisTable from "@/components/IbisComponent/IbisTable";
import IbisTableCell from "@/components/IbisComponent/IbisTableCell";
import IbisTableRow from "@/components/IbisComponent/IbisTableRow";
import React from "react";

interface SelectTableProps<T extends { id: string }> {
    columns: string[];
    rows: T[];
    operation: 'Add' | 'Remove';
    handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    btnDisabled?: boolean;
}

const SelectTable = <T extends { id: string }>({
    columns,
    rows,
    operation,
    handleClick,
    btnDisabled = false,
}: SelectTableProps<T>) => {
    const buttonColor = operation === 'Add' ? 'green' : 'red';
    const prefixChar = operation === 'Add' ? 'A' : 'R';

    return (
        <IbisTable>
            {/* Table Header */}
            <IbisTableRow>
                {columns.map((column) => {
                    let className = "";
                    if (column === "NO") {
                        className = "w-10 flex-none";
                    }
                    return (
                        <IbisTableCell isBold={true} key={column} className={className} >
                            {column}
                        </IbisTableCell>
                    )
                })}
                <IbisTableCell isBold={true} >
                    Operation
                </IbisTableCell>
            </IbisTableRow>

            {/* Table Body */}
            <div className={"overflow-auto max-h-60"}>
                {rows.map((row) => (
                    <IbisTableRow key={row.id} isBlueBackground={false} >
                        {columns.map((columnName) => {
                            let className = "";
                            if (columnName === "NO") {
                                className = "w-10 flex-none font-bold text-gray-500 bg-slate-300";
                            }
                            return (
                                <IbisTableCell key={columnName} className={className} >
                                    {String(row[columnName as keyof T])}
                                </IbisTableCell>
                            )
                        })}
                        <IbisTableCell>
                            <button
                                className={`${btnDisabled
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : `bg-${buttonColor}-400 hover:bg-${buttonColor}-900 text-white`
                                    } text-white font-bold px-4 h-8 rounded`}
                                onClick={handleClick}
                                id={prefixChar + "|" + row.id}
                                disabled={btnDisabled}
                            >
                                {operation}
                            </button>
                        </IbisTableCell>
                    </IbisTableRow>
                ))}
            </div>
        </IbisTable>
    );
};

export default SelectTable;