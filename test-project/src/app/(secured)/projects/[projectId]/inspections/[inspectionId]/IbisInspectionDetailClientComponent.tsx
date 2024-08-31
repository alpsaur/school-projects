"use client";
import {
  IbisProbe,
  IbisFile,
  CreateProbeGroupResultInput,
  IbisProbeGroup,
  CreateProbeResultInput,
  GetIbisInspectionQuery,
  IbisInspection,
  InspectionStatusEnum,
  UpdateInspectionInput,
} from "@/API";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InspectionDetailClientComponent from "../(inspectionComponents)/(edit)/InspectionDetailClientComponent";
import IbisProbeGroupResultEditComponent from "../(inspectionComponents)/(edit)/probegroupResultEditComponent";
import { probeAnalysisDataRequest } from "../_lib/formatDataToRequest";

import { Amplify } from "aws-amplify";
import config from "@/amplifyconfiguration.json";

Amplify.configure(config, { ssr: true });
import { generateClient } from "aws-amplify/api";
import { createFlag, deleteFlag, RequestPair, updateFlag } from "@/ibisTypes";
import { IbisLoadingBtn } from "@/components/IbisComponent/IbisLoadingBtn";
import { onUpdateIbisProbeResultStatus } from "@/graphql/subscriptions";

const client = generateClient();

const myapiUrl = "http://localhost:3000/api/inspection/submitTest"; // need to be changed later ... currently used this for testing ...

interface InspectionDetailEditProps {
  projectId: string;
  inspectionId: string;
  inspectionData: IbisInspection;
  inspectionQueryFromServer: GetIbisInspectionQuery;
  submitInspectionDetail: (
    inputInspectionData: UpdateInspectionInput
  ) => Promise<void>;
  probeGroupsData: IbisProbeGroup[];
  probesData: IbisProbe[];
  fileData: IbisFile[];
  initProbeGroupResultFromServer: CreateProbeGroupResultInput[];
  submitProbeGroupResultsData: (
    submitProbeGroupResultDatas: CreateProbeGroupResultInput[]
  ) => Promise<void>;
  saveSingleProbeGroupResultToDB: (
    submitProbeGroupResultData: CreateProbeGroupResultInput
  ) => Promise<void>;
  changeInspectionStatus: (
    inspectionId: string,
    inspectionStatus: InspectionStatusEnum
  ) => Promise<void>;
}

// only return the proberesult with valid checkfiles ...
function getValidProbeAnalysisRequest(
  rawData: CreateProbeGroupResultInput[],
  refProbeData: IbisProbe[],
  refFileData: IbisFile[]
): CreateProbeResultInput[] {
  let validProberesults: CreateProbeResultInput[] = []; // originally no valid results...

  for (const eachProbeGroupResult of rawData) {
    // Check does the probe group result exsit ...
    const probegroupresultId = eachProbeGroupResult.id;
    if (probegroupresultId === null || probegroupresultId === undefined) {
      continue;
    }

    // it means this probegroupresult not saving to database ... only the saved-to-database probegroupresult can be analysis i think ? ...
    if (
      probegroupresultId.startsWith(createFlag) ||
      probegroupresultId.startsWith(deleteFlag) ||
      probegroupresultId.startsWith(updateFlag)
    ) {
      continue;
    }

    // If this probegroupresult does not contains proberesults, no need to process this probegroupresult ...
    const proberesultsArray = eachProbeGroupResult.probeResults;
    if (proberesultsArray === null || proberesultsArray === undefined) {
      continue;
    }

    // Iterate each probe result ...
    for (const eachProbeResult of proberesultsArray) {
      // Check the probe id is valid ...
      const proberesultId = eachProbeResult.id;
      if (proberesultId === null || proberesultId === undefined) {
        continue;
      }

      // not saved data => should be saved before doing analysis ...
      if (
        proberesultId.startsWith(createFlag) ||
        proberesultId.startsWith(deleteFlag) ||
        proberesultId.startsWith(updateFlag)
      ) {
        continue;
      }

      const probeid = eachProbeResult.probeId;

      // Check whether this probe have selected files ...
      if (
        eachProbeResult.inputFileIds === undefined ||
        eachProbeResult.inputFileIds === null ||
        eachProbeResult.inputFileIds.length === 0
      )
        continue;

      if (probeid) {
        const probeInfo = refProbeData.find((d) => d.id === probeid);
        const fileInfos = eachProbeResult.inputFileIds.map((fileid) => {
          return refFileData.find((f) => f.id === fileid);
        }) as IbisFile[];

        // If can not found the related probe infomation in database, this probe result is not valid, no need to process (logically it will not happen)
        if (probeInfo === undefined) continue;

        const checkfileNeeded = probeInfo.fileGroupSetting?.fileCombinations;

        // If this probe does not contains checkfile required ...
        if (checkfileNeeded === null || checkfileNeeded === undefined) continue;

        let thisProbeCheckFileMatched = true;
        for (const eachTypeFileNeeded of checkfileNeeded) {
          // Avoid type error ...
          if (eachTypeFileNeeded === null) continue;
          const fileNeededSelected = fileInfos;
          // const fileNeededSelected = fileInfos.filter(
          //   (d) => d.fileCategory?.id === eachTypeFileNeeded.category?.id
          // );
          const isFileAmtMatched =
            eachTypeFileNeeded.quantity === fileNeededSelected.length;
          if (!isFileAmtMatched) {
            thisProbeCheckFileMatched = false;
          }
        }

        if (thisProbeCheckFileMatched) {
          validProberesults.push(eachProbeResult);
        }
      }
    }
  }

  return validProberesults;
}

function checkReportAvaliable(
  rawData: CreateProbeGroupResultInput[],
  refProbeData: IbisProbe[],
  refFileData: IbisFile[]
): boolean {
  const validProberesults = getValidProbeAnalysisRequest(
    rawData,
    refProbeData,
    refFileData
  );
  if (validProberesults.length === 0) return false;

  for (const eachValidResult of validProberesults) {
    if (
      eachValidResult.status !== null &&
      eachValidResult.status !== undefined
    ) {
      if (
        eachValidResult.status !== "CREATED" &&
        eachValidResult.status !== "DELETED" &&
        eachValidResult.status !== "ONGOING"
      )
        return true;
    }
  }

  return false;
}

const InspectionAnalysisClientComponent: React.FC<
  InspectionDetailEditProps
> = ({
  projectId,
  inspectionId,
  inspectionData,
  submitInspectionDetail,
  probeGroupsData,
  probesData,
  fileData,
  initProbeGroupResultFromServer,
  submitProbeGroupResultsData,
  saveSingleProbeGroupResultToDB,
  changeInspectionStatus,
}) => {
  const router = useRouter();

  // whether can add new probegroupresult ... if can add new probegroupresult, it also means can save all probegroupresults ...
  const [isProbeGroupResultsValid, setIsProbeGroupResultsValid] =
    useState<boolean>(false);

  const [inputProbeGroupResultDatas, setInputProbeGroupResultDatas] = useState<
    CreateProbeGroupResultInput[]
  >(initProbeGroupResultFromServer);

  // after start analysis, can not change the submitted data ... (need to consider, if some check failed, should all be editable or only failed one?)
  const [isReadOnly, setIsReadOnly] = useState<boolean>(
    !(inspectionData.status === InspectionStatusEnum.CREATED)
  );

  const [saveAllBtnText, setSaveAllBtnText] =
    useState<string>("Save All Changes");

  // control the display of the analysis button ...
  const [startAnalysisAvailable, setStartAnalysisAvailable] = useState<boolean>(
    getValidProbeAnalysisRequest(
      initProbeGroupResultFromServer,
      probesData,
      fileData
    ).length !== 0
  );
  const [analysisBtnText, setAnalysisBtnText] = useState<string>(
    inspectionData.status === InspectionStatusEnum.ONGOING
      ? "Stop Analysis"
      : "Start Analysis"
  );
  const [analysisBtnColor, setAnalysisBtnColor] = useState<string>(
    analysisBtnText === "Start Analysis" ? "green" : "red"
  );
  const [isAnalysisLoading, setIsAnalysisLoading] = useState<boolean>(false);

  // whether can view report page ...
  const [viewReportAvailable, setViewReportAvailable] = useState<boolean>(
    checkReportAvaliable(initProbeGroupResultFromServer, probesData, fileData)
  );

  // subscriptions
  const [mySubscriptions, setMySubscriptions] = useState<any[]>([]);
  const [subscriptionResults, setSubscriptionResults] = useState<boolean[]>([]);

  // check whether contains no selected probegroup ...
  function handleProbeGroupResultsValid(
    submittedProbeGroupResultDatas: CreateProbeGroupResultInput[]
  ): void {
    let probeGroupSelect_valid_flag = true;
    const probeGroupResultsData = submittedProbeGroupResultDatas;
    if (probeGroupResultsData.length === 0) {
      setIsProbeGroupResultsValid(false);
      return;
    }
    for (const probegroupResult of probeGroupResultsData) {
      if (probegroupResult === null) {
        setIsProbeGroupResultsValid(false);
        return;
      }
      // whether the probe group selected ...
      probeGroupSelect_valid_flag =
        probeGroupSelect_valid_flag && !!probegroupResult.probeGroupId;
      if (probeGroupSelect_valid_flag === false) {
        setIsProbeGroupResultsValid(false);
        return;
      }
    }

    // currently not consider each probe check selected file...
    setIsProbeGroupResultsValid(true);
    setStartAnalysisAvailable(
      getValidProbeAnalysisRequest(
        submittedProbeGroupResultDatas,
        probesData,
        fileData
      ).length !== 0
    );
  }

  // add a new probegroup result ... [not implemented yet]
  function handleAddProbeGroupResult(
    e: React.MouseEvent<HTMLButtonElement>
  ): void {
    e.preventDefault();

    // not implemented yet ...
    // console.log("Click Add ProbeGroupResult Button !!");
  }

  // remove an exsited probegroup result ... [not implemented yet]
  function handleRemoveProbeGroupResult(
    removedProbeGroupResultData: CreateProbeGroupResultInput
  ): void {
    // console.log("Click Remove ProbeGroupResult Data ...");
    // current logic is that: if this probegroupresult not saving to database, just hard delete... otherwise, add a deleteflag as the prefix of its id ...
  }

  // handle the probegroupresult change, does not save to database ...
  function handleProbeGroupResultSave(
    inputProbeGroupResultData: CreateProbeGroupResultInput
  ): void {
    let savedId: string = inputProbeGroupResultData.id as string;
    if (savedId.startsWith(updateFlag) || savedId.startsWith(deleteFlag)) {
      savedId = savedId.split("|")[1];
    }
    // console.log("The triggered update probegroupresult id is: ", savedId);

    const newDataArray = inputProbeGroupResultDatas.map((probegroupresult) => {
      let oriId = probegroupresult.id as string;
      if (oriId.startsWith(updateFlag) || oriId.startsWith(deleteFlag)) {
        oriId = oriId.split("|")[1];
      }
      if (oriId === savedId) {
        // console.log("This probegroupresult need update: ", oriId);
        return inputProbeGroupResultData;
      } else {
        return probegroupresult;
      }
    });
    setInputProbeGroupResultDatas(newDataArray);
    // console.log("IDC - The saved probegroupresult: ", JSON.stringify(newDataArray, null, 2));
    handleProbeGroupResultsValid(newDataArray);
  }

  // this is to save all probegroupresults into database, will call server-side save function ...
  async function handleSaveAllChangesBtn(
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    e.preventDefault();
    setSaveAllBtnText("Saving ...");

    await submitProbeGroupResultsData(inputProbeGroupResultDatas);
    // may be should prompt a block to inform user saving completed ...

    // after saving, check whether data is valid for start analysis ...
    // router.push(router.pathname); // refresh the page ...
    window.location.reload();
  }

  // this is to save the child probegroupresult to db ...
  async function handleSingleProbeResultSave(
    submittedProbeGroupResultData: CreateProbeGroupResultInput
  ): Promise<void> {
    await saveSingleProbeGroupResultToDB(submittedProbeGroupResultData);

    // router.reload(); // refresh the page ...
    window.location.reload();
  }

  const stopSubscriptions = () => {
    console.log("stopping subscriptions");
    mySubscriptions.forEach((subscription) => subscription.unsubscribe());
    setMySubscriptions([]);
    setSubscriptionResults([]);
  };

  async function updateInspectionResultStatus(
    status: InspectionStatusEnum
  ): Promise<void> {
    // if (submittedResults.length !== submittedResultsNum) return;

    // update inspection status to 'completed' ...
    console.log("All Results Received ...");
    await changeInspectionStatus(inspectionData.id as string, status); // error occur here ... may call this twice at the same time, why ...
    setAnalysisBtnText("Start Analysis");
    setAnalysisBtnColor("green");
    stopSubscriptions();
  }

  // logically it will work ... but I am not sure ...
  const startSubscriptions = (
    validSubmitProbeResult: CreateProbeResultInput[]
  ) => {
    console.log("Starting subscriptions");

    const updateSubs = validSubmitProbeResult.map((proberesult) => {
      const proberesult_id: string = proberesult.id as string;
      const newupdatesub = client
        .graphql({
          query: onUpdateIbisProbeResultStatus,
          variables: {
            id: proberesult_id,
          },
        })
        .subscribe({
          next: async ({ data }) => {
            console.log("Subscribe data: ", data);
            console.log(
              `Get data of proberesult ${proberesult_id}: `,
              data.onUpdateIbisProbeResultStatus
            );

            if (data && data.onUpdateIbisProbeResultStatus) {
              const updateId = data.onUpdateIbisProbeResultStatus;
              setSubscriptionResults((prevResults) => {
                const newResults = [...prevResults, updateId.id !== ""];
                return newResults;
              });
              setViewReportAvailable(true); // at least have one result ???
            }
          },
          error: (error) => console.warn(error),
        });
      return newupdatesub;
    });

    setMySubscriptions(updateSubs);
  };

  // the Analysis btn handler ... should start/stop subscription here ...
  async function handleAnalysisSubmit(
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    e.preventDefault();
    setIsAnalysisLoading(true);
    const isToStart = analysisBtnText === "Start Analysis";

    setStartAnalysisAvailable(false);

    if (isToStart) {
      await changeInspectionStatus(
        inspectionData.id as string,
        InspectionStatusEnum.ONGOING
      );
      setIsReadOnly(true);

      // start subscription and call api requet send function ...
      const validProberesults = getValidProbeAnalysisRequest(
        inputProbeGroupResultDatas,
        probesData,
        fileData
      );

      // console.log("The Valid Analysis Probes are: ", validProberesults);

      startSubscriptions(validProberesults);

      console.log("Start Sending Request ...");

      const requests: RequestPair[] = await probeAnalysisDataRequest(
        validProberesults,
        inspectionData.id as string,
        probesData,
        inspectionData.projectId as string,
        fileData
      );

      try {
        const apiResults = await Promise.all(
          requests.map(async (requestdata) => {
            const requestObj = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestdata.requestBody),
            };
            const requestApiUrl =
              requestdata.requestUrl === "" ? myapiUrl : requestdata.requestUrl;
            const res = await fetch(requestApiUrl, requestObj);
            return res.json();
          })
        );
        console.log("All apis called successfully: ", apiResults);
      } catch (error: any) {
        console.log("Error calling api: ", error);
        stopSubscriptions();
      }

      setIsAnalysisLoading(false);
      setAnalysisBtnText("Stop Analysis");
      setAnalysisBtnColor("red");
      setStartAnalysisAvailable(true);
    } else {
      // prompt out a window to alarm user of stop analysis (not implemented, ignore now ... ) and stop subcription ...
      await changeInspectionStatus(
        inspectionData.id as string,
        InspectionStatusEnum.CREATED
      );

      stopSubscriptions();
      setIsAnalysisLoading(false);
      setAnalysisBtnText("Start Analysis");
      setAnalysisBtnColor("green");
      setStartAnalysisAvailable(true);
      setIsReadOnly(false);
    }
  }

  // redirect to report page ...
  function handleViewReportBtn(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    router.push(
      `/projects/${inspectionData.projectId}/inspections/${inspectionData.id}/report`
    );
  }

  useEffect(() => {
    // Cleanup subscription on component unmount
    return () => {
      stopSubscriptions();
    };
  });

  useEffect(() => {
    if (
      subscriptionResults.length === mySubscriptions.length &&
      subscriptionResults.length > 0
    ) {
      updateInspectionResultStatus(InspectionStatusEnum.COMPLETED);
    }
  }, [subscriptionResults]);

  return (
    <div className="contents p-5 w-full items-center">
      {/* Basic Info for Inspection ... */}
      <InspectionDetailClientComponent
        initialInspectionInput={inspectionData}
        handleInspectionSaveFunction={submitInspectionDetail}
        inspectionId={inspectionData.id}
      />

      {/* Add New ProbeGroup Result Btn ... */}
      {/* <div className='w-4/5 mt-2 mb-2'>
                <button
                    className={`w-full bg-blue-400 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded ${isProbeGroupResultsValid ? 'cursor-pointer' : 'disabled:bg-gray-400 cursor-not-allowed'}`}
                    disabled={!isProbeGroupResultsValid}
                    onClick={handleAddProbeGroupResult}
                >
                    Add New ProbeGroup Result
                </button>
            </div> */}

      {/* List the currently having ProbeGroup Results ... */}
      {inputProbeGroupResultDatas.map((probegroupdata) => {
        return (
          <div key={probegroupdata.id} className="w-4/5 mt-2 mb-2">
            <IbisProbeGroupResultEditComponent
              probegroupsInfoFromParent={probeGroupsData}
              fileInfoFromParent={fileData}
              initProbeGroupResultData={probegroupdata}
              initSelectedProbeGroupId={probegroupdata.probeGroupId || ""}
              saveProbeGroupResult={handleProbeGroupResultSave}
              saveSingleProbeGroupResultToDB={handleSingleProbeResultSave}
              removeProbeGroupResult={handleRemoveProbeGroupResult}
              isReadOnly={isReadOnly}
            />
          </div>
        );
      })}

      {/* Start Analysis & View Report Buttons */}
      <div className="w-4/5 mt-2 flex">
        <IbisLoadingBtn
          className={"w-1/4"}
          onclick={handleSaveAllChangesBtn}
          disabled={!isProbeGroupResultsValid}
          color={"blue"}
          btnText={saveAllBtnText}
        />
        <IbisLoadingBtn
          className={"w-1/2"}
          onclick={handleAnalysisSubmit}
          disabled={!startAnalysisAvailable}
          color={analysisBtnColor}
          btnText={analysisBtnText}
        />
        <button
          className={`w-1/4 bg-blue-400 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded ${
            viewReportAvailable
              ? "cursor-pointer"
              : "disabled:bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!viewReportAvailable}
          onClick={handleViewReportBtn}
        >
          <span>View Analysis Report</span>
        </button>
      </div>
    </div>
  );
};

export default InspectionAnalysisClientComponent;
