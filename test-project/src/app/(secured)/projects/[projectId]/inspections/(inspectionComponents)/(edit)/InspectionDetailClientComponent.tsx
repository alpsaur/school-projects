"use client";
import {
  CreateInspectionInput,
  ProbeTypeEnum,
  UpdateInspectionInput,
} from "@/API";
import IbisInputBar from "@/components/IbisComponent/IbisInputBar";
import { IbisLoadingBtn } from "@/components/IbisComponent/IbisLoadingBtn";
import Link from "next/link";
import React, { useEffect, useState } from "react";
interface CreateInspectionClientComponentProps {
  initialInspectionInput: CreateInspectionInput | UpdateInspectionInput;
  handleInspectionSaveFunction: (
    inputInspectionData: CreateInspectionInput | UpdateInspectionInput
  ) => Promise<void>;
  inspectionId?: string;
}
const checkboxLabelMapping = {
  0: ProbeTypeEnum.MATCH,
  1: ProbeTypeEnum.PROBE,
  2: ProbeTypeEnum.PROGRESS,
};

const getKeyByValue = (value: ProbeTypeEnum): number => {
  const key = Object.entries(checkboxLabelMapping).find(
    ([, enumValue]) => enumValue === value
  )?.[0];

  if (key === undefined) {
    throw new Error(`Value ${value} not found in checkboxLabelMapping.`);
  }

  return parseInt(key, 10);
};

const InspectionDetailClientComponent: React.FC<
  CreateInspectionClientComponentProps
> = ({
  initialInspectionInput,
  handleInspectionSaveFunction,
  inspectionId,
}) => {
  // 1. Pre-prep data
  const initialInspectionType = initialInspectionInput.type
    ? getKeyByValue(initialInspectionInput.type)
    : 0;
  const inspectionTypeCheckboxOptionLabel =
    ProbeTypeEnum.MATCH +
    "|" +
    ProbeTypeEnum.PROBE +
    "|" +
    ProbeTypeEnum.PROGRESS;
  const isCreate = inspectionId ? false : true;
  console.log("isCreate", isCreate);
  // 2. Set State
  const [inputInspectionData, setInputInspectionData] = useState<
    CreateInspectionInput | UpdateInspectionInput
  >(initialInspectionInput);
  const [isInspectionInputValid, setIsInspectionInputValid] =
    useState<boolean>(false);
  const [inspectionType, setInspectionType] = useState<number>(
    initialInspectionType
  );

  // Handling text inputs
  const handleInfoInputChangeV2 = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    console.log("name|value", name, value);
    setInputInspectionData({
      ...inputInspectionData,
      [name]: value, // Dynamically update based on the input's name
    });
  };

  function handleBasicSubmitValid(
    submitedInspectionInput: CreateInspectionInput | UpdateInspectionInput
  ): void {
    // check the basic info for the inspection ...
    let flag =
      !!submitedInspectionInput.name && !!submitedInspectionInput.refNo;
    setIsInspectionInputValid(flag);
  }

  // Track the updated state
  useEffect(() => {
    console.log("State updated:", inputInspectionData);
    handleBasicSubmitValid(inputInspectionData);
    // You can perform any action or return the updated state here
  }, [inputInspectionData]);

  const handleCheckboxChangeV2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const [fieldName, checkboxLabel] = name.split("*");

    if (fieldName === "type") {
      setInspectionType(parseInt(checkboxLabel, 10));
    }
    setInputInspectionData({
      ...inputInspectionData,
      [fieldName]:
        parseInt(checkboxLabel, 10) === 0
          ? ProbeTypeEnum.MATCH
          : parseInt(checkboxLabel, 10) === 1
          ? ProbeTypeEnum.PROBE
          : ProbeTypeEnum.PROGRESS, // Dynamically update based on the input's name
    });
  };

  async function handleInspectionSaveButton(
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    e.preventDefault();
    if (isCreate) {
      await handleInspectionSaveFunction(
        inputInspectionData as CreateInspectionInput
      );
    } else {
      await handleInspectionSaveFunction(
        inputInspectionData as UpdateInspectionInput
      );
    }
  }

  return (
    <>
      {/* back to list page button */}
      <Link
        href={`/projects/${initialInspectionInput.projectId}/inspections`}
        className="w-4/5"
      >
        <div
          className={`bg-blue-400 hover:bg-blue-800 text-white w-full h-6 font-bold rounded text-center`}
        >
          Return to Inspections
        </div>
      </Link>

      {/* Inspection Basic Info Form */}
      <div className="bg-white p-5 w-4/5 mt-2 mb-2 rounded-lg border-2 border-cyan-700">
        <h1>
          <u>Inspection Detail</u>
        </h1>
        <div>
          <IbisInputBar
            labelName={"Reference No: "}
            attributeName={"refNo"}
            onChange={handleInfoInputChangeV2}
            value={inputInspectionData.refNo ? inputInspectionData.refNo : ""}
            type="text"
            required={true}
            readonly={false}
          />
          <IbisInputBar
            labelName={"Inspection Name: "}
            attributeName={"name"}
            onChange={handleInfoInputChangeV2}
            value={inputInspectionData.name ? inputInspectionData.name : ""}
            type="text"
            required={true}
            readonly={false}
          />
          <IbisInputBar
            labelName={"Inspection Description: "}
            attributeName={"description"}
            onChange={handleInfoInputChangeV2}
            value={
              inputInspectionData.description
                ? inputInspectionData.description
                : ""
            }
            type="text"
            required={false}
            readonly={false}
          />
          <IbisInputBar
            labelName={"Inspection Type: "}
            attributeName={"type"}
            checkFlag={inspectionType}
            type="checkbox"
            checkboxLabel={inspectionTypeCheckboxOptionLabel}
            onChange={handleCheckboxChangeV2}
            readonly={false}
          />
        </div>
      </div>

      {/* Save Inspection Basic Info Btn */}
      <div className="w-4/5 flex">
        <IbisLoadingBtn
          disabled={!isInspectionInputValid}
          onclick={handleInspectionSaveButton}
          color={"green"}
        />
      </div>
    </>
  );
};

export default InspectionDetailClientComponent;
