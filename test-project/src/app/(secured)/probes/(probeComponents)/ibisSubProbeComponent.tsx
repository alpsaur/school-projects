"use client";

import React, { useEffect, useState } from "react";
import { CreateParameterInput, CreateSubProbeInput } from "@/API";
import IbisInputBar from "@/components/IbisComponent/IbisInputBar";
import { v4 as uuidv4 } from 'uuid';
import IbisParameterComponent from "./ibisParameterComponent";
import { createFlag, deleteFlag, updateFlag } from "@/ibisTypes";
import { IbisAccordian } from "@/components/IbisComponent";

interface SubProbeDetailProrps {
  saveSubProbeDatas: (updateIndex: number, inputSubProbeDatas: CreateSubProbeInput) => void;
  index: number;
  subProbeDataFromParent: CreateSubProbeInput;
  relatedParameterData: CreateParameterInput[];
  removeSubprobe: (indexToDelete: number) => void;
  isReadOnly?: boolean;
}

interface subProbeInputBarSetting {
  labelName: string;
  attributeName: string;
  value?: string | number;
  type: 'text' | 'number' | 'checkbox';
  required?: boolean;
  checkFlag?: number;
  checkboxLabel?: string;
  readonly?: boolean;
}

const IbisSubProbeComponent: React.FC<SubProbeDetailProrps> = ({
  saveSubProbeDatas,
  index,
  subProbeDataFromParent,
  relatedParameterData,
  removeSubprobe,
  isReadOnly,
}) => {
  const [subProbeData, setSubProbeData] = useState<CreateSubProbeInput>(subProbeDataFromParent);
  const [visibility, setVisibility] = useState<boolean>(subProbeDataFromParent.isVisible as boolean);

  const [relatedParameters, setRelatedParameters] = useState<CreateParameterInput[]>(relatedParameterData);

  const [addParameterValid, setAddParameterValid] = useState<boolean>(true);

  const newParameterData: CreateParameterInput = {
    id: createFlag + uuidv4(),
    name: "",
    value: 10,
    type: "",
    minThreshold: 10,
    maxThreshold: 10,
    unit: "",
    valueType: "",
    isIncludedValue: true,
    ownerId: subProbeDataFromParent.ownerId,
    subProbeId: subProbeDataFromParent.id,
  }

  const subProbeInputBarSettingsEntities: subProbeInputBarSetting[] = [
    {
      labelName: "SubProbe Name:",
      attributeName: "name",
      value: subProbeData.name || "",
      type: 'text',
      required: true,
      readonly: isReadOnly,
    },
    {
      labelName: "SubProbe Description:",
      attributeName: "description",
      value: subProbeData.description || "",
      type: 'text',
      required: true,
      readonly: isReadOnly,
    },
    {
      labelName: "SubProbe Visbility:",
      attributeName: "isVisible",
      checkFlag: visibility === true ? 0 : 1,
      type: 'checkbox',
      checkboxLabel: "Yes|No",
      readonly: isReadOnly,
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const newSubProbeData = { ...subProbeData, [name]: value };
    setSubProbeData(newSubProbeData);
    // console.log("UPDATED SUBPROBE: ", newSubProbeData);
    saveSubProbeDatas(index, newSubProbeData);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const [fieldName, checkboxLabel] = name.split('*');
    let newValue = true;
    if (fieldName === "isVisible") {
      newValue = visibility;
      if (checkboxLabel === "0" && checked === true) {
        setVisibility(true);
        newValue = true;
      }
      else if (checkboxLabel === "1" && checked === true) {
        setVisibility(false);
        newValue = false;
      }
    }
    const newSubProbeData = { ...subProbeData, [fieldName]: newValue };
    setSubProbeData(newSubProbeData);
    console.log("UPDATED SUBPROBE: ", newSubProbeData);
    saveSubProbeDatas(index, newSubProbeData);
  };

  const handleParameterSave = (inputParameterData: CreateParameterInput, updateIndex: number) => {
    const newDataArray = [...relatedParameters];

    const paramId = inputParameterData.id as string;
    let newId = paramId;

    if (!paramId.startsWith(createFlag) && !paramId.startsWith(updateFlag) && !paramId.startsWith(deleteFlag)) {
      newId = updateFlag + paramId;
    }

    newDataArray[updateIndex] = { ...inputParameterData, id: newId };
    const newSubProbeData: CreateSubProbeInput = { ...subProbeData, parameters: newDataArray };

    setRelatedParameters(newDataArray);
    setSubProbeData(newSubProbeData);
    saveSubProbeDatas(index, newSubProbeData);

    checkAddButtonValid(newDataArray);
  };

  const handleAddParameter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newDataArray = [...relatedParameters, newParameterData];
    const newSubProbeData: CreateSubProbeInput = { ...subProbeData, parameters: newDataArray };

    setRelatedParameters(newDataArray);
    setSubProbeData(newSubProbeData);
    saveSubProbeDatas(index, newSubProbeData);

    setAddParameterValid(false);
  };

  const handleDeleteParameter = (indexToDelete: number) => {
    const paramToDelete: CreateParameterInput = relatedParameters[indexToDelete];
    const deleteId = paramToDelete.id as string;

    if (deleteId.startsWith(createFlag)) {
      let updatedParameters = [...relatedParameters];
      updatedParameters.splice(indexToDelete, 1);

      setRelatedParameters(updatedParameters);
      checkAddButtonValid(updatedParameters);
    }
    else {
      const [_, oriId] = deleteId.split("|");
      const deleteParameter: CreateParameterInput = { ...paramToDelete, id: deleteFlag + oriId };
      const updatedParameterArray: CreateParameterInput[] = relatedParameters.map((param) => {
        if (param.id === deleteId) {
          return deleteParameter;
        }
        else {
          return param;
        }
      });

      setRelatedParameters(updatedParameterArray);
      checkAddButtonValid(updatedParameterArray);
    }
  };

  const checkAddButtonValid = (parameterDatasFromChildren: CreateParameterInput[]) => {
    let valid_flag = true;
    for (const eachParameterData of parameterDatasFromChildren) {
      const { name, unit, valueType, type } = eachParameterData;
      const isParameterValid = !!name && !!unit && !!valueType && !!type;
      if (isParameterValid === false) {
        valid_flag = false;
        break;
      }
    }
    setAddParameterValid(valid_flag);
  };

  const handleRemoveSubprobeBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    removeSubprobe(index);
  }

  return (
    <div>
      {/* subprobe data create form */}
      {subProbeInputBarSettingsEntities.map((subProbeSettingEntity) => {
        const isCheckbox = subProbeSettingEntity.type === 'checkbox';
        return (
          <div key={subProbeSettingEntity.attributeName}>
            {isCheckbox ? (
              <IbisInputBar
                labelName={subProbeSettingEntity.labelName}
                attributeName={subProbeSettingEntity.attributeName}
                type={subProbeSettingEntity.type}
                onChange={handleCheckboxChange}
                checkFlag={subProbeSettingEntity.checkFlag}
                readonly={isReadOnly}
              />
            ) : (
              <IbisInputBar
                labelName={subProbeSettingEntity.labelName}
                attributeName={subProbeSettingEntity.attributeName}
                type={subProbeSettingEntity.type}
                onChange={handleInputChange}
                value={subProbeSettingEntity.value}
                required={subProbeSettingEntity.required}
                readonly={isReadOnly}
              />
            )}
          </div>
        );
      })}

      {/* button to add a new parameter of this subprobe */}
      <div className="w-4/5">
        <button
          onClick={handleAddParameter}
          disabled={isReadOnly || !addParameterValid}
          className={`bg-blue-400 hover:bg-blue-800 w-full text-white font-bold py-2 px-4 rounded cursor-pointer disabled:bg-gray-400`}
        >
          Add New Parameter
        </button>
      </div>

      {/* related parameters data create forms */}
      {relatedParameters.map((parameterData, index) => {
        const isExsit = !(parameterData.id?.startsWith(deleteFlag));
        const displayName = parameterData.name ? parameterData.name : "New Parameter";
        return (
          <div key={parameterData.id} className='w-4/5 my-2'>
            {isExsit && (
              <IbisAccordian
                title={displayName}
                isAccordianOpenDefault={true}
                className={"bg-white hover:bg-indigo-50"}
              >
                <IbisParameterComponent
                  saveParameters={handleParameterSave}
                  parameterDatafromSubComp={parameterData}
                  index={index}
                  deleteParameter={handleDeleteParameter}
                  isReadOnly={isReadOnly}
                />
              </IbisAccordian>
            )}
          </div>
        );
      })}

      {/* button to remove this subprobe... */}
      <div className="object-right flex justify-end" >
        <button
          onClick={handleRemoveSubprobeBtn}
          disabled={isReadOnly}
          className={`bg-red-400 hover:bg-red-800 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500`}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default IbisSubProbeComponent;