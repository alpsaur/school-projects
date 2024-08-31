"use client";
import React from "react";
import { IbisFileCategory } from "@/API";
import { usePathname, useRouter } from "next/navigation";
import GeneralTable from "@/components/Table/GeneralTable";

interface CategoryTableRow {
  id: string;
  NO: number;
  Name: string;
  Description: string;
  AcceptableExtensions: string[];
}

export default function ListFileCategoryComponent({
  data,
}: {
  data: IbisFileCategory[];
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isFileCategoryEmpty = data.length === 0;

  const columnNames: string[] = [
    "NO",
    "Name",
    "Description",
    "AcceptableExtensions",
  ];
  const tableRows: CategoryTableRow[] = data.map((category, index) => {
    return {
      id: category.id,
      NO: index + 1,
      Name: category.name || "",
      Description: category.description || "",
      AcceptableExtensions: category.acceptableExtensions || [],
    };
  });

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-center mt-2">
        <h1>File Categories</h1>
      </div>

      {isFileCategoryEmpty ? (
        <div className="flex justify-center items-center p-4 w-full">
          No File Category Data Found...
        </div>
      ) : (
        <div className="flex justify-center items-center p-4 w-full">
          <GeneralTable<CategoryTableRow>
            columns={columnNames}
            rows={tableRows}
            pathname="filecategory"
          />
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
              Create File Category
            </button>
          </label>
        </div>
      </div>
    </div>
  );
}
