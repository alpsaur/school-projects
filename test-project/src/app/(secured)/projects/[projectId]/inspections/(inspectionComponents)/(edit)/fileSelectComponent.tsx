"use client";
import { IbisFileCombination, IbisFile } from "@/API";
import SelectTable from "@/components/Table/SelectTable";
import React, { useEffect, useState } from "react";

interface SelectCheckFilesProps {
  checkFileNeeded: IbisFileCombination;
  fileDataOfNeededTypeFromParent: IbisFile[];
  initSelectedFileIds: string[];
  initSelectedFileDatas: IbisFile[];
  prefixId: string;
  saveSelectedFiles: (newSelctedFileIds: string[]) => void;
  isReadOnly: boolean;
}

interface CheckFileTableRow {
  id: string;
  NO: number;
  Name: string;
  Description: string;
  CreatedOn: string;
}

function convertToRowFormatData(
  inputData: IbisFile[],
  prefix: string,
  filetype: string
): CheckFileTableRow[] {
  const rowFormatData: CheckFileTableRow[] = inputData
    .map((file, index) => {
      // if (file.fileCategory?.id !== filetype) return null;
      return {
        id: prefix + "#" + file.id,
        NO: index + 1,
        Name: file.name,
        Description: file.description || "",
        CreatedOn: file.createdOn || "",
      };
    })
    .filter((rowdata): rowdata is CheckFileTableRow => Boolean(rowdata));
  return rowFormatData;
}

const IbisFileSelectComponent: React.FC<SelectCheckFilesProps> = ({
  checkFileNeeded,
  fileDataOfNeededTypeFromParent,
  initSelectedFileIds,
  initSelectedFileDatas,
  prefixId,
  saveSelectedFiles,
  isReadOnly,
}) => {
  const [selectedFileIds, setSelectedFileIds] =
    useState<string[]>(initSelectedFileIds); // this contains all the selected file, not only this type needed...

  // console.log("The CheckFileNeeded from parent is: ", checkFileNeeded);

  const initSelctedFileRows: CheckFileTableRow[] = convertToRowFormatData(
    initSelectedFileDatas,
    prefixId,
    checkFileNeeded.category?.id as string
  );
  const [selectedFileRows, setSelectedFileRows] =
    useState<CheckFileTableRow[]>(initSelctedFileRows);
  const [addBtnDisabled, setAddBtnDisabled] = useState<boolean>(
    initSelctedFileRows.length === checkFileNeeded.quantity
  ); // check the number matched only related to this type ...

  const fileColumnName: string[] = ["NO", "Name", "Description", "CreatedOn"];

  const unSelectedFileData: IbisFile[] = fileDataOfNeededTypeFromParent.filter(
    (file) =>
      !initSelectedFileDatas.some((selectedFile) => selectedFile.id === file.id)
  );
  const [listFileRows, setListFileRows] = useState<CheckFileTableRow[]>(
    convertToRowFormatData(
      unSelectedFileData,
      prefixId,
      checkFileNeeded.category?.id as string
    )
  );

  useEffect(() => {
    setSelectedFileIds(initSelectedFileIds);
    setSelectedFileRows(
      convertToRowFormatData(
        initSelectedFileDatas,
        prefixId,
        checkFileNeeded.category?.id as string
      )
    );
  }, [initSelectedFileIds, initSelectedFileDatas]);

  function handleSelectedFileDisplay(fileIdList: string[]): void {
    const newSelectedFileDatas: IbisFile[] = fileIdList
      .map((fileid) => {
        return fileDataOfNeededTypeFromParent.find((d) => d.id === fileid);
      })
      .filter((fileData): fileData is IbisFile => Boolean(fileData));

    const newSelectedFileRows = convertToRowFormatData(
      newSelectedFileDatas,
      prefixId,
      checkFileNeeded.category?.id as string
    );
    setSelectedFileRows(newSelectedFileRows);
    setAddBtnDisabled(newSelectedFileRows.length === checkFileNeeded.quantity);
  }

  function handleFileSelectionAdd(
    e: React.MouseEvent<HTMLButtonElement>
  ): void {
    const btnId: string = e.currentTarget.getAttribute("id") || "";
    const [_, selectFileId] = btnId.split("#");

    if (selectFileId) {
      const exsitId = selectedFileIds.find((d) => d === selectFileId);
      if (exsitId) return;

      const newSelectedFileIds: string[] = [...selectedFileIds, selectFileId];
      setSelectedFileIds(newSelectedFileIds);
      saveSelectedFiles(newSelectedFileIds);
      handleSelectedFileDisplay(newSelectedFileIds);

      const newUnSelectedFiles: IbisFile[] =
        fileDataOfNeededTypeFromParent.filter(
          (file) =>
            !newSelectedFileIds.some((selectedId) => selectedId === file.id)
        );
      setListFileRows(
        convertToRowFormatData(
          newUnSelectedFiles,
          prefixId,
          checkFileNeeded.category?.id as string
        )
      );
    }
  }

  function handleFileSelectionRemove(
    e: React.MouseEvent<HTMLButtonElement>
  ): void {
    const btnId: string = e.currentTarget.getAttribute("id") || "";
    const [_, selectFileId] = btnId.split("#");

    if (selectFileId) {
      const updatedFileIds = selectedFileIds.filter(
        (id) => id !== selectFileId
      );
      setSelectedFileIds(updatedFileIds);
      saveSelectedFiles(updatedFileIds);
      handleSelectedFileDisplay(updatedFileIds);

      const newUnSelectedFiles: IbisFile[] =
        fileDataOfNeededTypeFromParent.filter(
          (file) => !updatedFileIds.some((selectedId) => selectedId === file.id)
        );
      setListFileRows(
        convertToRowFormatData(
          newUnSelectedFiles,
          prefixId,
          checkFileNeeded.category?.id as string
        )
      );
    }
  }

  return (
    <div>
      {/* Selected Files ... */}
      <div>
        <div className="text-indigo-500 font-bold">
          <p>
            Selected {(checkFileNeeded.name as string).toUpperCase()} Files:{" "}
          </p>
        </div>
        <SelectTable<CheckFileTableRow>
          columns={fileColumnName}
          rows={selectedFileRows}
          operation="Remove"
          handleClick={handleFileSelectionRemove}
          btnDisabled={isReadOnly}
        ></SelectTable>
      </div>

      {/* Files can be selected ... */}
      <div>
        <div className="text-indigo-500 font-bold">
          <p>
            Please Select {checkFileNeeded.quantity}{" "}
            {(checkFileNeeded.name as string).toUpperCase()} Files:{" "}
          </p>
        </div>
        <SelectTable<CheckFileTableRow>
          columns={fileColumnName}
          rows={listFileRows}
          operation="Add"
          handleClick={handleFileSelectionAdd}
          btnDisabled={addBtnDisabled || isReadOnly}
        ></SelectTable>
      </div>
    </div>
  );
};

export default IbisFileSelectComponent;
