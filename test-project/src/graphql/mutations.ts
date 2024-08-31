/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createIbisProject = /* GraphQL */ `mutation CreateIbisProject($input: CreateProjectInput!) {
  createIbisProject(input: $input)
}
` as GeneratedMutation<
  APITypes.CreateIbisProjectMutationVariables,
  APITypes.CreateIbisProjectMutation
>;
export const updateIbisProject = /* GraphQL */ `mutation UpdateIbisProject($input: CreateProjectInput!) {
  updateIbisProject(input: $input)
}
` as GeneratedMutation<
  APITypes.UpdateIbisProjectMutationVariables,
  APITypes.UpdateIbisProjectMutation
>;
export const deleteIbisProject = /* GraphQL */ `mutation DeleteIbisProject($deleteId: ID!) {
  deleteIbisProject(deleteId: $deleteId)
}
` as GeneratedMutation<
  APITypes.DeleteIbisProjectMutationVariables,
  APITypes.DeleteIbisProjectMutation
>;
export const createIbisFile = /* GraphQL */ `mutation CreateIbisFile($input: CreateFileInput!) {
  createIbisFile(input: $input)
}
` as GeneratedMutation<
  APITypes.CreateIbisFileMutationVariables,
  APITypes.CreateIbisFileMutation
>;
export const updateIbisFile = /* GraphQL */ `mutation UpdateIbisFile($input: CreateFileInput!) {
  updateIbisFile(input: $input)
}
` as GeneratedMutation<
  APITypes.UpdateIbisFileMutationVariables,
  APITypes.UpdateIbisFileMutation
>;
export const deleteIbisFile = /* GraphQL */ `mutation DeleteIbisFile($deleteId: ID!) {
  deleteIbisFile(deleteId: $deleteId)
}
` as GeneratedMutation<
  APITypes.DeleteIbisFileMutationVariables,
  APITypes.DeleteIbisFileMutation
>;
export const createIbisFileCategory = /* GraphQL */ `mutation CreateIbisFileCategory($input: CreateFileCategoryInput!) {
  createIbisFileCategory(input: $input)
}
` as GeneratedMutation<
  APITypes.CreateIbisFileCategoryMutationVariables,
  APITypes.CreateIbisFileCategoryMutation
>;
export const updateIbisFileCategory = /* GraphQL */ `mutation UpdateIbisFileCategory($input: UpdateFileCategoryInput!) {
  updateIbisFileCategory(input: $input)
}
` as GeneratedMutation<
  APITypes.UpdateIbisFileCategoryMutationVariables,
  APITypes.UpdateIbisFileCategoryMutation
>;
export const deleteIbisFileCategory = /* GraphQL */ `mutation DeleteIbisFileCategory($deleteId: ID!) {
  deleteIbisFileCategory(deleteId: $deleteId)
}
` as GeneratedMutation<
  APITypes.DeleteIbisFileCategoryMutationVariables,
  APITypes.DeleteIbisFileCategoryMutation
>;
export const createIbisFileCombination = /* GraphQL */ `mutation CreateIbisFileCombination($input: CreateFileCombinationInput!) {
  createIbisFileCombination(input: $input)
}
` as GeneratedMutation<
  APITypes.CreateIbisFileCombinationMutationVariables,
  APITypes.CreateIbisFileCombinationMutation
>;
export const updateIbisFileCombination = /* GraphQL */ `mutation UpdateIbisFileCombination($input: UpdateFileCombinationInput!) {
  updateIbisFileCombination(input: $input)
}
` as GeneratedMutation<
  APITypes.UpdateIbisFileCombinationMutationVariables,
  APITypes.UpdateIbisFileCombinationMutation
>;
export const deleteIbisFileCombination = /* GraphQL */ `mutation DeleteIbisFileCombination($deleteId: ID!) {
  deleteIbisFileCombination(deleteId: $deleteId)
}
` as GeneratedMutation<
  APITypes.DeleteIbisFileCombinationMutationVariables,
  APITypes.DeleteIbisFileCombinationMutation
>;
export const createIbisFileGroupSetting = /* GraphQL */ `mutation CreateIbisFileGroupSetting($input: CreateFileGroupSettingInput!) {
  createIbisFileGroupSetting(input: $input)
}
` as GeneratedMutation<
  APITypes.CreateIbisFileGroupSettingMutationVariables,
  APITypes.CreateIbisFileGroupSettingMutation
>;
export const updateIbisFileGroupSetting = /* GraphQL */ `mutation UpdateIbisFileGroupSetting($input: UpdateFileGroupSettingInput!) {
  updateIbisFileGroupSetting(input: $input)
}
` as GeneratedMutation<
  APITypes.UpdateIbisFileGroupSettingMutationVariables,
  APITypes.UpdateIbisFileGroupSettingMutation
>;
export const deleteIbisFileGroupSetting = /* GraphQL */ `mutation DeleteIbisFileGroupSetting($deleteId: ID!) {
  deleteIbisFileGroupSetting(deleteId: $deleteId)
}
` as GeneratedMutation<
  APITypes.DeleteIbisFileGroupSettingMutationVariables,
  APITypes.DeleteIbisFileGroupSettingMutation
>;
export const createIbisFileMetadata = /* GraphQL */ `mutation CreateIbisFileMetadata($input: CreateFileMetadataInput!) {
  createIbisFileMetadata(input: $input)
}
` as GeneratedMutation<
  APITypes.CreateIbisFileMetadataMutationVariables,
  APITypes.CreateIbisFileMetadataMutation
>;
export const updateIbisFileMetadata = /* GraphQL */ `mutation UpdateIbisFileMetadata($input: CreateFileMetadataInput!) {
  updateIbisFileMetadata(input: $input)
}
` as GeneratedMutation<
  APITypes.UpdateIbisFileMetadataMutationVariables,
  APITypes.UpdateIbisFileMetadataMutation
>;
export const deleteIbisFileMetadata = /* GraphQL */ `mutation DeleteIbisFileMetadata($deleteId: ID!) {
  deleteIbisFileMetadata(deleteId: $deleteId)
}
` as GeneratedMutation<
  APITypes.DeleteIbisFileMetadataMutationVariables,
  APITypes.DeleteIbisFileMetadataMutation
>;
export const createIbisProbeGroup = /* GraphQL */ `mutation CreateIbisProbeGroup($input: CreateProbeGroupInput!) {
  createIbisProbeGroup(input: $input)
}
` as GeneratedMutation<
  APITypes.CreateIbisProbeGroupMutationVariables,
  APITypes.CreateIbisProbeGroupMutation
>;
export const updateIbisProbeGroup = /* GraphQL */ `mutation UpdateIbisProbeGroup($input: CreateProbeGroupInput!) {
  updateIbisProbeGroup(input: $input)
}
` as GeneratedMutation<
  APITypes.UpdateIbisProbeGroupMutationVariables,
  APITypes.UpdateIbisProbeGroupMutation
>;
export const deleteIbisProbeGroup = /* GraphQL */ `mutation DeleteIbisProbeGroup($deleteId: ID!) {
  deleteIbisProbeGroup(deleteId: $deleteId)
}
` as GeneratedMutation<
  APITypes.DeleteIbisProbeGroupMutationVariables,
  APITypes.DeleteIbisProbeGroupMutation
>;
export const createIbisProbe = /* GraphQL */ `mutation CreateIbisProbe($input: CreateProbeInput!) {
  createIbisProbe(input: $input)
}
` as GeneratedMutation<
  APITypes.CreateIbisProbeMutationVariables,
  APITypes.CreateIbisProbeMutation
>;
export const updateIbisProbe = /* GraphQL */ `mutation UpdateIbisProbe($input: UpdateProbeInput!) {
  updateIbisProbe(input: $input)
}
` as GeneratedMutation<
  APITypes.UpdateIbisProbeMutationVariables,
  APITypes.UpdateIbisProbeMutation
>;
export const deleteIbisProbe = /* GraphQL */ `mutation DeleteIbisProbe($deleteId: ID!) {
  deleteIbisProbe(deleteId: $deleteId)
}
` as GeneratedMutation<
  APITypes.DeleteIbisProbeMutationVariables,
  APITypes.DeleteIbisProbeMutation
>;
export const createIbisSubProbe = /* GraphQL */ `mutation CreateIbisSubProbe($input: CreateSubProbeInput!) {
  createIbisSubProbe(input: $input)
}
` as GeneratedMutation<
  APITypes.CreateIbisSubProbeMutationVariables,
  APITypes.CreateIbisSubProbeMutation
>;
export const updateIbisSubProbe = /* GraphQL */ `mutation UpdateIbisSubProbe($input: CreateSubProbeInput!) {
  updateIbisSubProbe(input: $input)
}
` as GeneratedMutation<
  APITypes.UpdateIbisSubProbeMutationVariables,
  APITypes.UpdateIbisSubProbeMutation
>;
export const deleteIbisSubProbe = /* GraphQL */ `mutation DeleteIbisSubProbe($deleteId: ID!) {
  deleteIbisSubProbe(deleteId: $deleteId)
}
` as GeneratedMutation<
  APITypes.DeleteIbisSubProbeMutationVariables,
  APITypes.DeleteIbisSubProbeMutation
>;
export const createIbisParameter = /* GraphQL */ `mutation CreateIbisParameter($input: CreateParameterInput!) {
  createIbisParameter(input: $input)
}
` as GeneratedMutation<
  APITypes.CreateIbisParameterMutationVariables,
  APITypes.CreateIbisParameterMutation
>;
export const updateIbisParameter = /* GraphQL */ `mutation UpdateIbisParameter($input: CreateParameterInput!) {
  updateIbisParameter(input: $input)
}
` as GeneratedMutation<
  APITypes.UpdateIbisParameterMutationVariables,
  APITypes.UpdateIbisParameterMutation
>;
export const deleteIbisParameter = /* GraphQL */ `mutation DeleteIbisParameter($deleteId: ID!) {
  deleteIbisParameter(deleteId: $deleteId)
}
` as GeneratedMutation<
  APITypes.DeleteIbisParameterMutationVariables,
  APITypes.DeleteIbisParameterMutation
>;
export const createIbisInspection = /* GraphQL */ `mutation CreateIbisInspection($input: CreateInspectionInput!) {
  createIbisInspection(input: $input)
}
` as GeneratedMutation<
  APITypes.CreateIbisInspectionMutationVariables,
  APITypes.CreateIbisInspectionMutation
>;
export const updateIbisInspection = /* GraphQL */ `mutation UpdateIbisInspection($input: UpdateInspectionInput!) {
  updateIbisInspection(input: $input)
}
` as GeneratedMutation<
  APITypes.UpdateIbisInspectionMutationVariables,
  APITypes.UpdateIbisInspectionMutation
>;
export const deleteIbisInspection = /* GraphQL */ `mutation DeleteIbisInspection($deleteId: ID!) {
  deleteIbisInspection(deleteId: $deleteId)
}
` as GeneratedMutation<
  APITypes.DeleteIbisInspectionMutationVariables,
  APITypes.DeleteIbisInspectionMutation
>;
export const createIbisProbeGroupResult = /* GraphQL */ `mutation CreateIbisProbeGroupResult($input: CreateProbeGroupResultInput!) {
  createIbisProbeGroupResult(input: $input)
}
` as GeneratedMutation<
  APITypes.CreateIbisProbeGroupResultMutationVariables,
  APITypes.CreateIbisProbeGroupResultMutation
>;
export const updateIbisProbeGroupResult = /* GraphQL */ `mutation UpdateIbisProbeGroupResult($input: CreateProbeGroupResultInput!) {
  updateIbisProbeGroupResult(input: $input)
}
` as GeneratedMutation<
  APITypes.UpdateIbisProbeGroupResultMutationVariables,
  APITypes.UpdateIbisProbeGroupResultMutation
>;
export const deleteIbisProbeGroupResult = /* GraphQL */ `mutation DeleteIbisProbeGroupResult($deleteId: ID!) {
  deleteIbisProbeGroupResult(deleteId: $deleteId)
}
` as GeneratedMutation<
  APITypes.DeleteIbisProbeGroupResultMutationVariables,
  APITypes.DeleteIbisProbeGroupResultMutation
>;
export const createIbisProbeResult = /* GraphQL */ `mutation CreateIbisProbeResult($input: CreateProbeResultInput!) {
  createIbisProbeResult(input: $input)
}
` as GeneratedMutation<
  APITypes.CreateIbisProbeResultMutationVariables,
  APITypes.CreateIbisProbeResultMutation
>;
export const updateIbisProbeResult = /* GraphQL */ `mutation UpdateIbisProbeResult($input: CreateProbeResultInput!) {
  updateIbisProbeResult(input: $input)
}
` as GeneratedMutation<
  APITypes.UpdateIbisProbeResultMutationVariables,
  APITypes.UpdateIbisProbeResultMutation
>;
export const deleteIbisProbeResult = /* GraphQL */ `mutation DeleteIbisProbeResult($deleteId: ID!) {
  deleteIbisProbeResult(deleteId: $deleteId)
}
` as GeneratedMutation<
  APITypes.DeleteIbisProbeResultMutationVariables,
  APITypes.DeleteIbisProbeResultMutation
>;
export const updateIbisProbeResultStatus = /* GraphQL */ `mutation UpdateIbisProbeResultStatus($input: CreateProbeResultInput!) {
  updateIbisProbeResultStatus(input: $input) {
    id
    probeId
    resultFileId
    status
    inputFileIds
    inputFiles {
      id
      name
      filepath
      projectId
      fileMetadata {
        id
        key
        value
        fileId
        __typename
      }
      description
      isGenerated
      createdOn
      status
      __typename
    }
    description
    probeGroupResultId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateIbisProbeResultStatusMutationVariables,
  APITypes.UpdateIbisProbeResultStatusMutation
>;
