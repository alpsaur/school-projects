"use client";
import { IbisFileCombination, IbisFile } from "@/API";
import React, { useState } from "react";
import IbisFileSelectComponent from "./fileSelectComponent";
import { IbisAccordian } from "@/components/IbisComponent";

interface FileCombinationProps {
  proberesultId: string;
  initselectedFileIds: string[];
  fileRefFromParent: IbisFile[];
  checkFileNeeded: IbisFileCombination[];
  isReadOnly: boolean;
  index: number;
  removeCombinationHandler: (proberesultid: string) => void;
  saveProbeResultChanges: (
    newselectfileIds: string[],
    proberesultid: string
  ) => void;
}

const IbisFileCombinationComponent: React.FC<FileCombinationProps> = ({
  proberesultId,
  initselectedFileIds,
  fileRefFromParent,
  checkFileNeeded,
  isReadOnly,
  index,
  removeCombinationHandler,
  saveProbeResultChanges,
}) => {
  const [selectedFileIds, setSelectedFileIds] =
    useState<string[]>(initselectedFileIds);

  const initSelectedFileDatas: IbisFile[] = initselectedFileIds.map((fid) => {
    return fileRefFromParent.find((file) => file.id === fid);
  }) as IbisFile[];
  const [selectedFileDatas, setSelectedFileDatas] = useState<IbisFile[]>(
    initSelectedFileDatas
  );

  function handleProbeResultRemove(
    e: React.MouseEvent<HTMLButtonElement>
  ): void {
    e.preventDefault();
    removeCombinationHandler(proberesultId);
  }

  function handleSelectedFileSave(newSelctedFileIds: string[]): void {
    setSelectedFileIds(newSelctedFileIds);

    const newfiledata: IbisFile[] = newSelctedFileIds.map((fid) => {
      return fileRefFromParent.find((file) => file.id === fid);
    }) as IbisFile[];
    setSelectedFileDatas(newfiledata);

    // console.log("Save add files: ", newSelctedFileIds, proberesultId);
    saveProbeResultChanges(newSelctedFileIds, proberesultId); // update the proberesult document ...
  }

  return (
    <>
      {/* Select Files Table seperated by File Type ... */}
      {checkFileNeeded.map((checkfile) => {
        const uid = proberesultId + "@" + checkfile.id;
        // const neededFileType = checkfile.category?.id;
        // const filteredFiles: IbisFile[] = fileRefFromParent.filter(
        //   (file) => file.fileCategory?.id === neededFileType
        // );
        const filteredFiles = fileRefFromParent;
        const displayName = `Select ${(
          checkfile.name as string
        ).toUpperCase()} File`;

        return (
          <div key={uid} className="bg-white w-full my-2">
            <IbisAccordian title={displayName} isAccordianOpenDefault={true}>
              <IbisFileSelectComponent
                checkFileNeeded={checkfile}
                fileDataOfNeededTypeFromParent={filteredFiles}
                initSelectedFileIds={selectedFileIds}
                initSelectedFileDatas={selectedFileDatas}
                prefixId={uid}
                isReadOnly={isReadOnly}
                saveSelectedFiles={handleSelectedFileSave}
              />
            </IbisAccordian>
          </div>
        );
      })}

      {/* The remove button ... */}
      <div className="w-full flex">
        <button
          className={`w-full bg-red-400 hover:bg-red-900 text-white font-bold py-2 px-4 rounded ${
            !isReadOnly
              ? "cursor-pointer"
              : "disabled:bg-gray-400 cursor-not-allowed"
          }`}
          disabled={isReadOnly}
          onClick={handleProbeResultRemove}
        >
          Remove
        </button>
      </div>
    </>
  );
};

export { IbisFileCombinationComponent };
