import React from "react";
import { IbisFile, IbisInspection, IbisProbeGroupResult } from "@/API";
import IbisInspectionReportComponent from "./ibisInspectionReportComponent";
import {
  fetchIbisFiles,
  fetchIbisInspection,
  fetchIbisProbeGroups,
} from "@/app/(secured)/projects/[projectId]/inspections/_lib/graphqlApi";

import config from "@/amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import { getIbisInspectionByIdAction } from "../../create/actions";
import { notFound } from "next/navigation";
Amplify.configure(config, { ssr: true });

interface PathGroup {
  filePath: string;
  resultPath: string;
  type: string;
}

const pathGroup: PathGroup[] = [
  {
    filePath: "/ifcFiles/test0.ifc",
    resultPath: "/ifcFiles/dummyresult.json",
    type: "Progress",
  },
  {
    filePath: "/ifcFiles/TSD to Revit.ifc",
    resultPath: "/ifcFiles/TSD to Revit Result.json",
    type: "Progress",
  },
];

const pathGroupForMarker: PathGroup[] = [
  {
    filePath: "/ifcFiles/test0.ifc",
    resultPath: "/ifcFiles/dummyresultmarker.json",
    type: "Probe",
  },
  {
    filePath: "/ifcFiles/TSD to Revit.ifc",
    resultPath: "/ifcFiles/TSD to Revit Result.json",
    type: "Probe",
  },
];

const pathGroupForXmi: PathGroup[] = [
  {
    filePath: "/ifcFiles/test0-bim1_mod.json",
    resultPath: "/ifcFiles/output1.json",
    type: "Match",
  },
];

export default async function InspectionReportPage({
  params,
}: {
  params: { inspectionId: string; projectId: string };
}) {
  // const fetchedInspectionData = (await fetchIbisInspection(
  //   params.inspectionId
  // )) as IbisInspection;
  const inspectionQueryFromServer = await getIbisInspectionByIdAction(
    params.inspectionId
  );
  const fetchedInspectionData = inspectionQueryFromServer.getIbisInspection;
  // Check if the object is valid
  console.log("fetchedInspectionData", fetchedInspectionData);
  if (fetchedInspectionData === null || fetchedInspectionData === undefined) {
    notFound(); // This triggers a 404 page
  }
  const fileRefData = await fetchIbisFiles(params.projectId);
  const probegroupsResultData = fetchedInspectionData?.probeGroupResults
    ? (fetchedInspectionData.probeGroupResults as IbisProbeGroupResult[])
    : [];

  const allProbeGroupsData = await fetchIbisProbeGroups();

  const pathGroupTest: PathGroup[] = [];

  //filter the probe group
  const probeGroupId = probegroupsResultData?.[0]?.probeGroupId;
  const probeGroup = allProbeGroupsData?.find(
    (group) => group.id === probeGroupId
  );

  const probeResults = probegroupsResultData?.[0]?.probeResults;
  const probes = probeGroup?.probes;
  if (probeResults) {
    for (let probeResult of probeResults) {
      const probeId = probeResult.probeId;
      const probe = probes?.find((probe) => probe.id === probeId);

      const inputFileIds = probeResult.inputFileIds;
      const resultFileId = probeResult.resultFileId;

      const refFile = fileRefData?.find((file) => file.id === resultFileId);
      const inputFiles: IbisFile[] = [];
      if (inputFileIds !== null && inputFileIds !== undefined) {
        for (let inputFileId of inputFileIds) {
          const file = fileRefData?.find((file) => file.id === inputFileId);
          if (file) inputFiles.push(file);
        }
      }

      const resultFilePath = refFile?.filepath;
      const inputFilePath = inputFiles[0].filepath;
      const type = probe?.type;

      console.log("type", type);
      console.log("resultFilePath", resultFilePath);
      console.log("resultFileId", resultFileId);
      console.log("inputFilePath", inputFilePath);
      console.log("inputFileId", inputFiles[0].id);
      if (inputFilePath && resultFilePath && type) {
        pathGroupTest.push({
          filePath: inputFilePath,
          resultPath: resultFilePath,
          type: type,
        });
      }
    }
  }

  return (
    <div className="h-full w-full">
      <IbisInspectionReportComponent
        inspectionQueryFromServer={inspectionQueryFromServer}
        // fetchedInspectionDataFromServer={fetchedInspectionData}
        fileRefDataFromServer={fileRefData}
        probegroupsResultDataFromServer={probegroupsResultData}
        allProbeGroupsDataFromServer={allProbeGroupsData}
        projectId={params.projectId}
        inspectionId={params.inspectionId}
        pathGroup={pathGroupTest}
      />
    </div>
  );
}
