export type ProbeResultType = {
  id: string;
  probeId: string;
  status: string;
  description: string;
  subProbeResults: Array<SubProbeResultType>;
};

export type SubProbeResultType = {
  id: string;
  subProbeId: string;
  status: string;
  description: string;
  elements: Array<SubProbeResultElementType>;
};

export type SubProbeResultElementType = {
  id: string;
  elementId: string;
  fileId: string;
  status: string;
  expectedValue: string;
  actualValue: string;
  parameterId: string;
  description: string;
  valueType: string;
  actualValueUnit: string | null;
  expectedValueUnit: string | null;
  coordinates: CoordinateType | null;
};

export type CoordinateType = {
  X: number;
  Y: number;
  Z: number;
};

export type InputFileIdAndUrlType = {
  id: string;
  name: string;
  signedUrl: URL;
  // fileCategory: {
  //   name: string;
  //   acceptableExtensions: Array<string>;
  // };
};

export type FileCombinationInfoType = {
  name: string;
  description: string;
  quantity: number;
  category: {
    name: string;
    description: string;
    acceptableExtensions: Array<string>;
  };
};

export type FileGroupSettingInfoType = {
  name: string;
  description: string;
  fileCombinations: Array<FileCombinationInfoType>;
};

export type ParameterInfoType = {
  id: string;
  ownerId: string;
  name: string;
  value: number;
  type: string;
  minThreshold: number;
  maxThreshold: number;
  unit: string;
  valueType: string;
  isIncludedValue: boolean;
};

export type SubProbeInfoType = {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  isVisible: boolean;
  parameters: Array<ParameterInfoType>;
};

export type ProbeInfoType = {
  id: string;
  ownerId: string;
  refNo: string;
  name: string;
  url: string;
  description: string;
  type: string;
  fileGroupSetting: FileGroupSettingInfoType;
  subprobes: Array<SubProbeInfoType>;
};

export type InspectionRequestType = {
  appId: string;
  refId: string;
  inspectionId: string;
  probeResultId: string;
  projectId: string;
  probe: ProbeInfoType;
  inputFiles: Array<InputFileIdAndUrlType>;
  result?: ProbeResultType;
  error?: string | null;
  webhookUrl?: string;
};

export type RequestPair = {
  requestBody: string;
  requestUrl: string;
};

export const createFlag = "NEWCREATE|";
export const deleteFlag = "DELETE|";
export const updateFlag = "UPDATE|";
