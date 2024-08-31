"use client";

import {
  CreateProbeResultInput,
  IbisFile,
  IbisFileCombination,
  IbisParameter,
  IbisProbe,
  IbisSubProbe,
} from "@/API";
import {
  FileCombinationInfoType,
  InputFileIdAndUrlType,
  InspectionRequestType,
  ParameterInfoType,
  ProbeInfoType,
  RequestPair,
  SubProbeInfoType,
} from "@/ibisTypes";

import { getUrl } from "aws-amplify/storage";

function format2ParamaterInfoType(
  parameterData: IbisParameter
): ParameterInfoType {
  const parameterRequest: ParameterInfoType = {
    id: parameterData.id,
    ownerId: parameterData.ownerId || "",
    name: parameterData.name || "",
    value: parameterData.value || 0,
    type: parameterData.type || "",
    minThreshold: parameterData.minThreshold || 0,
    maxThreshold: parameterData.maxThreshold || 0,
    unit: parameterData.unit || "",
    valueType: parameterData.valueType || "",
    isIncludedValue: parameterData.isIncludedValue || true,
  };
  return parameterRequest;
}

function format2SubProbeInfoType(subprobeData: IbisSubProbe): SubProbeInfoType {
  const subprobeRequest: SubProbeInfoType = {
    id: subprobeData.id,
    ownerId: subprobeData.ownerId || "",
    name: subprobeData.name || "",
    description: subprobeData.description || "",
    isVisible: subprobeData.isVisible || true,
    parameters:
      subprobeData.parameters?.map((d) => format2ParamaterInfoType(d)) || [],
  };

  return subprobeRequest;
}

function format2FileCombinationType(
  fileCombinationData: IbisFileCombination
): FileCombinationInfoType {
  const filecombinationRequest: FileCombinationInfoType = {
    name: fileCombinationData.name || "",
    description: fileCombinationData.description || "",
    quantity: fileCombinationData.quantity || 0,
    category: {
      name: fileCombinationData.category?.name || "",
      description: fileCombinationData.category?.description || "",
      acceptableExtensions:
        fileCombinationData.category?.acceptableExtensions || [],
    },
  };

  return filecombinationRequest;
}

function format2ProbeInfoType(probeData: IbisProbe): ProbeInfoType {
  const probeRequest: ProbeInfoType = {
    id: probeData.id,
    ownerId: probeData.ownerId || "",
    refNo: probeData.refNo || "",
    name: probeData.name || "",
    url: probeData.url || "",
    description: probeData.description || "",
    type: probeData.type || "",
    fileGroupSetting: {
      name: probeData.fileGroupSetting?.name || "",
      description: probeData.fileGroupSetting?.description || "",
      fileCombinations:
        probeData.fileGroupSetting?.fileCombinations?.map((d) =>
          format2FileCombinationType(d)
        ) || [],
    },
    subprobes:
      probeData.subprobes?.map((d) => format2SubProbeInfoType(d)) || [],
  };

  return probeRequest;
}

// used for per inspection's submission ...
async function probeAnalysisDataRequest(
  rawDatas: CreateProbeResultInput[],
  insp_id: string,
  probeRefData: IbisProbe[],
  projectId: string,
  fileRefInfo: IbisFile[]
): Promise<RequestPair[]> {
  const inspectionRequestJsonObjs: RequestPair[] = [];

  for (const eachProbeResult of rawDatas) {
    const refProbeData: IbisProbe | undefined = probeRefData.find(
      (probe) => probe.id === eachProbeResult.probeId
    );

    if (refProbeData === undefined) continue;

    const fileIds: string[] = eachProbeResult.inputFileIds || [];

    const fileinfos: (InputFileIdAndUrlType | null)[] = await Promise.all(
      fileIds.map(async (fid) => {
        const fileObj = fileRefInfo.find((file) => file.id === fid);
        if (fileObj === undefined) return null;
        const filepath = fileObj.filepath as string;
        const signedUrl = await getUrl({
          path: filepath,
          options: {
            validateObjectExistence: false,
            expiresIn: 600, // 10min
            useAccelerateEndpoint: false, // Whether to use accelerate endpoint.
          },
        });
        const returnObj: InputFileIdAndUrlType = {
          id: fid,
          name: fileObj.name || "",
          signedUrl: signedUrl.url,
          // fileCategory: {
          //   name: fileObj.fileCategory?.name || "",
          //   acceptableExtensions:
          //     fileObj.fileCategory?.acceptableExtensions || [],
          // },
        };
        return returnObj;
      })
    );

    const validFileInfos = fileinfos.filter(
      (info) => info !== null
    ) as InputFileIdAndUrlType[];

    const newInspectionRequest: InspectionRequestType = {
      appId: "IBIS",
      refId: "",
      inspectionId: insp_id,
      probeResultId: eachProbeResult.id || "",
      projectId: projectId,
      probe: format2ProbeInfoType(refProbeData),
      inputFiles: validFileInfos,
      webhookUrl:
        "https://master.dh2ddtk39bfwm.amplifyapp.com/api/inspection/result",
    };
    inspectionRequestJsonObjs.push({
      requestBody: JSON.stringify(newInspectionRequest),
      requestUrl: refProbeData.url || "",
    });
    console.log(
      "-> Formatted request data: ",
      JSON.stringify(newInspectionRequest, null, 2)
    );
  }

  return inspectionRequestJsonObjs;
}

export { probeAnalysisDataRequest };
