"use client";

import React, { useState } from "react";
import { CreateProbeInput, IbisFileGroupSetting, ProbeTypeEnum } from "@/API";
import IbisInputBar from "@/components/IbisComponent/IbisInputBar";
import { IbisDropdown } from "@/components/IbisComponent";

interface ProbeDetailProps {
  initProbeData: CreateProbeInput;
  saveProbeData: (inputProbeData: CreateProbeInput) => void;
  fileGroupSettingData: IbisFileGroupSetting[];
  isReadOnly?: boolean;
}

interface probeInputBarSetting {
  labelName: string;
  attributeName: string;
  value?: string | number;
  type: "text" | "number" | "checkbox" | "textarea";
  required: boolean;
  checkFlag?: number;
  readonly?: boolean;
  checkboxLabel?: string;
}

const IbisProbeComponent: React.FC<ProbeDetailProps> = ({
  initProbeData,
  saveProbeData,
  fileGroupSettingData,
  isReadOnly,
}) => {
  const [inputProbeData, setInputProbeData] =
    useState<CreateProbeInput>(initProbeData);
  const [selectedFileGroupSetting, setSelectedFileGroupSetting] =
    useState<string>(initProbeData.fileGroupSettingId as string);
  const initProbeType = initProbeData.type as string;
  const [probeTypeFlag, setProbeTypeFlag] = useState<number>(
    initProbeType === "MATCH" ? 0 : initProbeType === "PROBE" ? 1 : 2
  );
  const [isPublic, setIsPublic] = useState<boolean>(
    initProbeData.isPublic as boolean
  );

  const probeInputBarSettingsEntities: probeInputBarSetting[] = [
    {
      labelName: "Probe RefNo",
      attributeName: "refNo",
      value: inputProbeData.refNo || "",
      type: "text",
      required: true,
      readonly: isReadOnly,
    },
    {
      labelName: "Probe Name",
      attributeName: "name",
      value: inputProbeData.name || "",
      type: "text",
      required: true,
      readonly: isReadOnly,
    },
    {
      labelName: "Probe Description",
      attributeName: "description",
      value: inputProbeData.description || "",
      type: "textarea",
      required: true,
      readonly: isReadOnly,
    },
    {
      labelName: "Probe Url",
      attributeName: "url",
      value: inputProbeData.url || "",
      type: "text",
      required: true,
      readonly: isReadOnly,
    },
    {
      labelName: "Probe Type",
      attributeName: "type",
      checkFlag: probeTypeFlag,
      type: "checkbox",
      required: true,
      checkboxLabel: "MATCH|PROBE|PROGRESS",
      readonly: isReadOnly,
    },
    {
      labelName: "Probe isPublic",
      attributeName: "isPublic",
      checkFlag: isPublic ? 0 : 1,
      type: "checkbox",
      required: true,
      readonly: isReadOnly,
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newInputProbeData = { ...inputProbeData, [name]: value };
    setInputProbeData(newInputProbeData);
    saveProbeData(newInputProbeData);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const newInputProbeData: CreateProbeInput = {
      ...inputProbeData,
      description: value,
    };
    setInputProbeData(newInputProbeData);
    saveProbeData(newInputProbeData);
  };

  // yes-analysis, no-match
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const [fieldName, checkboxLabel] = name.split("*");
    let newValue: string | boolean | null = null;
    if (fieldName === "type") {
      newValue =
        probeTypeFlag === 0
          ? ProbeTypeEnum.MATCH
          : probeTypeFlag === 1
          ? ProbeTypeEnum.PROBE
          : ProbeTypeEnum.PROGRESS;
    }
    if (fieldName === "isPublic") {
      newValue = isPublic;
    }

    if (checked && checkboxLabel === "0") {
      if (fieldName === "type") {
        setProbeTypeFlag(0);
        newValue = ProbeTypeEnum.MATCH;
      }
      if (fieldName === "isPublic") {
        setIsPublic(true);
        newValue = true;
      }
    }
    if (checked && checkboxLabel === "1") {
      if (fieldName === "type") {
        setProbeTypeFlag(1);
        newValue = ProbeTypeEnum.PROBE;
      }
      if (fieldName === "isPublic") {
        setIsPublic(false);
        newValue = false;
      }
    }
    if (checked && checkboxLabel === "2") {
      setProbeTypeFlag(2);
      newValue = ProbeTypeEnum.PROGRESS;
    }

    const newProbeData = { ...inputProbeData, [fieldName]: newValue };
    setInputProbeData(newProbeData);
    saveProbeData(newProbeData);
  };

  const options = fileGroupSettingData.map((fgs) => {
    const optionLabel = fgs.name as string;
    const combinations = fgs.fileCombinations;
    const displayCombination = combinations?.map((fc) => {
      const fcName = fc.name as string;
      const fcategory = fc.category?.name as string;
      const fcAmount = fc.quantity;
      return `${fcName}-[${fcategory}:${fcAmount}] `;
    });
    const optionValue = { ...fgs, fileCombinations: displayCombination };
    // delete optionValue.name;
    return { id: fgs.id, label: optionLabel, value: optionValue };
  });

  const handleDropDownChange = (id: string) => {
    console.log("Selected id: ", id);
    setSelectedFileGroupSetting(id); // Update selected file group ID
    const newInputProbeData: CreateProbeInput = {
      ...inputProbeData,
      fileGroupSettingId: id,
    };
    setInputProbeData(newInputProbeData);
    saveProbeData(newInputProbeData);
  };

  return (
    <div>
      {/* probe input bars based on the settings */}
      {probeInputBarSettingsEntities.map((settingEntity) => (
        <div key={settingEntity.attributeName} className="my-2">
          {settingEntity.type === "checkbox" ? (
            <IbisInputBar
              labelName={settingEntity.labelName}
              attributeName={settingEntity.attributeName}
              onChange={handleCheckboxChange}
              type={settingEntity.type}
              required={settingEntity.required}
              checkFlag={settingEntity.checkFlag}
              checkboxLabel={settingEntity.checkboxLabel}
              readonly={settingEntity.readonly}
            />
          ) : settingEntity.type === "textarea" ? (
            <IbisInputBar
              labelName={settingEntity.labelName}
              attributeName={settingEntity.attributeName}
              textAreaOnChange={handleTextareaChange}
              value={settingEntity.value}
              type={settingEntity.type}
              required={settingEntity.required}
              readonly={settingEntity.readonly}
            />
          ) : (
            <IbisInputBar
              labelName={settingEntity.labelName}
              attributeName={settingEntity.attributeName}
              onChange={handleInputChange}
              value={settingEntity.value}
              type={settingEntity.type}
              required={settingEntity.required}
              readonly={settingEntity.readonly}
            />
          )}
        </div>
      ))}

      <div className="flex my-2">
        <div className="text-left flex w-1/3">
          <p>Probe File Group Setting: </p>
        </div>
        <div className="flex w-2/3">
          <IbisDropdown
            options={options}
            onChange={handleDropDownChange}
            initialValue={selectedFileGroupSetting}
            disabled={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
};

export default IbisProbeComponent;
