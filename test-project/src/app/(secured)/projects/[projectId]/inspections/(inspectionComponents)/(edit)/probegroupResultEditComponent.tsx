"use client";
import { CreateProbeGroupResultInput, CreateProbeResultInput, IbisFileCombination, IbisFile, IbisProbe, IbisProbeGroup } from '@/API';
import React, { useState } from 'react';
import IbisProbeResultEditComponent from './probeResultEditComponent';
import { createFlag, deleteFlag, updateFlag } from '@/ibisTypes';
import { IbisAccordian } from '@/components/IbisComponent';
import { IbisLoadingBtn } from '@/components/IbisComponent/IbisLoadingBtn';

interface ProbeGroupResultEditProps {
    probegroupsInfoFromParent: IbisProbeGroup[]; // used for selection ...
    fileInfoFromParent: IbisFile[]; // used for selection ...
    initSelectedProbeGroupId: string;
    initProbeGroupResultData: CreateProbeGroupResultInput;
    saveProbeGroupResult: (inputProbeGroupResultData: CreateProbeGroupResultInput) => void; // not save to database ...
    saveSingleProbeGroupResultToDB: (submittedProbeGroupResultData: CreateProbeGroupResultInput) => Promise<void>;
    removeProbeGroupResult: (removedProbeGroupResultData: CreateProbeGroupResultInput) => void;
    isReadOnly: boolean;
}

const IbisProbeGroupResultEditComponent: React.FC<ProbeGroupResultEditProps> = ({
    probegroupsInfoFromParent,
    fileInfoFromParent,
    initSelectedProbeGroupId,
    initProbeGroupResultData,
    saveProbeGroupResult,
    saveSingleProbeGroupResultToDB,
    removeProbeGroupResult,
    isReadOnly,
}) => {
    // used for select probe group block
    const [inputProbeGroupResultData, setInputProbeGroupResultData] = useState<CreateProbeGroupResultInput>(initProbeGroupResultData);
    const [saveProbeGroupSelectionBtn, setSaveProbeGroupSelectionBtn] = useState<boolean>(false);
    const [selectedProbeGroupId, setSelectedProbeGroupId] = useState<string>(initSelectedProbeGroupId);
    const [isProbeGroupSelected, setIsProbeGroupSelected] = useState<boolean>(initSelectedProbeGroupId !== "");

    // used for the select checkfile combination blocks ...
    const initSelectedProbeGroupData = probegroupsInfoFromParent.find((probegroup) => probegroup.id === initSelectedProbeGroupId);
    const [probeDatas, setProbeDatas] = useState<IbisProbe[]>(initSelectedProbeGroupData ? initSelectedProbeGroupData.probes as IbisProbe[] : []);

    // used for save probe group result to database ...
    const [btnText, setBtnText] = useState<string>("Save");
    const [isProbeGroupResultsValid, setIsProbeGroupResultsValid] = useState<boolean>(!isReadOnly);

    // only save this probegroup result to database ...
    async function handleProbeGroupResultSubmit(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        e.preventDefault();
        setBtnText("Saving ...");
        // call server-side function to save this probegroupresult to database ... ?
        await saveSingleProbeGroupResultToDB(inputProbeGroupResultData);

        setBtnText("Saved");
    }

    // remove this probegroup result ... [not implemented yet]
    function handleProbeGroupResultRemove(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();
        removeProbeGroupResult(inputProbeGroupResultData);
    }

    // For select probegroup process ...
    function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        const { value } = e.target;
        const probeGroupId = value as string;
        setSelectedProbeGroupId(probeGroupId);
        if (probeGroupId !== "") {
            if (probeGroupId === inputProbeGroupResultData.id) return; // not change actually ... 
            setSaveProbeGroupSelectionBtn(true);
            setIsProbeGroupResultsValid(false);
        }
    }

    function handleProbeGroupSelectionSave(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();

        setSaveProbeGroupSelectionBtn(false);
        setIsProbeGroupSelected(true);

        const selectedProbeGroup: IbisProbeGroup | undefined = probegroupsInfoFromParent.find((d) => d.id === selectedProbeGroupId);
        if (selectedProbeGroup !== undefined) {
            const newProbeResultDataArray: CreateProbeResultInput[] = [];
            let newProbeGroupResultId = inputProbeGroupResultData.id as string;

            // which means this is the existed & not updated probegroupresult ...
            if (!newProbeGroupResultId.startsWith(createFlag) && !newProbeGroupResultId.startsWith(updateFlag)) {
                newProbeGroupResultId = updateFlag + newProbeGroupResultId;
            }

            const updatedInputProbeGroupResultData: CreateProbeGroupResultInput = {
                ...inputProbeGroupResultData,
                probeGroupId: selectedProbeGroupId,
                probeResults: newProbeResultDataArray,
                id: newProbeGroupResultId,
            };
            setInputProbeGroupResultData(updatedInputProbeGroupResultData);
            setProbeDatas(selectedProbeGroup.probes as IbisProbe[]);
            saveProbeGroupResult(updatedInputProbeGroupResultData);
            setIsProbeGroupResultsValid(true);
            return;
        }
    }

    // for the children components ...
    function handleAddProbeResult(newProbeResult: CreateProbeResultInput): void {
        const oriProbeResultsArray: CreateProbeResultInput[] = inputProbeGroupResultData.probeResults as CreateProbeResultInput[];
        const newProbeResultsArray: CreateProbeResultInput[] = [...oriProbeResultsArray, newProbeResult];

        let newProbeGroupResultId = inputProbeGroupResultData.id as string;

        // which means this is the existed & not updated probegroupresult ...
        if (!newProbeGroupResultId.startsWith(createFlag) && !newProbeGroupResultId.startsWith(updateFlag)) {
            newProbeGroupResultId = updateFlag + newProbeGroupResultId;
        }

        const updatedInputProbeGroupResultData: CreateProbeGroupResultInput = { ...inputProbeGroupResultData, probeResults: newProbeResultsArray, id: newProbeGroupResultId };
        setInputProbeGroupResultData(updatedInputProbeGroupResultData);
        // console.log("PGR-handleAddProbeResult: ", JSON.stringify(updatedInputProbeGroupResultData, null, 2));
        saveProbeGroupResult(updatedInputProbeGroupResultData);
    }

    function handleRemoveProbeResult(removedProbeResult: CreateProbeResultInput): void {
        const oriProbeResultsArray = inputProbeGroupResultData.probeResults as CreateProbeResultInput[] || [];
        const removedOriId = removedProbeResult.id?.startsWith(deleteFlag) ? removedProbeResult.id.split("|")[1] : removedProbeResult.id as string;
        const updatedProbeResultsArray = oriProbeResultsArray.map((pr) => {
            if (pr.id === removedOriId) {
                if (removedOriId.startsWith(createFlag)) {
                    return null;
                }
                else {
                    return removedProbeResult;
                }
            }
            else {
                return pr;
            }
        }).filter((data): data is CreateProbeResultInput => Boolean(data));

        let newProbeGroupResultId = inputProbeGroupResultData.id as string;

        // which means this is the existed & not updated probegroupresult ...
        if (!newProbeGroupResultId.startsWith(createFlag) && !newProbeGroupResultId.startsWith(updateFlag)) {
            newProbeGroupResultId = updateFlag + newProbeGroupResultId;
        }

        const updatedInputProbeGroupResultData: CreateProbeGroupResultInput = { ...inputProbeGroupResultData, probeResults: updatedProbeResultsArray, id: newProbeGroupResultId };
        setInputProbeGroupResultData(updatedInputProbeGroupResultData);
        saveProbeGroupResult(updatedInputProbeGroupResultData);
    }

    function handleProbeResultChange(inputProbeResultData: CreateProbeResultInput): void {
        let inputId = inputProbeResultData.id as string;
        if (inputId.startsWith(updateFlag) || inputId.startsWith(createFlag) || inputId.startsWith(deleteFlag)) {
            inputId = inputId.split("|")[1];
        }
        const updatedProbeResults: CreateProbeResultInput[] = inputProbeGroupResultData.probeResults?.map((proberesult) => {
            let oriProbeResultId = proberesult.id as string;
            if (oriProbeResultId.startsWith(createFlag) || oriProbeResultId.startsWith(updateFlag) || oriProbeResultId.startsWith(deleteFlag)) {
                oriProbeResultId = oriProbeResultId.split("|")[1];
            }
            if (oriProbeResultId === inputId) {
                return inputProbeResultData;
            }
            else {
                return proberesult;
            }
        }) as CreateProbeResultInput[] || [];

        let newProbeGroupResultId = inputProbeGroupResultData.id as string;

        // which means this is the existed & not updated probegroupresult ...
        if (!newProbeGroupResultId.startsWith(createFlag) && !newProbeGroupResultId.startsWith(updateFlag)) {
            newProbeGroupResultId = updateFlag + newProbeGroupResultId;
        }

        const updatedInputProbeGroupResultData: CreateProbeGroupResultInput = { ...inputProbeGroupResultData, probeResults: updatedProbeResults, id: newProbeGroupResultId };
        setInputProbeGroupResultData(updatedInputProbeGroupResultData);
        saveProbeGroupResult(updatedInputProbeGroupResultData);
        console.log("PGR - The sent saved probergroupresult is: ", JSON.stringify(updatedInputProbeGroupResultData, null, 2));
        setBtnText("Save");
    }

    return (
        <div className='bg-white w-full mt-1 mb-1 rounded-lg border-2 border-cyan-700'>
            {/* Header && Remove Button ... */}
            <div className='bg-blue-400 w-full flex rounded-tl-lg rounded-tr-lg h-10'>
                <div className='text-white w-4/5 items-center flex font-bold pl-5'>
                    <p>Probe Group Result</p>
                </div>
                {/* <div className='w-1/5'>
                    <button
                        className='w-full bg-red-500 hover:bg-red-900 text-white font-bold py-2 px-4 rounded'
                        onClick={handleProbeGroupResultRemove}
                    >
                        Remove
                    </button>
                </div> */}
            </div>

            <div className='w-full px-2'>
                {/* Select Probe Group Drop-down Bar ... */}
                <div className="flex bg-white w-full mt-2 mb-2 rounded-lg p-5">
                    {/* Selection Drop-down Bar && Save Selection Button ...  */}
                    <div className="text-left flex-1">
                        <p>Select Probe Group: </p>
                    </div>
                    <div className="flex-1">
                        <select
                            value={selectedProbeGroupId}
                            onChange={handleSelectChange}
                            required
                            disabled={isReadOnly}
                        >
                            <option disabled value="">
                                Select the Probe Group for Inspection ...
                            </option>
                            {probegroupsInfoFromParent.map((probegroup) => (
                                <option key={probegroup.id} value={probegroup.id || ""}>
                                    {`${probegroup.name as string} - ${probegroup.description as string}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='flex-1 w-4/5'>
                        <button
                            className={`w-full bg-green-400 hover:bg-green-900 text-white font-bold py-2 px-4 rounded ${saveProbeGroupSelectionBtn ? 'cursor-pointer' : 'disabled:bg-gray-400 cursor-not-allowed'}`}
                            disabled={!saveProbeGroupSelectionBtn}
                            onClick={handleProbeGroupSelectionSave}
                        >
                            Select
                        </button>
                    </div>
                </div>

                {/* Probe Result Blocks Based On the Selected Probe Group ... */}
                {isProbeGroupSelected && (
                    <div className='bg-white p-1 w-full mt-2 mb-2 rounded-lg'>
                        {probeDatas.map((probe) => {
                            const filegroupForThisProbe = probe.fileGroupSetting;
                            const fileSelectTypeAndAmt: IbisFileCombination[] = filegroupForThisProbe?.fileCombinations ? filegroupForThisProbe.fileCombinations as IbisFileCombination[] : [];
                            const filteredProbeResults = inputProbeGroupResultData.probeResults?.filter(data => data?.probeId === probe.id);
                            const proberesultsForThisProbe: CreateProbeResultInput[] = filteredProbeResults ? filteredProbeResults as CreateProbeResultInput[] : [];
                            const displayName = probe.refNo ? probe.refNo : 'TYPE_ERROR_AVOID';

                            return (
                                <div key={initProbeGroupResultData.id + "@" + probe.id} className='my-1'>
                                    <IbisAccordian
                                        title={displayName}
                                        isAccordianOpenDefault={true}
                                    >
                                        <IbisProbeResultEditComponent
                                            probegroupResultId={inputProbeGroupResultData.id || "TYPE_ERROR_AVOID"}
                                            fileDataFromParent={fileInfoFromParent}
                                            probeInfoDataFromParent={probe}
                                            proberesultsDataFromParent={proberesultsForThisProbe}
                                            analysisNeededCheckFiles={fileSelectTypeAndAmt}
                                            saveAddProbeResult={handleAddProbeResult}
                                            saveRemoveProbeResult={handleRemoveProbeResult}
                                            saveProbeResultChange={handleProbeResultChange}
                                            isReadOnly={isReadOnly}
                                        />
                                    </IbisAccordian>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ProbeGroupResults submit button... */}
                <div className='w-full flex mb-2'>
                    <IbisLoadingBtn 
                        color={"green"}
                        disabled={!isProbeGroupResultsValid}
                        onclick={handleProbeGroupResultSubmit}
                        btnText={btnText}
                    />
                </div>
            </div>
        </div>
    );
};

export default IbisProbeGroupResultEditComponent;