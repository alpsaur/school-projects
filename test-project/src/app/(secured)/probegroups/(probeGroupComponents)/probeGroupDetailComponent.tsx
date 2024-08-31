"use client";
import { CreateProbeGroupInput, IbisProbe } from '@/API';
import Link from 'next/link';
import React, { useState } from 'react';
import IbisProbeGroupInfoComponent from './probeGroupInfoComponent';
import IbisSelectProbeComponent from './selectProbeComponent';
import { IbisLoadingBtn } from '@/components/IbisComponent/IbisLoadingBtn';

interface ProbeGroupDetailProps {
    probeDataFromServer: IbisProbe[];
    probeGroupDataFromServer: CreateProbeGroupInput;
    finalSubmit: (inputSubmitData: CreateProbeGroupInput) => Promise<void>;
    buttonText: string;
}

const IbisProbeGroupDetailComponent: React.FC<ProbeGroupDetailProps> = ({
    probeDataFromServer,
    probeGroupDataFromServer,
    finalSubmit,
    buttonText,
}) => {
    const [inputProbeGroupData, setInputProbeGroupData] = useState<CreateProbeGroupInput>(probeGroupDataFromServer);
    const [finalSubmitValid, setFinalSubmitValid] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    console.log("The ProbeGroupData from Server: ", JSON.stringify(probeGroupDataFromServer, null, 2));

    const initProbeIds: string[] = probeGroupDataFromServer.probeIds || [];

    const [initSelectedProbeIds, setInitSelectedProbeIds] = useState<string[]>(initProbeIds);
    const [initSelectedProbeDatas, setInitSelectedProbeDatas] = useState<IbisProbe[]>(initProbeIds.map((probeId) => {
        return probeDataFromServer.find(d => d.id === probeId);
    }).filter((probeData): probeData is IbisProbe => Boolean(probeData)));


    const handleFinalSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log("Submit data: ", inputProbeGroupData);
        await finalSubmit(inputProbeGroupData);
    };

    const handleSubmitValid = (submitData: CreateProbeGroupInput) => {
        const valid_flag = !!submitData.name && !!submitData.description && Array.isArray(submitData.probeIds) && submitData.probeIds.length > 0;
        setFinalSubmitValid(valid_flag);
    };

    const handleProbeGroupInfoSave = (inputProbeGroupInfoData: CreateProbeGroupInput) => {
        let newProbeGroupData: CreateProbeGroupInput | null = null;

        if (inputProbeGroupInfoData.type !== inputProbeGroupData.type) {
            newProbeGroupData = {
                name: inputProbeGroupInfoData.name,
                description: inputProbeGroupInfoData.description,
                isPublic: inputProbeGroupInfoData.isPublic,
                ownerId: inputProbeGroupData.ownerId,
                probeIds: [],
                id: inputProbeGroupData.id,
                type: inputProbeGroupInfoData.type,
                refNo: inputProbeGroupInfoData.refNo,
            };
            setInitSelectedProbeIds([]);
            setInitSelectedProbeDatas([]);
        }
        else {
            newProbeGroupData = {
                name: inputProbeGroupInfoData.name,
                description: inputProbeGroupInfoData.description,
                isPublic: inputProbeGroupInfoData.isPublic,
                ownerId: inputProbeGroupData.ownerId,
                probeIds: inputProbeGroupData.probeIds,
                id: inputProbeGroupData.id,
                type: inputProbeGroupInfoData.type,
                refNo: inputProbeGroupInfoData.refNo,
            };
        }

        setInputProbeGroupData(newProbeGroupData);

        handleSubmitValid(newProbeGroupData);
    };

    const handleSelectedProbeIdsSave = (inputSelectedProbeIds: string[]) => {
        const newProbeGroupData: CreateProbeGroupInput = {
            ...inputProbeGroupData,
            probeIds: inputSelectedProbeIds,
        };
        setInputProbeGroupData(newProbeGroupData);
        handleSubmitValid(newProbeGroupData);
    };


    return (
        <div className="flex flex-col items-center w-full p-5">
            <div className="contents p-5 w-full items-center">
                {/* back to list page button ... */}
                <Link
                    href={"/probegroups"}
                    className='w-4/5'
                >
                    <div
                        className={`bg-blue-400 hover:bg-blue-800 text-white w-full h-6 font-bold rounded text-center`}
                    >
                        Back to Probe Groups List Page
                    </div>
                </Link>

                {/* Probe Group Info Detail Component ... */}
                <div className='bg-white p-5 w-4/5 mt-2 mb-2 rounded-lg border-2 border-cyan-700'>
                    <p>Probe Group Detail</p>
                    <IbisProbeGroupInfoComponent
                        probeGroupInfoFromParent={probeGroupDataFromServer}
                        saveProbeGroupInfo={handleProbeGroupInfoSave}
                    />
                </div>

                {/* Select Probes Component ... */}
                <div className='bg-white p-5 w-4/5 mt-2 mb-2 rounded-lg border-2 border-cyan-700'>
                    <IbisSelectProbeComponent
                        selectedProbeIdsFromParent={initSelectedProbeIds}
                        probeDataFromParent={probeDataFromServer}
                        saveSelectedProbeIds={handleSelectedProbeIdsSave}
                        initSelectedProbeData={initSelectedProbeDatas}
                        probegroupType={inputProbeGroupData.type as string}
                    />
                </div>

                {/* Final Submit Button ... */}
                <div className='w-4/5'>
                    <IbisLoadingBtn 
                        onclick={handleFinalSubmit}
                        disabled={!finalSubmitValid}
                        btnText={buttonText}
                        color={"green"}
                    />
                </div>
            </div>
        </div>
    );
};

export default IbisProbeGroupDetailComponent;