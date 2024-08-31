"use client"

import { CreateProbeGroupInput } from "@/API";
import IbisInputBar from "@/components/IbisComponent/IbisInputBar";
import React, { useState } from "react";

interface ProbeGroupInfoProps {
    probeGroupInfoFromParent: CreateProbeGroupInput;
    saveProbeGroupInfo: (inputProbeGroupInfoData: CreateProbeGroupInput) => void;
}

interface probeGroupInfoInputSetting {
    labelName: string;
    attributeName: string;
    value?: string;
    required?: boolean;
    type: 'text' | 'checkbox';
    checkFlag?: number;
    checkLabel?: string;
}

const IbisProbeGroupInfoComponent: React.FC<ProbeGroupInfoProps> = ({
    probeGroupInfoFromParent,
    saveProbeGroupInfo
}) => {
    const [probeGroupInfo, setProbeGroupInfo] = useState<CreateProbeGroupInput>(probeGroupInfoFromParent);
    const [visbility, setVisbility] = useState<boolean>(probeGroupInfoFromParent.isPublic as boolean);
    const [probegrouptype, setProbegrouptype] = useState<number>(probeGroupInfoFromParent.type ? (probeGroupInfoFromParent.type === 'MATCH' ? 0 : (probeGroupInfoFromParent.type === 'PROBE' ? 1 : 2)) : 0);

    const probeGroupInfoInputSettingEntities: probeGroupInfoInputSetting[] = [
        {
            labelName: "Probe Group RefNo: ",
            attributeName: "refNo",
            value: probeGroupInfo.refNo || "",
            required: true,
            type: 'text',
        },
        {
            labelName: "Probe Group Name: ",
            attributeName: "name",
            value: probeGroupInfo.name || "",
            required: true,
            type: 'text',
        },
        {
            labelName: "Probe Group Description: ",
            attributeName: "description",
            value: probeGroupInfo.description || "",
            required: true,
            type: 'text',
        },
        {
            labelName: "Probe Group Visbility: ",
            attributeName: "isPublic",
            checkFlag: visbility === true ? 0 : 1,
            type: 'checkbox',
            checkLabel: "Yes|No",
        },
        {
            labelName: "Probe Group Type: ",
            attributeName: "type",
            checkFlag: probegrouptype,
            type: 'checkbox',
            checkLabel: "MATCH|PROBE|PROGRESS",
        }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const newProbeGroupInfoData = { ...probeGroupInfo, [name]: value };
        setProbeGroupInfo(newProbeGroupInfoData);
        saveProbeGroupInfo(newProbeGroupInfoData);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        const [fieldName, checkboxLabel] = name.split('*');
        let newValue = 0;

        if (fieldName === "isPublic") {
            newValue = visbility === true ? 0 : 1;
        }
        if (fieldName === "type") {
            newValue = probegrouptype;
        }

        if (checkboxLabel === "0" && checked === true) {
            newValue = 0;
        }
        if (checkboxLabel === "1" && checked === true) {
            newValue = 1;
        }
        if (checkboxLabel === "2" && checked === true) {
            newValue = 2;
        }

        let newProbeGroupInfoData: CreateProbeGroupInput = probeGroupInfo;

        if (fieldName === "isPublic") {
            setVisbility(newValue === 0);
            newProbeGroupInfoData = { ...probeGroupInfo, [fieldName]: newValue === 0 };
        }
        if (fieldName === "type") {
            setProbegrouptype(newValue);
            newProbeGroupInfoData = { ...probeGroupInfo, [fieldName]: newValue === 0 ? "MATCH" : (newValue === 1) ? "PROBE" : "PROGRESS" };
        }

        setProbeGroupInfo(newProbeGroupInfoData);
        saveProbeGroupInfo(newProbeGroupInfoData);
    };

    return (
        <div>
            {/* probe group info input form */}
            {probeGroupInfoInputSettingEntities.map((probeGroupInfoInputSettingEntity) => {
                const isCheckbox = probeGroupInfoInputSettingEntity.type === 'checkbox';
                return (
                    <div key={probeGroupInfoInputSettingEntity.attributeName}>
                        {isCheckbox ? (
                            <IbisInputBar
                                labelName={probeGroupInfoInputSettingEntity.labelName}
                                attributeName={probeGroupInfoInputSettingEntity.attributeName}
                                type={probeGroupInfoInputSettingEntity.type}
                                onChange={handleCheckboxChange}
                                checkFlag={probeGroupInfoInputSettingEntity.checkFlag}
                                checkboxLabel={probeGroupInfoInputSettingEntity.checkLabel}
                            />
                        ) : (
                            <IbisInputBar
                                labelName={probeGroupInfoInputSettingEntity.labelName}
                                attributeName={probeGroupInfoInputSettingEntity.attributeName}
                                type={probeGroupInfoInputSettingEntity.type}
                                onChange={handleInputChange}
                                value={probeGroupInfoInputSettingEntity.value}
                                required={probeGroupInfoInputSettingEntity.required}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default IbisProbeGroupInfoComponent;