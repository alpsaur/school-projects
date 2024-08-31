/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateProjectInput = {
  id?: string | null,
  name?: string | null,
  description?: string | null,
  ownerId?: string | null,
};

export type CreateFileInput = {
  id?: string | null,
  name: string,
  filepath?: string | null,
  projectId: string,
  description?: string | null,
  isGenerated: boolean,
  fileMetadata?: Array< CreateFileMetadataInput | null > | null,
};

export type CreateFileMetadataInput = {
  id?: string | null,
  key?: string | null,
  value?: string | null,
  fileId?: string | null,
};

export type CreateFileCategoryInput = {
  id: string,
  name: string,
  description?: string | null,
  acceptableExtensions: Array< string >,
};

export type UpdateFileCategoryInput = {
  id?: string | null,
  name?: string | null,
  description?: string | null,
  acceptableExtensions?: Array< string > | null,
};

export type CreateFileCombinationInput = {
  id?: string | null,
  name?: string | null,
  description?: string | null,
  categoryId?: string | null,
  quantity?: number | null,
  fileGroupSettingId?: string | null,
};

export type UpdateFileCombinationInput = {
  id?: string | null,
  name?: string | null,
  description?: string | null,
  categoryId?: string | null,
  quantity?: number | null,
  fileGroupSettingId?: string | null,
};

export type CreateFileGroupSettingInput = {
  id?: string | null,
  name?: string | null,
  description?: string | null,
  ownerId?: string | null,
};

export type UpdateFileGroupSettingInput = {
  id: string,
  name?: string | null,
  description?: string | null,
  ownerId?: string | null,
};

export type CreateProbeGroupInput = {
  id?: string | null,
  refNo?: string | null,
  name?: string | null,
  description?: string | null,
  isPublic?: boolean | null,
  ownerId?: string | null,
  probeIds?: Array< string > | null,
  type?: string | null,
};

export type CreateProbeInput = {
  id: string,
  refNo?: string | null,
  name: string,
  url: string,
  description?: string | null,
  fileGroupSettingId?: string | null,
  ownerId?: string | null,
  isPublic?: boolean | null,
  type: ProbeTypeEnum,
  subprobes: Array< CreateSubProbeInput >,
};

export enum ProbeTypeEnum {
  MATCH = "MATCH",
  PROBE = "PROBE",
  PROGRESS = "PROGRESS",
}


export type CreateSubProbeInput = {
  id?: string | null,
  name?: string | null,
  description?: string | null,
  isVisible?: boolean | null,
  probeId?: string | null,
  ownerId?: string | null,
  parameters?: Array< CreateParameterInput > | null,
};

export type CreateParameterInput = {
  id?: string | null,
  ownerId?: string | null,
  name?: string | null,
  value?: number | null,
  type?: string | null,
  minThreshold?: number | null,
  maxThreshold?: number | null,
  unit?: string | null,
  valueType?: string | null,
  isIncludedValue?: boolean | null,
  subProbeId?: string | null,
};

export type UpdateProbeInput = {
  id: string,
  refNo?: string | null,
  name?: string | null,
  url?: string | null,
  description?: string | null,
  fileGroupSettingId?: string | null,
  ownerId?: string | null,
  isPublic?: boolean | null,
  type?: ProbeTypeEnum | null,
  subprobes: Array< CreateSubProbeInput >,
};

export type CreateInspectionInput = {
  id: string,
  refNo?: string | null,
  name: string,
  description?: string | null,
  type: ProbeTypeEnum,
  status: InspectionStatusEnum,
  projectId: string,
  probeGroupResults?: Array< CreateProbeGroupResultInput > | null,
};

export enum InspectionStatusEnum {
  CREATED = "CREATED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  ARCHIVED = "ARCHIVED",
  DELETED = "DELETED",
}


export type CreateProbeGroupResultInput = {
  id?: string | null,
  probeGroupId?: string | null,
  status?: string | null,
  description?: string | null,
  inspectionId?: string | null,
  probeResults?: Array< CreateProbeResultInput > | null,
};

export type CreateProbeResultInput = {
  id?: string | null,
  probeId?: string | null,
  resultFileId?: string | null,
  description?: string | null,
  inputFileIds?: Array< string > | null,
  probeGroupResultId?: string | null,
  status?: string | null,
};

export type UpdateInspectionInput = {
  id: string,
  refNo?: string | null,
  name?: string | null,
  description?: string | null,
  type?: ProbeTypeEnum | null,
  status?: InspectionStatusEnum | null,
  projectId?: string | null,
  probeGroupResults?: Array< CreateProbeGroupResultInput > | null,
};

export type IbisProbeResult = {
  __typename: "IbisProbeResult",
  id: string,
  probeId: string,
  resultFileId?: string | null,
  status?: string | null,
  inputFileIds?: Array< string > | null,
  inputFiles?:  Array<IbisFile > | null,
  description?: string | null,
  probeGroupResultId: string,
};

export type IbisFile = {
  __typename: "IbisFile",
  id: string,
  name: string,
  filepath: string,
  projectId: string,
  fileMetadata:  Array<IbisFileMetadata >,
  description?: string | null,
  isGenerated: boolean,
  createdOn: string,
  status: BasicStatusEnum,
};

export type IbisFileMetadata = {
  __typename: "IbisFileMetadata",
  id: string,
  key: string,
  value: string,
  fileId: string,
};

export enum BasicStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
}


export type IbisProject = {
  __typename: "IbisProject",
  id: string,
  name: string,
  description?: string | null,
  ownerId?: string | null,
  createdOn: string,
};

export type IbisFileCategory = {
  __typename: "IbisFileCategory",
  id: string,
  name: string,
  description?: string | null,
  acceptableExtensions: Array< string >,
  status: BasicStatusEnum,
};

export type IbisFileCombination = {
  __typename: "IbisFileCombination",
  id: string,
  name: string,
  description?: string | null,
  category?: IbisFileCategory | null,
  quantity: number,
  status: BasicStatusEnum,
};

export type IbisFileGroupSetting = {
  __typename: "IbisFileGroupSetting",
  id: string,
  name: string,
  description?: string | null,
  fileCombinations?:  Array<IbisFileCombination > | null,
  ownerId: string,
  status: BasicStatusEnum,
};

export type IbisProbeGroup = {
  __typename: "IbisProbeGroup",
  id: string,
  ownerId: string,
  refNo?: string | null,
  name: string,
  description?: string | null,
  isPublic: boolean,
  probes:  Array<IbisProbe >,
  type: ProbeTypeEnum,
  status: BasicStatusEnum,
};

export type IbisProbe = {
  __typename: "IbisProbe",
  id: string,
  ownerId: string,
  refNo: string,
  name: string,
  url: string,
  description?: string | null,
  fileGroupSetting: IbisFileGroupSetting,
  isPublic: boolean,
  type: ProbeTypeEnum,
  subprobes:  Array<IbisSubProbe >,
  status: BasicStatusEnum,
};

export type IbisSubProbe = {
  __typename: "IbisSubProbe",
  id: string,
  ownerId: string,
  name: string,
  description?: string | null,
  isVisible: boolean,
  parameters:  Array<IbisParameter >,
  status: BasicStatusEnum,
};

export type IbisParameter = {
  __typename: "IbisParameter",
  id: string,
  ownerId?: string | null,
  name: string,
  value: number,
  type?: string | null,
  minThreshold?: number | null,
  maxThreshold?: number | null,
  unit?: string | null,
  valueType?: string | null,
  isIncludedValue: boolean,
  subProbeId: string,
  status: BasicStatusEnum,
};

export type IbisInspection = {
  __typename: "IbisInspection",
  id: string,
  refNo: string,
  name: string,
  description?: string | null,
  type: ProbeTypeEnum,
  status: InspectionStatusEnum,
  probeGroupResults:  Array<IbisProbeGroupResult >,
  projectId: string,
};

export type IbisProbeGroupResult = {
  __typename: "IbisProbeGroupResult",
  id: string,
  probeGroupId: string,
  inspectionId: string,
  description?: string | null,
  status: string,
  probeResults:  Array<IbisProbeResult >,
};

export type CreateIbisProjectMutationVariables = {
  input: CreateProjectInput,
};

export type CreateIbisProjectMutation = {
  createIbisProject?: string | null,
};

export type UpdateIbisProjectMutationVariables = {
  input: CreateProjectInput,
};

export type UpdateIbisProjectMutation = {
  updateIbisProject?: string | null,
};

export type DeleteIbisProjectMutationVariables = {
  deleteId: string,
};

export type DeleteIbisProjectMutation = {
  deleteIbisProject?: string | null,
};

export type CreateIbisFileMutationVariables = {
  input: CreateFileInput,
};

export type CreateIbisFileMutation = {
  createIbisFile?: string | null,
};

export type UpdateIbisFileMutationVariables = {
  input: CreateFileInput,
};

export type UpdateIbisFileMutation = {
  updateIbisFile?: string | null,
};

export type DeleteIbisFileMutationVariables = {
  deleteId: string,
};

export type DeleteIbisFileMutation = {
  deleteIbisFile?: string | null,
};

export type CreateIbisFileCategoryMutationVariables = {
  input: CreateFileCategoryInput,
};

export type CreateIbisFileCategoryMutation = {
  createIbisFileCategory?: string | null,
};

export type UpdateIbisFileCategoryMutationVariables = {
  input: UpdateFileCategoryInput,
};

export type UpdateIbisFileCategoryMutation = {
  updateIbisFileCategory?: string | null,
};

export type DeleteIbisFileCategoryMutationVariables = {
  deleteId: string,
};

export type DeleteIbisFileCategoryMutation = {
  deleteIbisFileCategory?: string | null,
};

export type CreateIbisFileCombinationMutationVariables = {
  input: CreateFileCombinationInput,
};

export type CreateIbisFileCombinationMutation = {
  createIbisFileCombination?: string | null,
};

export type UpdateIbisFileCombinationMutationVariables = {
  input: UpdateFileCombinationInput,
};

export type UpdateIbisFileCombinationMutation = {
  updateIbisFileCombination?: string | null,
};

export type DeleteIbisFileCombinationMutationVariables = {
  deleteId: string,
};

export type DeleteIbisFileCombinationMutation = {
  deleteIbisFileCombination?: string | null,
};

export type CreateIbisFileGroupSettingMutationVariables = {
  input: CreateFileGroupSettingInput,
};

export type CreateIbisFileGroupSettingMutation = {
  createIbisFileGroupSetting?: string | null,
};

export type UpdateIbisFileGroupSettingMutationVariables = {
  input: UpdateFileGroupSettingInput,
};

export type UpdateIbisFileGroupSettingMutation = {
  updateIbisFileGroupSetting?: string | null,
};

export type DeleteIbisFileGroupSettingMutationVariables = {
  deleteId: string,
};

export type DeleteIbisFileGroupSettingMutation = {
  deleteIbisFileGroupSetting?: string | null,
};

export type CreateIbisFileMetadataMutationVariables = {
  input: CreateFileMetadataInput,
};

export type CreateIbisFileMetadataMutation = {
  createIbisFileMetadata?: string | null,
};

export type UpdateIbisFileMetadataMutationVariables = {
  input: CreateFileMetadataInput,
};

export type UpdateIbisFileMetadataMutation = {
  updateIbisFileMetadata?: string | null,
};

export type DeleteIbisFileMetadataMutationVariables = {
  deleteId: string,
};

export type DeleteIbisFileMetadataMutation = {
  deleteIbisFileMetadata?: string | null,
};

export type CreateIbisProbeGroupMutationVariables = {
  input: CreateProbeGroupInput,
};

export type CreateIbisProbeGroupMutation = {
  createIbisProbeGroup?: string | null,
};

export type UpdateIbisProbeGroupMutationVariables = {
  input: CreateProbeGroupInput,
};

export type UpdateIbisProbeGroupMutation = {
  updateIbisProbeGroup?: string | null,
};

export type DeleteIbisProbeGroupMutationVariables = {
  deleteId: string,
};

export type DeleteIbisProbeGroupMutation = {
  deleteIbisProbeGroup?: string | null,
};

export type CreateIbisProbeMutationVariables = {
  input: CreateProbeInput,
};

export type CreateIbisProbeMutation = {
  createIbisProbe?: string | null,
};

export type UpdateIbisProbeMutationVariables = {
  input: UpdateProbeInput,
};

export type UpdateIbisProbeMutation = {
  updateIbisProbe?: string | null,
};

export type DeleteIbisProbeMutationVariables = {
  deleteId: string,
};

export type DeleteIbisProbeMutation = {
  deleteIbisProbe?: string | null,
};

export type CreateIbisSubProbeMutationVariables = {
  input: CreateSubProbeInput,
};

export type CreateIbisSubProbeMutation = {
  createIbisSubProbe?: string | null,
};

export type UpdateIbisSubProbeMutationVariables = {
  input: CreateSubProbeInput,
};

export type UpdateIbisSubProbeMutation = {
  updateIbisSubProbe?: string | null,
};

export type DeleteIbisSubProbeMutationVariables = {
  deleteId: string,
};

export type DeleteIbisSubProbeMutation = {
  deleteIbisSubProbe?: string | null,
};

export type CreateIbisParameterMutationVariables = {
  input: CreateParameterInput,
};

export type CreateIbisParameterMutation = {
  createIbisParameter?: string | null,
};

export type UpdateIbisParameterMutationVariables = {
  input: CreateParameterInput,
};

export type UpdateIbisParameterMutation = {
  updateIbisParameter?: string | null,
};

export type DeleteIbisParameterMutationVariables = {
  deleteId: string,
};

export type DeleteIbisParameterMutation = {
  deleteIbisParameter?: string | null,
};

export type CreateIbisInspectionMutationVariables = {
  input: CreateInspectionInput,
};

export type CreateIbisInspectionMutation = {
  createIbisInspection?: string | null,
};

export type UpdateIbisInspectionMutationVariables = {
  input: UpdateInspectionInput,
};

export type UpdateIbisInspectionMutation = {
  updateIbisInspection?: string | null,
};

export type DeleteIbisInspectionMutationVariables = {
  deleteId: string,
};

export type DeleteIbisInspectionMutation = {
  deleteIbisInspection?: string | null,
};

export type CreateIbisProbeGroupResultMutationVariables = {
  input: CreateProbeGroupResultInput,
};

export type CreateIbisProbeGroupResultMutation = {
  createIbisProbeGroupResult?: string | null,
};

export type UpdateIbisProbeGroupResultMutationVariables = {
  input: CreateProbeGroupResultInput,
};

export type UpdateIbisProbeGroupResultMutation = {
  updateIbisProbeGroupResult?: string | null,
};

export type DeleteIbisProbeGroupResultMutationVariables = {
  deleteId: string,
};

export type DeleteIbisProbeGroupResultMutation = {
  deleteIbisProbeGroupResult?: string | null,
};

export type CreateIbisProbeResultMutationVariables = {
  input: CreateProbeResultInput,
};

export type CreateIbisProbeResultMutation = {
  createIbisProbeResult?: string | null,
};

export type UpdateIbisProbeResultMutationVariables = {
  input: CreateProbeResultInput,
};

export type UpdateIbisProbeResultMutation = {
  updateIbisProbeResult?: string | null,
};

export type DeleteIbisProbeResultMutationVariables = {
  deleteId: string,
};

export type DeleteIbisProbeResultMutation = {
  deleteIbisProbeResult?: string | null,
};

export type UpdateIbisProbeResultStatusMutationVariables = {
  input: CreateProbeResultInput,
};

export type UpdateIbisProbeResultStatusMutation = {
  updateIbisProbeResultStatus?:  {
    __typename: "IbisProbeResult",
    id: string,
    probeId: string,
    resultFileId?: string | null,
    status?: string | null,
    inputFileIds?: Array< string > | null,
    inputFiles?:  Array< {
      __typename: "IbisFile",
      id: string,
      name: string,
      filepath: string,
      projectId: string,
      fileMetadata:  Array< {
        __typename: "IbisFileMetadata",
        id: string,
        key: string,
        value: string,
        fileId: string,
      } >,
      description?: string | null,
      isGenerated: boolean,
      createdOn: string,
      status: BasicStatusEnum,
    } > | null,
    description?: string | null,
    probeGroupResultId: string,
  } | null,
};

export type ListIbisProjectsQueryVariables = {
  ownerId: string,
};

export type ListIbisProjectsQuery = {
  listIbisProjects:  Array< {
    __typename: "IbisProject",
    id: string,
    name: string,
    description?: string | null,
    ownerId?: string | null,
    createdOn: string,
  } >,
};

export type GetIbisProjectQueryVariables = {
  id: string,
};

export type GetIbisProjectQuery = {
  getIbisProject?:  {
    __typename: "IbisProject",
    id: string,
    name: string,
    description?: string | null,
    ownerId?: string | null,
    createdOn: string,
  } | null,
};

export type ListIbisFilesQueryVariables = {
  projectId: string,
  categoryId?: string | null,
};

export type ListIbisFilesQuery = {
  listIbisFiles:  Array< {
    __typename: "IbisFile",
    id: string,
    name: string,
    filepath: string,
    projectId: string,
    fileMetadata:  Array< {
      __typename: "IbisFileMetadata",
      id: string,
      key: string,
      value: string,
      fileId: string,
    } >,
    description?: string | null,
    isGenerated: boolean,
    createdOn: string,
    status: BasicStatusEnum,
  } >,
};

export type GetIbisFileQueryVariables = {
  id: string,
};

export type GetIbisFileQuery = {
  getIbisFile?:  {
    __typename: "IbisFile",
    id: string,
    name: string,
    filepath: string,
    projectId: string,
    fileMetadata:  Array< {
      __typename: "IbisFileMetadata",
      id: string,
      key: string,
      value: string,
      fileId: string,
    } >,
    description?: string | null,
    isGenerated: boolean,
    createdOn: string,
    status: BasicStatusEnum,
  } | null,
};

export type ListIbisFileCategoriesQueryVariables = {
};

export type ListIbisFileCategoriesQuery = {
  listIbisFileCategories:  Array< {
    __typename: "IbisFileCategory",
    id: string,
    name: string,
    description?: string | null,
    acceptableExtensions: Array< string >,
    status: BasicStatusEnum,
  } >,
};

export type GetIbisFileCategoryQueryVariables = {
  id: string,
};

export type GetIbisFileCategoryQuery = {
  getIbisFileCategory?:  {
    __typename: "IbisFileCategory",
    id: string,
    name: string,
    description?: string | null,
    acceptableExtensions: Array< string >,
    status: BasicStatusEnum,
  } | null,
};

export type GetIbisFileCombinationQueryVariables = {
  id: string,
};

export type GetIbisFileCombinationQuery = {
  getIbisFileCombination?:  {
    __typename: "IbisFileCombination",
    id: string,
    name: string,
    description?: string | null,
    category?:  {
      __typename: "IbisFileCategory",
      id: string,
      name: string,
      description?: string | null,
      acceptableExtensions: Array< string >,
      status: BasicStatusEnum,
    } | null,
    quantity: number,
    status: BasicStatusEnum,
  } | null,
};

export type ListIbisFileGroupSettingsQueryVariables = {
};

export type ListIbisFileGroupSettingsQuery = {
  listIbisFileGroupSettings:  Array< {
    __typename: "IbisFileGroupSetting",
    id: string,
    name: string,
    description?: string | null,
    fileCombinations?:  Array< {
      __typename: "IbisFileCombination",
      id: string,
      name: string,
      description?: string | null,
      category?:  {
        __typename: "IbisFileCategory",
        id: string,
        name: string,
        description?: string | null,
        acceptableExtensions: Array< string >,
        status: BasicStatusEnum,
      } | null,
      quantity: number,
      status: BasicStatusEnum,
    } > | null,
    ownerId: string,
    status: BasicStatusEnum,
  } >,
};

export type GetIbisFileGroupSettingQueryVariables = {
  id: string,
};

export type GetIbisFileGroupSettingQuery = {
  getIbisFileGroupSetting?:  {
    __typename: "IbisFileGroupSetting",
    id: string,
    name: string,
    description?: string | null,
    fileCombinations?:  Array< {
      __typename: "IbisFileCombination",
      id: string,
      name: string,
      description?: string | null,
      category?:  {
        __typename: "IbisFileCategory",
        id: string,
        name: string,
        description?: string | null,
        acceptableExtensions: Array< string >,
        status: BasicStatusEnum,
      } | null,
      quantity: number,
      status: BasicStatusEnum,
    } > | null,
    ownerId: string,
    status: BasicStatusEnum,
  } | null,
};

export type ListIbisProbeGroupsQueryVariables = {
  name?: string | null,
};

export type ListIbisProbeGroupsQuery = {
  listIbisProbeGroups:  Array< {
    __typename: "IbisProbeGroup",
    id: string,
    ownerId: string,
    refNo?: string | null,
    name: string,
    description?: string | null,
    isPublic: boolean,
    probes:  Array< {
      __typename: "IbisProbe",
      id: string,
      ownerId: string,
      refNo: string,
      name: string,
      url: string,
      description?: string | null,
      fileGroupSetting:  {
        __typename: "IbisFileGroupSetting",
        id: string,
        name: string,
        description?: string | null,
        fileCombinations?:  Array< {
          __typename: "IbisFileCombination",
          id: string,
          name: string,
          description?: string | null,
          quantity: number,
          status: BasicStatusEnum,
        } > | null,
        ownerId: string,
        status: BasicStatusEnum,
      },
      isPublic: boolean,
      type: ProbeTypeEnum,
      subprobes:  Array< {
        __typename: "IbisSubProbe",
        id: string,
        ownerId: string,
        name: string,
        description?: string | null,
        isVisible: boolean,
        parameters:  Array< {
          __typename: "IbisParameter",
          id: string,
          ownerId?: string | null,
          name: string,
          value: number,
          type?: string | null,
          minThreshold?: number | null,
          maxThreshold?: number | null,
          unit?: string | null,
          valueType?: string | null,
          isIncludedValue: boolean,
          subProbeId: string,
          status: BasicStatusEnum,
        } >,
        status: BasicStatusEnum,
      } >,
      status: BasicStatusEnum,
    } >,
    type: ProbeTypeEnum,
    status: BasicStatusEnum,
  } >,
};

export type GetIbisProbeGroupQueryVariables = {
  id: string,
};

export type GetIbisProbeGroupQuery = {
  getIbisProbeGroup?:  {
    __typename: "IbisProbeGroup",
    id: string,
    ownerId: string,
    refNo?: string | null,
    name: string,
    description?: string | null,
    isPublic: boolean,
    probes:  Array< {
      __typename: "IbisProbe",
      id: string,
      ownerId: string,
      refNo: string,
      name: string,
      url: string,
      description?: string | null,
      fileGroupSetting:  {
        __typename: "IbisFileGroupSetting",
        id: string,
        name: string,
        description?: string | null,
        fileCombinations?:  Array< {
          __typename: "IbisFileCombination",
          id: string,
          name: string,
          description?: string | null,
          quantity: number,
          status: BasicStatusEnum,
        } > | null,
        ownerId: string,
        status: BasicStatusEnum,
      },
      isPublic: boolean,
      type: ProbeTypeEnum,
      subprobes:  Array< {
        __typename: "IbisSubProbe",
        id: string,
        ownerId: string,
        name: string,
        description?: string | null,
        isVisible: boolean,
        parameters:  Array< {
          __typename: "IbisParameter",
          id: string,
          ownerId?: string | null,
          name: string,
          value: number,
          type?: string | null,
          minThreshold?: number | null,
          maxThreshold?: number | null,
          unit?: string | null,
          valueType?: string | null,
          isIncludedValue: boolean,
          subProbeId: string,
          status: BasicStatusEnum,
        } >,
        status: BasicStatusEnum,
      } >,
      status: BasicStatusEnum,
    } >,
    type: ProbeTypeEnum,
    status: BasicStatusEnum,
  } | null,
};

export type ListIbisProbesQueryVariables = {
  name?: string | null,
  type?: string | null,
};

export type ListIbisProbesQuery = {
  listIbisProbes:  Array< {
    __typename: "IbisProbe",
    id: string,
    ownerId: string,
    refNo: string,
    name: string,
    url: string,
    description?: string | null,
    fileGroupSetting:  {
      __typename: "IbisFileGroupSetting",
      id: string,
      name: string,
      description?: string | null,
      fileCombinations?:  Array< {
        __typename: "IbisFileCombination",
        id: string,
        name: string,
        description?: string | null,
        category?:  {
          __typename: "IbisFileCategory",
          id: string,
          name: string,
          description?: string | null,
          acceptableExtensions: Array< string >,
          status: BasicStatusEnum,
        } | null,
        quantity: number,
        status: BasicStatusEnum,
      } > | null,
      ownerId: string,
      status: BasicStatusEnum,
    },
    isPublic: boolean,
    type: ProbeTypeEnum,
    subprobes:  Array< {
      __typename: "IbisSubProbe",
      id: string,
      ownerId: string,
      name: string,
      description?: string | null,
      isVisible: boolean,
      parameters:  Array< {
        __typename: "IbisParameter",
        id: string,
        ownerId?: string | null,
        name: string,
        value: number,
        type?: string | null,
        minThreshold?: number | null,
        maxThreshold?: number | null,
        unit?: string | null,
        valueType?: string | null,
        isIncludedValue: boolean,
        subProbeId: string,
        status: BasicStatusEnum,
      } >,
      status: BasicStatusEnum,
    } >,
    status: BasicStatusEnum,
  } >,
};

export type GetIbisProbeQueryVariables = {
  id: string,
};

export type GetIbisProbeQuery = {
  getIbisProbe?:  {
    __typename: "IbisProbe",
    id: string,
    ownerId: string,
    refNo: string,
    name: string,
    url: string,
    description?: string | null,
    fileGroupSetting:  {
      __typename: "IbisFileGroupSetting",
      id: string,
      name: string,
      description?: string | null,
      fileCombinations?:  Array< {
        __typename: "IbisFileCombination",
        id: string,
        name: string,
        description?: string | null,
        category?:  {
          __typename: "IbisFileCategory",
          id: string,
          name: string,
          description?: string | null,
          acceptableExtensions: Array< string >,
          status: BasicStatusEnum,
        } | null,
        quantity: number,
        status: BasicStatusEnum,
      } > | null,
      ownerId: string,
      status: BasicStatusEnum,
    },
    isPublic: boolean,
    type: ProbeTypeEnum,
    subprobes:  Array< {
      __typename: "IbisSubProbe",
      id: string,
      ownerId: string,
      name: string,
      description?: string | null,
      isVisible: boolean,
      parameters:  Array< {
        __typename: "IbisParameter",
        id: string,
        ownerId?: string | null,
        name: string,
        value: number,
        type?: string | null,
        minThreshold?: number | null,
        maxThreshold?: number | null,
        unit?: string | null,
        valueType?: string | null,
        isIncludedValue: boolean,
        subProbeId: string,
        status: BasicStatusEnum,
      } >,
      status: BasicStatusEnum,
    } >,
    status: BasicStatusEnum,
  } | null,
};

export type ListIbisSubProbesQueryVariables = {
  probeId: string,
};

export type ListIbisSubProbesQuery = {
  listIbisSubProbes:  Array< {
    __typename: "IbisSubProbe",
    id: string,
    ownerId: string,
    name: string,
    description?: string | null,
    isVisible: boolean,
    parameters:  Array< {
      __typename: "IbisParameter",
      id: string,
      ownerId?: string | null,
      name: string,
      value: number,
      type?: string | null,
      minThreshold?: number | null,
      maxThreshold?: number | null,
      unit?: string | null,
      valueType?: string | null,
      isIncludedValue: boolean,
      subProbeId: string,
      status: BasicStatusEnum,
    } >,
    status: BasicStatusEnum,
  } >,
};

export type ListIbisParametersQueryVariables = {
  subprobeId: string,
};

export type ListIbisParametersQuery = {
  listIbisParameters:  Array< {
    __typename: "IbisParameter",
    id: string,
    ownerId?: string | null,
    name: string,
    value: number,
    type?: string | null,
    minThreshold?: number | null,
    maxThreshold?: number | null,
    unit?: string | null,
    valueType?: string | null,
    isIncludedValue: boolean,
    subProbeId: string,
    status: BasicStatusEnum,
  } >,
};

export type ListIbisInspectionsQueryVariables = {
  projectId: string,
  name?: string | null,
};

export type ListIbisInspectionsQuery = {
  listIbisInspections:  Array< {
    __typename: "IbisInspection",
    id: string,
    refNo: string,
    name: string,
    description?: string | null,
    type: ProbeTypeEnum,
    status: InspectionStatusEnum,
    probeGroupResults:  Array< {
      __typename: "IbisProbeGroupResult",
      id: string,
      probeGroupId: string,
      inspectionId: string,
      description?: string | null,
      status: string,
      probeResults:  Array< {
        __typename: "IbisProbeResult",
        id: string,
        probeId: string,
        resultFileId?: string | null,
        status?: string | null,
        inputFileIds?: Array< string > | null,
        inputFiles?:  Array< {
          __typename: "IbisFile",
          id: string,
          name: string,
          filepath: string,
          projectId: string,
          description?: string | null,
          isGenerated: boolean,
          createdOn: string,
          status: BasicStatusEnum,
        } > | null,
        description?: string | null,
        probeGroupResultId: string,
      } >,
    } >,
    projectId: string,
  } >,
};

export type GetIbisInspectionQueryVariables = {
  id: string,
};

export type GetIbisInspectionQuery = {
  getIbisInspection?:  {
    __typename: "IbisInspection",
    id: string,
    refNo: string,
    name: string,
    description?: string | null,
    type: ProbeTypeEnum,
    status: InspectionStatusEnum,
    probeGroupResults:  Array< {
      __typename: "IbisProbeGroupResult",
      id: string,
      probeGroupId: string,
      inspectionId: string,
      description?: string | null,
      status: string,
      probeResults:  Array< {
        __typename: "IbisProbeResult",
        id: string,
        probeId: string,
        resultFileId?: string | null,
        status?: string | null,
        inputFileIds?: Array< string > | null,
        inputFiles?:  Array< {
          __typename: "IbisFile",
          id: string,
          name: string,
          filepath: string,
          projectId: string,
          description?: string | null,
          isGenerated: boolean,
          createdOn: string,
          status: BasicStatusEnum,
        } > | null,
        description?: string | null,
        probeGroupResultId: string,
      } >,
    } >,
    projectId: string,
  } | null,
};

export type GetIbisProbeGroupResultQueryVariables = {
  id: string,
};

export type GetIbisProbeGroupResultQuery = {
  getIbisProbeGroupResult?:  {
    __typename: "IbisProbeGroupResult",
    id: string,
    probeGroupId: string,
    inspectionId: string,
    description?: string | null,
    status: string,
    probeResults:  Array< {
      __typename: "IbisProbeResult",
      id: string,
      probeId: string,
      resultFileId?: string | null,
      status?: string | null,
      inputFileIds?: Array< string > | null,
      inputFiles?:  Array< {
        __typename: "IbisFile",
        id: string,
        name: string,
        filepath: string,
        projectId: string,
        fileMetadata:  Array< {
          __typename: "IbisFileMetadata",
          id: string,
          key: string,
          value: string,
          fileId: string,
        } >,
        description?: string | null,
        isGenerated: boolean,
        createdOn: string,
        status: BasicStatusEnum,
      } > | null,
      description?: string | null,
      probeGroupResultId: string,
    } >,
  } | null,
};

export type GetIbisProbeResultQueryVariables = {
  id: string,
};

export type GetIbisProbeResultQuery = {
  getIbisProbeResult?:  {
    __typename: "IbisProbeResult",
    id: string,
    probeId: string,
    resultFileId?: string | null,
    status?: string | null,
    inputFileIds?: Array< string > | null,
    inputFiles?:  Array< {
      __typename: "IbisFile",
      id: string,
      name: string,
      filepath: string,
      projectId: string,
      fileMetadata:  Array< {
        __typename: "IbisFileMetadata",
        id: string,
        key: string,
        value: string,
        fileId: string,
      } >,
      description?: string | null,
      isGenerated: boolean,
      createdOn: string,
      status: BasicStatusEnum,
    } > | null,
    description?: string | null,
    probeGroupResultId: string,
  } | null,
};

export type OnUpdateIbisProbeResultStatusSubscriptionVariables = {
  id: string,
};

export type OnUpdateIbisProbeResultStatusSubscription = {
  onUpdateIbisProbeResultStatus?:  {
    __typename: "IbisProbeResult",
    id: string,
    probeId: string,
    resultFileId?: string | null,
    status?: string | null,
    inputFileIds?: Array< string > | null,
    inputFiles?:  Array< {
      __typename: "IbisFile",
      id: string,
      name: string,
      filepath: string,
      projectId: string,
      fileMetadata:  Array< {
        __typename: "IbisFileMetadata",
        id: string,
        key: string,
        value: string,
        fileId: string,
      } >,
      description?: string | null,
      isGenerated: boolean,
      createdOn: string,
      status: BasicStatusEnum,
    } > | null,
    description?: string | null,
    probeGroupResultId: string,
  } | null,
};
