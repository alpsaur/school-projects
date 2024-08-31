"use client";

import React from 'react';
import { usePathname, useRouter } from "next/navigation";
import GeneralTable from '@/components/Table/GeneralTable';
import { IbisFileGroupSetting } from '@/API';

interface FileGroupSettingTableRow {
    id: string;
    NO: number;
    Name: string;
    Description: string;
}

export default function ListFileGroupSettingComponent({
    data,
}: {
    data: IbisFileGroupSetting[];
}) {
    const pathname = usePathname();
    const router = useRouter();

    const isFileGroupSettingEmpty = data.length === 0;

    const columnNames: string[] = ["NO", "Name", "Description"];
    const tableRows: FileGroupSettingTableRow[] = data.map((filegroupSetting, index) => {
        return {
            id: filegroupSetting.id,
            NO: index + 1,
            Name: filegroupSetting.name || "",
            Description: filegroupSetting.description || "",
        };
    });

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-center mt-2">
                <h1>File Group Settings</h1>
            </div>

            {isFileGroupSettingEmpty ? (
                <div className="flex justify-center items-center p-4 w-full">
                    No File Group Setting Data Found...
                </div>
            ) : (
                <div className="flex justify-center items-center p-4 w-full">
                    <GeneralTable<FileGroupSettingTableRow> columns={columnNames} rows={tableRows} pathname="filegroupsetting" />
                </div>
            )}

            <div>
                <div className="flex justify-center items-center p-4 w-full">
                    <label className="text-center bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer hover:bg-blue-700 focus:outline-none focus:shadow-outline w-full">
                        <button
                            onClick={() => {
                                router.push(pathname + "/create");
                            }}
                        >
                            Create File Group Setting
                        </button>
                    </label>
                </div>
            </div>
        </div>
    );
}
