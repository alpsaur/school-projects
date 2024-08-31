"use client";
import {
  CreateProbeResultInput,
  IbisFileCombination,
  IbisFile,
  IbisProbe,
} from "@/API";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IbisFileCombinationComponent } from "./fileCombinationComponent";
import { createFlag, deleteFlag, updateFlag } from "@/ibisTypes";
import { IbisAccordian } from "@/components/IbisComponent";

interface ProbeResultEditProps {
  probegroupResultId: string;
  fileDataFromParent: IbisFile[];
  probeInfoDataFromParent: IbisProbe;
  proberesultsDataFromParent: CreateProbeResultInput[];
  analysisNeededCheckFiles: IbisFileCombination[];
  saveAddProbeResult: (newProbeResult: CreateProbeResultInput) => void;
  saveRemoveProbeResult: (removedProbeResult: CreateProbeResultInput) => void;
  saveProbeResultChange: (inputProbeResultData: CreateProbeResultInput) => void;
  isReadOnly: boolean;
}

function checkProbeResultValid(
  proberesults: CreateProbeResultInput[],
  neededFiles: IbisFileCombination[],
  fileRefData: IbisFile[]
): boolean {
  // if no probe result for this probe, can add file combination ...
  if (proberesults.length === 0) return true;

  let totalFileNeededNum = 0;
  for (const eachTypeFile of neededFiles) {
    totalFileNeededNum += eachTypeFile.quantity || 0;
  }

  for (const eachResult of proberesults) {
    const proberesultId = eachResult.id;
    if (proberesultId === null || proberesultId === undefined) continue;

    // it is the deleted probe result, no need to check ...
    if (proberesultId.startsWith(deleteFlag)) continue;

    const selectedFileArray = eachResult.inputFileIds;

    // if this proberesult is not-valid, the add btn should be inactive ...
    if (selectedFileArray === null || selectedFileArray === undefined)
      return false;

    const removeNullSelectedFileArray = selectedFileArray as string[];
    const selectedFilesData = removeNullSelectedFileArray.map((fid) => {
      return fileRefData.find((file) => file.id === fid);
    }) as IbisFile[];

    // roughly check the total selected files number equals the total needed number or not ...
    if (selectedFilesData.length !== totalFileNeededNum) return false;

    for (const eachTypeFile of neededFiles) {
      //   const filetype = eachTypeFile.category?.id;
      const selectedFilesInType = selectedFilesData;
      //   const selectedFilesInType = selectedFilesData.filter(
      //     (file) => file.fileCategory?.id === filetype
      //   );

      // This type file still need to select more ...
      if (selectedFilesInType.length !== eachTypeFile.quantity) {
        // console.log(`The ${filetype} file number not matched ...`);
        return false;
      }
    }
  }

  return true;
}

const IbisProbeResultEditComponent: React.FC<ProbeResultEditProps> = ({
  probegroupResultId,
  fileDataFromParent,
  probeInfoDataFromParent,
  proberesultsDataFromParent,
  analysisNeededCheckFiles,
  saveAddProbeResult,
  saveRemoveProbeResult,
  saveProbeResultChange,
  isReadOnly,
}) => {
  const [probeResultDatas, setProbeResultDatas] = useState<
    CreateProbeResultInput[]
  >(proberesultsDataFromParent);
  const [isAddBtnAvailiable, setIsAddBtnAvailiable] = useState<boolean>(
    isReadOnly
      ? false
      : checkProbeResultValid(
          proberesultsDataFromParent,
          analysisNeededCheckFiles,
          fileDataFromParent
        )
  );

  // Only for display ...
  let fileNeedRequireString = "";
  for (const eachTypeFile of analysisNeededCheckFiles) {
    // console.log("EachTypeFileRequire: ", JSON.stringify(eachTypeFile, null, 2));
    fileNeedRequireString +=
      "[" +
      eachTypeFile.name +
      ":" +
      (eachTypeFile.quantity || 0).toString() +
      "] ";
  }

  function handleSelectedFileSave(
    newselectfileIds: string[],
    proberesultid: string
  ) {
    let updateId = proberesultid;
    if (
      updateId.startsWith(createFlag) ||
      updateId.startsWith(updateFlag) ||
      updateId.startsWith(deleteFlag)
    ) {
      updateId = updateId.split("|")[1];
    }

    const newId = proberesultid.startsWith(createFlag)
      ? proberesultid
      : updateFlag + updateId;

    const updatedProbeResults: CreateProbeResultInput[] = probeResultDatas.map(
      (result) => {
        let oriId = result.id as string;
        if (
          oriId.startsWith(createFlag) ||
          oriId.startsWith(updateFlag) ||
          oriId.startsWith(deleteFlag)
        ) {
          oriId = oriId.split("|")[1];
        }
        if (oriId === updateId) {
          return {
            ...result,
            inputFileIds: newselectfileIds,
            id: newId,
          };
        } else {
          return result;
        }
      }
    );
    setProbeResultDatas(updatedProbeResults);

    const updatedProbeResult: CreateProbeResultInput | undefined =
      updatedProbeResults.find((res) => res.id === proberesultid);
    if (updatedProbeResult) {
      setIsAddBtnAvailiable(
        checkProbeResultValid(
          updatedProbeResults,
          analysisNeededCheckFiles,
          fileDataFromParent
        )
      );
      saveProbeResultChange(updatedProbeResult);
    }
  }

  // actually is to add a new probe result in this probegroupresult ...
  function handleAddCombinationBtn(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const newProbeResultInput: CreateProbeResultInput = {
      id: createFlag + uuidv4(),
      probeId: probeInfoDataFromParent.id,
      inputFileIds: [],
      probeGroupResultId: probegroupResultId,
      description: "",
      resultFileId: "",
    };
    saveAddProbeResult(newProbeResultInput);
    const updatedProbeResults: CreateProbeResultInput[] = [
      ...probeResultDatas,
      newProbeResultInput,
    ];
    setProbeResultDatas(updatedProbeResults);
    // console.log("Add new combination: ", JSON.stringify(updatedProbeResults, null, 2));
    setIsAddBtnAvailiable(
      checkProbeResultValid(
        updatedProbeResults,
        analysisNeededCheckFiles,
        fileDataFromParent
      )
    );
  }

  // remove a combination <=> remove a probe result ...
  function handleProbeResultRemove(proberesultid: string) {
    // console.log("Remove ProbeResult: ", proberesultid);

    const removedProbeResult: CreateProbeResultInput | undefined =
      probeResultDatas.find((pr) => pr.id === proberesultid);

    if (removedProbeResult === undefined) return; // will not happen actually ...

    // This ProbeResult has not save to database <=> it can be remove strictly ...
    if (proberesultid.startsWith(createFlag)) {
      // console.log("New created proberesult, can be removed directly ...");
      const updatedProbeResults: CreateProbeResultInput[] = probeResultDatas
        .map((result) => {
          if (result.id === proberesultid) {
            return null;
          } else {
            return result;
          }
        })
        .filter((data): data is CreateProbeResultInput => Boolean(data));
      setIsAddBtnAvailiable(
        checkProbeResultValid(
          updatedProbeResults,
          analysisNeededCheckFiles,
          fileDataFromParent
        )
      );
      setProbeResultDatas(updatedProbeResults);
      saveRemoveProbeResult(removedProbeResult);
      return;
    }

    // This ProbeResult already exsit in database <=> should call graphql when click save (hard work!!)
    const newProberesultId = deleteFlag + proberesultid;
    // console.log("Existed proberesult, should mark as DELETE: ", newProberesultId);
    const markedProberesult = { ...removedProbeResult, id: newProberesultId };
    // console.log("Marked ProbeResult is: ", markedProberesult);
    const updatedProbeResults: CreateProbeResultInput[] = probeResultDatas.map(
      (result) => {
        if (result.id === proberesultid) {
          return markedProberesult;
        } else {
          return result;
        }
      }
    );
    // console.log("The Updated ProbeResult Array is: ", JSON.stringify(updatedProbeResults, null, 2));
    setProbeResultDatas(updatedProbeResults);
    setIsAddBtnAvailiable(
      checkProbeResultValid(
        updatedProbeResults,
        analysisNeededCheckFiles,
        fileDataFromParent
      )
    );
    saveRemoveProbeResult(markedProberesult);
    return;
  }

  return (
    <div>
      {/* Probe Information ... */}
      <div className="w-full">
        <p>
          <span>Probe Name: </span>
          <span>{probeInfoDataFromParent.name}</span>
        </p>
        <p>
          <span>Probe Description: </span>
          <span>{probeInfoDataFromParent.description}</span>
        </p>
        <p>
          <span>Probe Check File Requires: </span>
          <span>{fileNeedRequireString}</span>
        </p>
      </div>

      {/* Button for add new checkFiles combinations ... */}
      <div className="w-full my-2">
        <button
          className={`w-full bg-green-400 hover:bg-green-900 text-white font-bold py-2 px-4 rounded ${
            isAddBtnAvailiable
              ? "cursor-pointer"
              : "disabled:bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isAddBtnAvailiable}
          onClick={handleAddCombinationBtn}
        >
          Add Check Files Combination
        </button>
      </div>

      {/* Select File to Do Probe Analysis ... */}
      {probeResultDatas.map((proberesult, index) => {
        const isExsit = proberesult.id
          ? !proberesult.id.startsWith(deleteFlag)
          : false;
        // console.log("The ProbeResult is:", JSON.stringify(proberesult, null, 2));

        return (
          <div
            key={proberesult.id}
            className="bg-white w-full rounded-lg mt-1 mb-1"
          >
            {isExsit && (
              <IbisAccordian
                title={`File Combination ${index + 1}`}
                isAccordianOpenDefault={true}
                className={
                  "bg-white hover:bg-slate-50 hover:border hover:border-cyan-600"
                }
              >
                <IbisFileCombinationComponent
                  proberesultId={proberesult.id || "AVOID-TYPE-ERROR"}
                  initselectedFileIds={
                    (proberesult.inputFileIds as string[]) || []
                  }
                  fileRefFromParent={fileDataFromParent}
                  checkFileNeeded={analysisNeededCheckFiles}
                  isReadOnly={isReadOnly}
                  index={index}
                  removeCombinationHandler={handleProbeResultRemove}
                  saveProbeResultChanges={handleSelectedFileSave}
                />
              </IbisAccordian>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default IbisProbeResultEditComponent;
