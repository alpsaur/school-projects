"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  CreateParameterInput,
  CreateProbeInput,
  CreateSubProbeInput,
  IbisFileGroupSetting,
  UpdateProbeInput,
} from "@/API";
import { v4 as uuidv4 } from "uuid";
import IbisProbeComponent from "./ibisProbeComponent";
import IbisSubProbeComponent from "./ibisSubProbeComponent";
import { createFlag, deleteFlag, updateFlag } from "@/ibisTypes";
import { IbisAccordian } from "@/components/IbisComponent";
import { IbisLoadingBtn } from "@/components/IbisComponent/IbisLoadingBtn";

interface ProbeDetailProps {
  fileGroupsFromServer: IbisFileGroupSetting[];
  initialProbeInput: CreateProbeInput | UpdateProbeInput;
  handleProbeSubmitFunction: (
    submitProbeData: CreateProbeInput | UpdateProbeInput
  ) => Promise<void>;
  finalBtnText: string;
  isReadOnly?: boolean;
  isCreate: boolean;
}

const IbisProbesDetailComponent: React.FC<ProbeDetailProps> = ({
  fileGroupsFromServer,
  initialProbeInput,
  handleProbeSubmitFunction,
  finalBtnText,
  isReadOnly,
  isCreate,
}) => {
  if (!isCreate) {
  }
  // Set the default display data based on the pass-in data from server component...
  const [probeData, setProbeData] = useState<
    CreateProbeInput | UpdateProbeInput
  >(initialProbeInput);
  const [subProbeDatas, setSubProbeDatas] = useState<CreateSubProbeInput[]>(
    initialProbeInput.subprobes as CreateSubProbeInput[]
  );

  const initDataValid: boolean = finalBtnText === "Save Changes";
  const [probeDataValid, setProbeDataValid] = useState<boolean>(initDataValid);
  const [subProbeDatasValid, setSubProbeDatasValid] =
    useState<boolean>(initDataValid);

  const [finalSubmitValid, setFinalSubmitValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const newSubProbeData: CreateSubProbeInput = {
    id: createFlag + uuidv4(),
    name: "",
    description: "",
    isVisible: true,
    ownerId: initialProbeInput.ownerId,
    probeId: initialProbeInput.id,
    parameters: [],
  };

  // Handle the input datas validation ...
  function handleProbeDataValid(probeDataFromChildren: CreateProbeInput) {
    const { name, description, url, fileGroupSettingId, type } =
      probeDataFromChildren;
    console.log(
      `The Probe Data from Child is ${name}, ${description}, ${url}, ${fileGroupSettingId}, ${type}`
    );
    const isProbeDataValid =
      !!name && !!description && !!url && !!fileGroupSettingId && !!type;
    setProbeDataValid(isProbeDataValid);

    console.log("The Probe Data Valid: ", isProbeDataValid);

    const isFinalValid =
      isProbeDataValid === true && subProbeDatasValid === true;
    setFinalSubmitValid(isFinalValid);
  }

  function handleSubProbeDatasValid(
    subprobeDatasFromChildren: CreateSubProbeInput[]
  ): void {
    let valid_flag = true;
    for (const eachSubProbeData of subprobeDatasFromChildren) {
      if (eachSubProbeData.id?.startsWith(deleteFlag)) {
        continue;
      }
      const subprobeInput = eachSubProbeData;
      const parameterInputs =
        eachSubProbeData.parameters as CreateParameterInput[];

      // check the subprobe data valid or not
      const { name, description } = subprobeInput;
      valid_flag = !!name && !!description;
      if (valid_flag === false) {
        break;
      }

      // if have parameters
      if (parameterInputs.length > 0) {
        for (const eachParameterData of parameterInputs) {
          if (eachParameterData.id?.startsWith(deleteFlag)) {
            continue;
          }
          const { name, unit, valueType, type } = eachParameterData;
          valid_flag = !!name && !!unit && !!valueType && !!type;
          if (valid_flag === false) {
            break;
          }
        }
      }

      if (valid_flag === false) {
        break;
      }
    }
    setSubProbeDatasValid(valid_flag);

    console.log("The SubProbe Data Valid: ", valid_flag);

    const isFinalValid = probeDataValid === true && valid_flag === true;
    setFinalSubmitValid(isFinalValid);
  }

  // Handle Data change in children components...
  function handleProbeSaveButton(inputProbeData: CreateProbeInput): void {
    const isProbeUpdated: boolean =
      inputProbeData.name === initialProbeInput.name &&
      inputProbeData.description === initialProbeInput.description &&
      inputProbeData.url === initialProbeInput.url &&
      inputProbeData.type === initialProbeInput.type &&
      inputProbeData.fileGroupSettingId ===
        initialProbeInput.fileGroupSettingId &&
      inputProbeData.isPublic === initialProbeInput.isPublic;

    if (isProbeUpdated) {
      const inputId = inputProbeData.id as string;
      const newprobeId =
        inputId.startsWith(createFlag) || inputId.startsWith(updateFlag)
          ? inputId
          : updateFlag + inputId;
      const updateFinalProbeData: CreateProbeInput = {
        ...inputProbeData,
        id: newprobeId,
      };
      setProbeData(updateFinalProbeData);
    } else {
      const noUpdataProbeData: CreateProbeInput = {
        ...inputProbeData,
        id: inputProbeData.id,
      };
      setProbeData(noUpdataProbeData);
    }

    handleProbeDataValid(inputProbeData);
  }

  function handleSubProbeSaveButton(
    updateIndex: number,
    inputSubProbeDatas: CreateSubProbeInput
  ): void {
    const newDataArray = [...subProbeDatas];

    let finalSetInputDatas: CreateSubProbeInput = inputSubProbeDatas;
    const updateId = inputSubProbeDatas.id as string;
    // console.log("The Updated subprobe id is:", updateId);

    // data in database
    if (
      !updateId.startsWith(createFlag) &&
      !updateId.startsWith(updateFlag) &&
      !updateId.startsWith(deleteFlag)
    ) {
      finalSetInputDatas = { ...inputSubProbeDatas, id: updateFlag + updateId };
    }

    newDataArray[updateIndex] = finalSetInputDatas;
    console.log("---Currently, the updated subprobe is ", finalSetInputDatas);
    setSubProbeDatas(newDataArray);
    setProbeData({ ...probeData, subprobes: newDataArray });

    handleSubProbeDatasValid(newDataArray);
  }

  // Handle the add/remove Subprobe Operation ...
  function handleAddSubProbe(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    const newSubProbeDataArray = [...subProbeDatas, newSubProbeData];
    setSubProbeDatas(newSubProbeDataArray);
    setProbeData({ ...probeData, subprobes: newSubProbeDataArray });
    handleSubProbeDatasValid(newSubProbeDataArray);
  }

  function handleDeleteSubProbe(indexToDelete: number): void {
    const deleteSubProbe = subProbeDatas[indexToDelete];
    const deleteId = deleteSubProbe.id as string;

    // not saved to database data ...
    if (deleteId?.startsWith(createFlag)) {
      if (subProbeDatas.length === 1) {
        setSubProbeDatas([newSubProbeData]);
        setProbeData({ ...probeData, subprobes: [newSubProbeData] });
      } else {
        let updatedSubProbeDatas = [...subProbeDatas];
        updatedSubProbeDatas.splice(indexToDelete, 1);
        setSubProbeDatas(updatedSubProbeDatas);
        setProbeData({ ...probeData, subprobes: updatedSubProbeDatas });
      }
    } else {
      const [_, oriId] = deleteId.split("|");
      const updatedSubProbe: CreateSubProbeInput = {
        ...deleteSubProbe,
        id: deleteFlag + oriId,
      };

      const updatedSubProbeDatas: CreateSubProbeInput[] = subProbeDatas.map(
        (subprobe) => {
          if (subprobe.id === deleteId) {
            return updatedSubProbe;
          } else {
            return subprobe;
          }
        }
      );
      setSubProbeDatas(updatedSubProbeDatas);
      setProbeData({ ...probeData, subprobes: updatedSubProbeDatas });
    }
  }

  // Call Server-side Component ...

  async function handleFinalSubmitButton(
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    e.preventDefault();
    setFinalSubmitValid(false); // ? avoid multiple submission ... ?
    setIsLoading(true);
    await handleProbeSubmitFunction(probeData as UpdateProbeInput);
  }

  return (
    <div className="flex flex-col items-center w-full p-5">
      <div className="contents p-5 w-full items-center">
        {/* back to list page button */}
        <Link
          href={"/probes"}
          className="w-4/5"
          onClick={() => {
            console.log("Click!");
          }}
        >
          <div
            className={`bg-blue-400 hover:bg-blue-800 text-white w-full h-6 font-bold rounded text-center`}
          >
            Back to Probes List Page
          </div>
        </Link>

        {/* Probe Detail Component */}
        <div className="bg-white p-5 w-4/5 mt-2 mb-2 rounded-lg border-2 border-cyan-700">
          <h1>Probe Detail</h1>
          <IbisProbeComponent
            initProbeData={probeData as CreateProbeInput}
            saveProbeData={handleProbeSaveButton}
            fileGroupSettingData={fileGroupsFromServer}
            isReadOnly={isReadOnly}
          />
        </div>

        {/* button to add a new subprobe of this probe */}
        <div className="w-4/5">
          <button
            onClick={handleAddSubProbe}
            disabled={isReadOnly}
            className={`bg-blue-400 hover:bg-blue-800 text-white w-full font-bold py-2 px-4 rounded disabled:bg-gray-500`}
          >
            Add New SubProbe
          </button>
        </div>

        {/* SubProbe Detail Component */}
        <div className="w-4/5 p-2 mt-2 mb-2 bg-white rounded-lg border-2 border-cyan-700">
          {subProbeDatas.map((subprobeData, index) => {
            const relatedParameters =
              subprobeData.parameters as CreateParameterInput[];
            const isExsit = !subprobeData.id?.startsWith(deleteFlag);
            const displayName = subprobeData.name
              ? subprobeData.name
              : "New SubProbe";
            return (
              <div key={subprobeData.id} className="m-2">
                {isExsit && (
                  <IbisAccordian
                    title={displayName}
                    isAccordianOpenDefault={true}
                  >
                    <IbisSubProbeComponent
                      saveSubProbeDatas={handleSubProbeSaveButton}
                      index={index}
                      subProbeDataFromParent={subprobeData}
                      relatedParameterData={relatedParameters}
                      removeSubprobe={handleDeleteSubProbe}
                      isReadOnly={isReadOnly}
                    />
                  </IbisAccordian>
                )}
              </div>
            );
          })}
        </div>

        {/* Final submit button... */}
        <div className="w-4/5">
          <IbisLoadingBtn
            onclick={handleFinalSubmitButton}
            disabled={!finalSubmitValid || isReadOnly}
            btnText={finalBtnText}
            color={"green"}
          />
        </div>
      </div>
    </div>
  );
};

export default IbisProbesDetailComponent;
