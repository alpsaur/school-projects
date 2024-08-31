import { v4 as uuidv4 } from "uuid";
import {
  CreateInspectionInput,
  CreateProbeGroupResultInput,
  IbisInspection,
  IbisProbe,
  IbisProbeGroup,
  InspectionStatusEnum,
  ProbeTypeEnum,
  UpdateInspectionInput,
} from "@/API";
import InspectionAnalysisClientComponent from "./IbisInspectionDetailClientComponent";
import { createFlag } from "@/ibisTypes";
import {
  fetchIbisFiles,
  fetchIbisInspection,
  fetchIbisProbeGroups,
  fetchIbisProbes,
  saveProbeGroupResultInput,
  saveSingleProbeGroupResult,
  updateInspectionStatus,
} from "../../_lib/graphqlApi";
import config from "@/amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import {
  getIbisInspectionByIdAction,
  getIbisProbeGroupsAction,
  updateInspectionAction,
} from "./actions";
import { notFound } from "next/navigation";

Amplify.configure(config, { ssr: true });
// The first SAVE btn ...
async function submitInspectionDetail(
  inputInspectionData: CreateInspectionInput | UpdateInspectionInput
): Promise<void> {
  "use server";
  console.log(
    "The submitted Basic data are: \n",
    JSON.stringify(inputInspectionData, null, 2)
  );
  await updateInspectionAction(inputInspectionData as UpdateInspectionInput);
}

// Save all probegroupresults button ...
async function submitProbeGroupResultsData(
  submitProbeGroupResultDatas: CreateProbeGroupResultInput[]
): Promise<void> {
  "use server";
  console.log(
    "The submitted All ProbeGroupResults data are: \n",
    JSON.stringify(submitProbeGroupResultDatas, null, 2)
  );
  await saveProbeGroupResultInput(submitProbeGroupResultDatas);
}

// Save each probegroupresult ...
async function saveOneProbeGroupResultData(
  submitProbeGroupResultData: CreateProbeGroupResultInput
): Promise<void> {
  "use server";
  console.log(
    "--> The submitted Single ProbeGroupResult data is: \n",
    JSON.stringify(submitProbeGroupResultData, null, 2)
  );
  await saveSingleProbeGroupResult(submitProbeGroupResultData);
}

async function changeInspectionStatus(
  inspectionId: string,
  inspectionStatus: InspectionStatusEnum
): Promise<void> {
  "use server";
  await updateInspectionStatus(inspectionId, inspectionStatus);
}

export default async function InspectionDetailServerPage({
  params,
}: {
  params: { inspectionId: string; projectId: string };
}) {
  let initialInspectionInput: CreateInspectionInput | UpdateInspectionInput = {
    id: uuidv4(),
    refNo: "",
    name: "",
    description: "",
    type: ProbeTypeEnum.MATCH,
    projectId: params.projectId,
    status: InspectionStatusEnum.CREATED,
  };
  const inspectionData = (await fetchIbisInspection(
    params.inspectionId
  )) as IbisInspection;
  console.log("inspectionData", inspectionData);

  if (inspectionData === null || inspectionData === undefined) {
    notFound(); // This triggers a 404 page
  }
  const inspectionQueryFromServer = await getIbisInspectionByIdAction(
    params.inspectionId
  );

  const probeGroupsDropdownQueryFromServer = await getIbisProbeGroupsAction();

  const inspectionFromServer = inspectionQueryFromServer.getIbisInspection;
  if (
    inspectionFromServer === null ||
    inspectionFromServer === undefined ||
    !inspectionFromServer
  ) {
    notFound(); // This triggers a 404 page
  }

  initialInspectionInput = {
    ...initialInspectionInput,
    id: inspectionFromServer.id,
    refNo: inspectionFromServer.refNo,
    name: inspectionFromServer.name,
    description: inspectionFromServer.description,
    type: inspectionFromServer.type,
    projectId: inspectionFromServer.projectId,
    status: inspectionFromServer.status,
  };

  const probeGroupsDropdownData =
    probeGroupsDropdownQueryFromServer.listIbisProbeGroups;
  const probeGroupsDropdownDataFiltered = probeGroupsDropdownData.filter(
    (d) => d.type === inspectionFromServer?.type
  );
  const rawProbeGroupData: IbisProbeGroup[] = await fetchIbisProbeGroups();
  const filteredProbeGroup: IbisProbeGroup[] = rawProbeGroupData.filter(
    (d) => d.type === inspectionData.type
  );

  const probesData: IbisProbe[] = await fetchIbisProbes();
  const fileData = await fetchIbisFiles(params.projectId);

  // console.log("The fetched ProbeGroup Data: ", JSON.stringify(rawProbeGroupData, null, 2));
  // console.log("The fetched Probe Data: ", JSON.stringify(probesData, null, 2));

  const newProbeGroupResultData: CreateProbeGroupResultInput = {
    id: createFlag + uuidv4(),
    probeGroupId: "",
    probeResults: [],
    inspectionId: params.inspectionId,
    description: createFlag + "ProbeGroupResult",
  };

  const fetchedProbeGroupResultsData: (CreateProbeGroupResultInput | null)[] =
    inspectionData.probeGroupResults || [];
  let formattedProbeGroupResultsData: CreateProbeGroupResultInput[] =
    fetchedProbeGroupResultsData as CreateProbeGroupResultInput[];
  if (formattedProbeGroupResultsData.length === 0) {
    formattedProbeGroupResultsData = [newProbeGroupResultData];
  }

  console.log(
    "The fetched inspection data is: ",
    JSON.stringify(inspectionData, null, 2)
  );

  console.log(
    "probeGroupResults",
    inspectionQueryFromServer.getIbisInspection?.probeGroupResults
  );

  return (
    <div className="flex flex-col items-center w-full p-5">
      <InspectionAnalysisClientComponent
        projectId={params.projectId}
        inspectionId={params.inspectionId}
        inspectionQueryFromServer={inspectionQueryFromServer}
        inspectionData={inspectionData}
        submitInspectionDetail={submitInspectionDetail}
        probeGroupsData={filteredProbeGroup}
        probesData={probesData}
        fileData={fileData}
        initProbeGroupResultFromServer={formattedProbeGroupResultsData}
        submitProbeGroupResultsData={submitProbeGroupResultsData}
        saveSingleProbeGroupResultToDB={saveOneProbeGroupResultData}
        changeInspectionStatus={changeInspectionStatus}
      />
    </div>
  );
}
