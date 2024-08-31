"use client";

import { useState } from "react";
import { CreateParameterInput } from "@/API";
import IbisInputBar from "@/components/IbisComponent/IbisInputBar";

interface ParameterDetailProps {
  saveParameters: (
    inputParameterDatas: CreateParameterInput,
    updateIndex: number
  ) => void;
  parameterDatafromSubComp: CreateParameterInput;
  index: number;
  deleteParameter: (indexToDelete: number) => void;
  isReadOnly?: boolean;
}

interface parameterInputBarSetting {
  labelName: string;
  attributeName: string;
  value?: string | number;
  type: "text" | "number" | "checkbox";
  required?: boolean;
  checkFlag?: number;
  checkboxLabel?: string;
}

const IbisParameterComponent: React.FC<ParameterDetailProps> = ({
  saveParameters,
  parameterDatafromSubComp,
  index,
  deleteParameter,
  isReadOnly,
}) => {
  const [parameterData, setParameterData] = useState<CreateParameterInput>(
    parameterDatafromSubComp
  );
  const [valueIncluded, setValueIncluded] = useState<boolean>(
    parameterDatafromSubComp.isIncludedValue as boolean
  );

  const parameterInputBarSettingsEntities: parameterInputBarSetting[] = [
    {
      labelName: "Parameter Name:",
      attributeName: "name",
      value: parameterData.name || "",
      type: "text",
      required: true,
    },
    {
      labelName: "Parameter Value:",
      attributeName: "value",
      value: parameterData.value || "",
      type: "number",
      required: true,
    },
    {
      labelName: "Parameter Type:",
      attributeName: "type",
      value: parameterData.type || "",
      type: "text",
      required: true,
    },
    {
      labelName: "Parameter Min Threshold:",
      attributeName: "minThreshold",
      value: parameterData.minThreshold || 0,
      type: "number",
      required: true,
    },
    {
      labelName: "Parameter Max Threshold:",
      attributeName: "maxThreshold",
      value: parameterData.maxThreshold || 0,
      type: "number",
      required: true,
    },
    {
      labelName: "Parameter Unit:",
      attributeName: "unit",
      value: parameterData.unit || "",
      type: "text",
      required: true,
    },
    {
      labelName: "Parameter Value Type:",
      attributeName: "valueType",
      value: parameterData.valueType || "",
      type: "text",
      required: true,
    },
    {
      labelName: "Parameter isIncludedValue: ",
      attributeName: "isIncludedValue",
      checkFlag: valueIncluded === true ? 0 : 1,
      type: "checkbox",
      checkboxLabel: "Yes|No",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (
      name === "value" ||
      name === "minThreshold" ||
      name === "maxThreshold"
    ) {
      const newParameterData = { ...parameterData, [name]: +value };
      setParameterData(newParameterData);
      saveParameters(newParameterData, index);
    } else {
      const newParameterData = { ...parameterData, [name]: value };
      setParameterData(newParameterData);
      saveParameters(newParameterData, index);
    }
  };

  // 0-Yes, 1-No
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const [fieldName, checkboxLabel] = name.split("*");
    let newValue = valueIncluded;
    if (checked && checkboxLabel === "0") {
      setValueIncluded(true);
      newValue = true;
    }
    if (checked && checkboxLabel === "1") {
      setValueIncluded(false);
      newValue = false;
    }

    console.log(`${fieldName} changed to value ${newValue}`);

    const newParameterData = { ...parameterData, [fieldName]: newValue };
    setParameterData(newParameterData);
    saveParameters(newParameterData, index);
  };

  const handleRemoveButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteParameter(index);
  };

  return (
    <>
      {parameterInputBarSettingsEntities.map((paramSettingEntity) => {
        const isCheckbox = paramSettingEntity.type === "checkbox";
        return (
          <div key={paramSettingEntity.attributeName}>
            {isCheckbox ? (
              <IbisInputBar
                labelName={paramSettingEntity.labelName}
                attributeName={paramSettingEntity.attributeName}
                type={paramSettingEntity.type}
                onChange={handleCheckboxChange}
                checkFlag={paramSettingEntity.checkFlag}
                readonly={isReadOnly}
              />
            ) : (
              <IbisInputBar
                labelName={paramSettingEntity.labelName}
                attributeName={paramSettingEntity.attributeName}
                type={paramSettingEntity.type}
                onChange={handleInputChange}
                value={paramSettingEntity.value}
                required={paramSettingEntity.required}
                readonly={isReadOnly}
              />
            )}
          </div>
        );
      })}

      {/* remove button for delete parameter */}
      <div className="object-right flex justify-end">
        <button
          onClick={handleRemoveButton}
          disabled={isReadOnly}
          className={`bg-red-400 hover:bg-red-900 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500`}
        >
          Remove
        </button>
      </div>
    </>
  );
};

export default IbisParameterComponent;
