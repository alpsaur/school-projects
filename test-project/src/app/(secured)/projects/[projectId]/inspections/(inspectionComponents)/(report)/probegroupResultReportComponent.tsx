"use client";
import { CreateProbeGroupInput, CreateProbeGroupResultInput, CreateProbeResultInput, IbisFile, IbisProbe } from '@/API';
import React, { useState } from 'react';
import IbisProbeResultReportComponent from './proberesultReportComponent';

interface ProbeGroupResultReportProps {
    probegroupresultDataFromServer: CreateProbeGroupResultInput;
    probegroupRefDataFromServer: CreateProbeGroupInput;
    probesRefDataFromServer: IbisProbe[];
    refFilesDataFromServer: IbisFile[];
}

const IbisProbeGroupResultReportComponent: React.FC<ProbeGroupResultReportProps> = ({
    probegroupresultDataFromServer,
    probegroupRefDataFromServer,
    probesRefDataFromServer,
    refFilesDataFromServer,
}) => {
    const rawProbeResultDatas = probegroupresultDataFromServer.probeResults;

    const probeResultDatas = rawProbeResultDatas ? rawProbeResultDatas as CreateProbeResultInput[] : [];

    return (
        <div className='bg-white px-5 py-3 w-full mt-2 mb-2 rounded-lg border-2 border-cyan-700'>
            <div className='w-full'>
                <h1 className='font-bold'>Probe Group Detail</h1>
                <p><span className='font-bold'>Probe Group Name: </span><span>{probegroupRefDataFromServer.name}</span></p>
                <p><span className='font-bold'>Probe Group Description: </span><span>{probegroupRefDataFromServer.description}</span></p>
                {/* <p><span className='font-bold'>Probe Group Result: </span><span>{probegroupresultDataFromServer.probeGroupResultStatus}</span></p> */}
                {/* this result status is resultStatus: pass, failed, inProgress, noResult ... */}
            </div>

            {probeResultDatas && (
                <>
                    {probeResultDatas.map((proberesult) => {
                        const probeid = proberesult.probeId || "NOT-EXSIT";
                        const probeRefData = probesRefDataFromServer.find((probe) => probe.id === probeid);
                        const selectedFileIds: string[] = proberesult.inputFileIds ? proberesult.inputFileIds as string[] : [];
                        const fileRefDatas: IbisFile[] = selectedFileIds.map((fid) => {
                            return refFilesDataFromServer.find(reffile => reffile.id === fid);
                        }) as IbisFile[];
                        const resultFileRef: IbisFile = refFilesDataFromServer.find(file => file.id === proberesult.resultFileId) as IbisFile;
                        // console.log("probeResult",proberesult);
                        // console.log("resultFileRef",resultFileRef);
                        return (
                            <div key={probeid} className='w-full'>
                                {probeRefData && (
                                    <div className='bg-white px-5 py-2 w-full mt-2 mb-2 rounded-lg border-2 border-cyan-700' >
                                        <IbisProbeResultReportComponent
                                            proberesultFromParent={proberesult}
                                            fileDatasFromParent={fileRefDatas}
                                            probeRefDataFromParent={probeRefData}
                                            resultFileRef={resultFileRef}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
};

export default IbisProbeGroupResultReportComponent;