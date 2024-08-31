"use client";

import { IbisProbe } from '@/API';
import SelectTable from '@/components/Table/SelectTable';
import React, { useEffect, useState } from 'react';

interface SelectProbeProps {
    selectedProbeIdsFromParent: string[];
    probeDataFromParent: IbisProbe[];
    saveSelectedProbeIds: (selectedProbeIds: string[]) => void;
    initSelectedProbeData: IbisProbe[];
    probegroupType: string;
}

interface ProbeTableRow {
    id: string;
    NO: number;
    Name: string;
    Description: string;
    Type: string;
}

function convertToRowFormatData(inputData: IbisProbe[], type: string): ProbeTableRow[] {
    const filteredProbeData: IbisProbe[] = inputData.filter(p => p.type === type);
    const rowFormatData: ProbeTableRow[] = filteredProbeData.map((probe, index) => ({
        id: probe.id,
        NO: index + 1,
        Name: probe.name || "",
        Description: probe.description || "",
        Type: probe.type || "",
    }));
    return rowFormatData;
}

/**
 * 
 * Need to change the display probe component to another format...
 * like sbcs expanded block ?
 */
const IbisSelectProbeComponent: React.FC<SelectProbeProps> = ({
    selectedProbeIdsFromParent,
    probeDataFromParent,
    saveSelectedProbeIds,
    initSelectedProbeData,
    probegroupType,
}) => {
    const [selectProbeIds, setSelectProbeIds] = useState<string[]>(selectedProbeIdsFromParent);

    const [selectedProbeDatas, setSelectedProbeDatas] = useState<IbisProbe[]>(initSelectedProbeData);
    const [selectedProbeRows, setSelectedProbeRows] = useState<ProbeTableRow[]>(convertToRowFormatData(initSelectedProbeData, probegroupType));

    const probeColumnName: string[] = ["NO", "Name", "Description", "Type"];

    const unSelectedProbeDatas: IbisProbe[] = probeDataFromParent.filter(
        probe => !initSelectedProbeData.some(selectedProbe => selectedProbe.id === probe.id)
    );
    const [listProbeRows, setListProbeRow] = useState<ProbeTableRow[]>(convertToRowFormatData(unSelectedProbeDatas, probegroupType));

    useEffect(() => {
        setSelectProbeIds(selectedProbeIdsFromParent);
        setSelectedProbeDatas(initSelectedProbeData);
        setSelectedProbeRows(convertToRowFormatData(initSelectedProbeData, probegroupType));
        const unSelectedProbeDatas: IbisProbe[] = probeDataFromParent.filter(
            probe => !initSelectedProbeData.some(selectedProbe => selectedProbe.id === probe.id)
        );
        setListProbeRow(convertToRowFormatData(unSelectedProbeDatas, probegroupType))
    }, [probegroupType, initSelectedProbeData, selectedProbeIdsFromParent]);

    const handleSelectedProbeDisplay = (probeIdList: string[]) => {
        const newSelectedProbeData = probeIdList.map((probeId) => {
            return probeDataFromParent.find(d => d.id === probeId);
        }).filter((probeData): probeData is IbisProbe => Boolean(probeData));

        setSelectedProbeDatas(newSelectedProbeData);
        setSelectedProbeRows(convertToRowFormatData(newSelectedProbeData, probegroupType));
    }

    const handleAddProbeButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        const buttonId = e.currentTarget.getAttribute("id") || "";
        const [_, probeId] = buttonId.split('|');

        if (probeId) {
            const exsitId = selectProbeIds.find(d => d === probeId);
            if (exsitId) return;

            const newSelectedProbeIds = [...selectProbeIds, probeId];
            setSelectProbeIds(newSelectedProbeIds);
            saveSelectedProbeIds(newSelectedProbeIds);
            handleSelectedProbeDisplay(newSelectedProbeIds);

            const newUnSelectedProbes: IbisProbe[] = probeDataFromParent.filter(
                probe => !newSelectedProbeIds.some(selectedId => selectedId === probe.id)
            );
            setListProbeRow(convertToRowFormatData(newUnSelectedProbes, probegroupType));
        }
    };

    const handleRemoveProbeButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        const buttonId = e.currentTarget.getAttribute("id") || "";
        const [_, probeId] = buttonId.split('|');

        if (probeId) {
            const updatedProbeIds = selectProbeIds.filter((id) => id !== probeId);
            setSelectProbeIds(updatedProbeIds);
            saveSelectedProbeIds(updatedProbeIds);
            handleSelectedProbeDisplay(updatedProbeIds);

            const newUnSelectedProbes: IbisProbe[] = probeDataFromParent.filter(
                probe => !updatedProbeIds.some(selectedId => selectedId === probe.id)
            );
            setListProbeRow(convertToRowFormatData(newUnSelectedProbes, probegroupType));
        }
    };

    return (
        <>
            {/* Selected Probes Display ... */}
            <div>
                <p>Selected Probes: </p>
                <SelectTable<ProbeTableRow> columns={probeColumnName} rows={selectedProbeRows} operation='Remove' handleClick={handleRemoveProbeButton}></SelectTable>
            </div>

            {/* Probes List that Can be Selected ... */}
            <div>
                <p>Probes List: </p>
                {/* may be a search bar can be added here ... ? */}
                <SelectTable<ProbeTableRow> columns={probeColumnName} rows={listProbeRows} operation='Add' handleClick={handleAddProbeButton}></SelectTable>
            </div>

        </>
    );
};

export default IbisSelectProbeComponent;