/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onUpdateIbisProbeResultStatus = /* GraphQL */ `subscription OnUpdateIbisProbeResultStatus($id: ID!) {
  onUpdateIbisProbeResultStatus(id: $id) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateIbisProbeResultStatusSubscriptionVariables,
  APITypes.OnUpdateIbisProbeResultStatusSubscription
>;
