/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const listIbisProjects = /* GraphQL */ `query ListIbisProjects($ownerId: String!) {
  listIbisProjects(ownerId: $ownerId) {
    id
    name
    description
    ownerId
    createdOn
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListIbisProjectsQueryVariables,
  APITypes.ListIbisProjectsQuery
>;
export const getIbisProject = /* GraphQL */ `query GetIbisProject($id: ID!) {
  getIbisProject(id: $id) {
    id
    name
    description
    ownerId
    createdOn
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetIbisProjectQueryVariables,
  APITypes.GetIbisProjectQuery
>;
export const listIbisFiles = /* GraphQL */ `query ListIbisFiles($projectId: ID!, $categoryId: ID) {
  listIbisFiles(projectId: $projectId, categoryId: $categoryId) {
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
}
` as GeneratedQuery<
  APITypes.ListIbisFilesQueryVariables,
  APITypes.ListIbisFilesQuery
>;
export const getIbisFile = /* GraphQL */ `query GetIbisFile($id: ID!) {
  getIbisFile(id: $id) {
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
}
` as GeneratedQuery<
  APITypes.GetIbisFileQueryVariables,
  APITypes.GetIbisFileQuery
>;
export const listIbisFileCategories = /* GraphQL */ `query ListIbisFileCategories {
  listIbisFileCategories {
    id
    name
    description
    acceptableExtensions
    status
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListIbisFileCategoriesQueryVariables,
  APITypes.ListIbisFileCategoriesQuery
>;
export const getIbisFileCategory = /* GraphQL */ `query GetIbisFileCategory($id: ID!) {
  getIbisFileCategory(id: $id) {
    id
    name
    description
    acceptableExtensions
    status
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetIbisFileCategoryQueryVariables,
  APITypes.GetIbisFileCategoryQuery
>;
export const getIbisFileCombination = /* GraphQL */ `query GetIbisFileCombination($id: ID!) {
  getIbisFileCombination(id: $id) {
    id
    name
    description
    category {
      id
      name
      description
      acceptableExtensions
      status
      __typename
    }
    quantity
    status
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetIbisFileCombinationQueryVariables,
  APITypes.GetIbisFileCombinationQuery
>;
export const listIbisFileGroupSettings = /* GraphQL */ `query ListIbisFileGroupSettings {
  listIbisFileGroupSettings {
    id
    name
    description
    fileCombinations {
      id
      name
      description
      category {
        id
        name
        description
        acceptableExtensions
        status
        __typename
      }
      quantity
      status
      __typename
    }
    ownerId
    status
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListIbisFileGroupSettingsQueryVariables,
  APITypes.ListIbisFileGroupSettingsQuery
>;
export const getIbisFileGroupSetting = /* GraphQL */ `query GetIbisFileGroupSetting($id: ID!) {
  getIbisFileGroupSetting(id: $id) {
    id
    name
    description
    fileCombinations {
      id
      name
      description
      category {
        id
        name
        description
        acceptableExtensions
        status
        __typename
      }
      quantity
      status
      __typename
    }
    ownerId
    status
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetIbisFileGroupSettingQueryVariables,
  APITypes.GetIbisFileGroupSettingQuery
>;
export const listIbisProbeGroups = /* GraphQL */ `query ListIbisProbeGroups($name: String) {
  listIbisProbeGroups(name: $name) {
    id
    ownerId
    refNo
    name
    description
    isPublic
    probes {
      id
      ownerId
      refNo
      name
      url
      description
      fileGroupSetting {
        id
        name
        description
        fileCombinations {
          id
          name
          description
          quantity
          status
          __typename
        }
        ownerId
        status
        __typename
      }
      isPublic
      type
      subprobes {
        id
        ownerId
        name
        description
        isVisible
        parameters {
          id
          ownerId
          name
          value
          type
          minThreshold
          maxThreshold
          unit
          valueType
          isIncludedValue
          subProbeId
          status
          __typename
        }
        status
        __typename
      }
      status
      __typename
    }
    type
    status
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListIbisProbeGroupsQueryVariables,
  APITypes.ListIbisProbeGroupsQuery
>;
export const getIbisProbeGroup = /* GraphQL */ `query GetIbisProbeGroup($id: ID!) {
  getIbisProbeGroup(id: $id) {
    id
    ownerId
    refNo
    name
    description
    isPublic
    probes {
      id
      ownerId
      refNo
      name
      url
      description
      fileGroupSetting {
        id
        name
        description
        fileCombinations {
          id
          name
          description
          quantity
          status
          __typename
        }
        ownerId
        status
        __typename
      }
      isPublic
      type
      subprobes {
        id
        ownerId
        name
        description
        isVisible
        parameters {
          id
          ownerId
          name
          value
          type
          minThreshold
          maxThreshold
          unit
          valueType
          isIncludedValue
          subProbeId
          status
          __typename
        }
        status
        __typename
      }
      status
      __typename
    }
    type
    status
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetIbisProbeGroupQueryVariables,
  APITypes.GetIbisProbeGroupQuery
>;
export const listIbisProbes = /* GraphQL */ `query ListIbisProbes($name: String, $type: String) {
  listIbisProbes(name: $name, type: $type) {
    id
    ownerId
    refNo
    name
    url
    description
    fileGroupSetting {
      id
      name
      description
      fileCombinations {
        id
        name
        description
        category {
          id
          name
          description
          acceptableExtensions
          status
          __typename
        }
        quantity
        status
        __typename
      }
      ownerId
      status
      __typename
    }
    isPublic
    type
    subprobes {
      id
      ownerId
      name
      description
      isVisible
      parameters {
        id
        ownerId
        name
        value
        type
        minThreshold
        maxThreshold
        unit
        valueType
        isIncludedValue
        subProbeId
        status
        __typename
      }
      status
      __typename
    }
    status
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListIbisProbesQueryVariables,
  APITypes.ListIbisProbesQuery
>;
export const getIbisProbe = /* GraphQL */ `query GetIbisProbe($id: ID!) {
  getIbisProbe(id: $id) {
    id
    ownerId
    refNo
    name
    url
    description
    fileGroupSetting {
      id
      name
      description
      fileCombinations {
        id
        name
        description
        category {
          id
          name
          description
          acceptableExtensions
          status
          __typename
        }
        quantity
        status
        __typename
      }
      ownerId
      status
      __typename
    }
    isPublic
    type
    subprobes {
      id
      ownerId
      name
      description
      isVisible
      parameters {
        id
        ownerId
        name
        value
        type
        minThreshold
        maxThreshold
        unit
        valueType
        isIncludedValue
        subProbeId
        status
        __typename
      }
      status
      __typename
    }
    status
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetIbisProbeQueryVariables,
  APITypes.GetIbisProbeQuery
>;
export const listIbisSubProbes = /* GraphQL */ `query ListIbisSubProbes($probeId: ID!) {
  listIbisSubProbes(probeId: $probeId) {
    id
    ownerId
    name
    description
    isVisible
    parameters {
      id
      ownerId
      name
      value
      type
      minThreshold
      maxThreshold
      unit
      valueType
      isIncludedValue
      subProbeId
      status
      __typename
    }
    status
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListIbisSubProbesQueryVariables,
  APITypes.ListIbisSubProbesQuery
>;
export const listIbisParameters = /* GraphQL */ `query ListIbisParameters($subprobeId: ID!) {
  listIbisParameters(subprobeId: $subprobeId) {
    id
    ownerId
    name
    value
    type
    minThreshold
    maxThreshold
    unit
    valueType
    isIncludedValue
    subProbeId
    status
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListIbisParametersQueryVariables,
  APITypes.ListIbisParametersQuery
>;
export const listIbisInspections = /* GraphQL */ `query ListIbisInspections($projectId: ID!, $name: String) {
  listIbisInspections(projectId: $projectId, name: $name) {
    id
    refNo
    name
    description
    type
    status
    probeGroupResults {
      id
      probeGroupId
      inspectionId
      description
      status
      probeResults {
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
      __typename
    }
    projectId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListIbisInspectionsQueryVariables,
  APITypes.ListIbisInspectionsQuery
>;
export const getIbisInspection = /* GraphQL */ `query GetIbisInspection($id: ID!) {
  getIbisInspection(id: $id) {
    id
    refNo
    name
    description
    type
    status
    probeGroupResults {
      id
      probeGroupId
      inspectionId
      description
      status
      probeResults {
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
      __typename
    }
    projectId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetIbisInspectionQueryVariables,
  APITypes.GetIbisInspectionQuery
>;
export const getIbisProbeGroupResult = /* GraphQL */ `query GetIbisProbeGroupResult($id: ID!) {
  getIbisProbeGroupResult(id: $id) {
    id
    probeGroupId
    inspectionId
    description
    status
    probeResults {
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
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetIbisProbeGroupResultQueryVariables,
  APITypes.GetIbisProbeGroupResultQuery
>;
export const getIbisProbeResult = /* GraphQL */ `query GetIbisProbeResult($id: ID!) {
  getIbisProbeResult(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetIbisProbeResultQueryVariables,
  APITypes.GetIbisProbeResultQuery
>;
