/* Amplify Params - DO NOT EDIT
  API_IBISGRAPHQLAPIV2_GRAPHQLAPIENDPOINTOUTPUT
  API_IBISGRAPHQLAPIV2_GRAPHQLAPIIDOUTPUT
  API_IBISGRAPHQLAPIV2_GRAPHQLAPIKEYOUTPUT
  ENV
  REGION
Amplify Params - DO NOT EDIT */

import crypto from "@aws-crypto/sha256-js";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { default as fetch, Request } from "node-fetch";
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";

const GRAPHQL_ENDPOINT =
  process.env.API_IBISGRAPHQLAPIV2_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.AWS_REGION || "ap-southeast-1";
const { Sha256 } = crypto;

const CreateIbisFile = /* GraphQL */ `
  mutation CreateIbisFile($input: CreateFileInput!) {
    createIbisFile(input: $input)
  }
`;

const UpdateIbisProbeResultStatus = /* GraphQL */ `
  mutation UpdateIbisProbeResultStatus($input: CreateProbeResultInput!) {
    updateIbisProbeResultStatus(input: $input) {
      id
      probeId
      resultFileId
      status
      inputFileIds
      inputFiles {
        id
        name
        fileCategory {
          id
          name
          description
          acceptableExtensions
          __typename
        }
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
        __typename
      }
      description
      probeGroupResultId
      __typename
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;
  console.log(`Bucket: ${bucket}`, `Key: ${key}`);

  const endpoint = new URL(GRAPHQL_ENDPOINT);

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region: AWS_REGION,
    service: "appsync",
    sha256: Sha256,
  });

  const client = new S3Client({
    region: AWS_REGION,
    credentials: defaultProvider(),
  });

  const newKey = key.replace(/\+/g, " ");
  const filePath = decodeURIComponent(newKey);
  const input = {
    Bucket: bucket,
    Key: filePath,
  };

  const commond = new HeadObjectCommand(input);
  const data = await client.send(commond);
  const metadata = data.Metadata;

  console.log("The fetched metadata is: ", JSON.stringify(metadata, null, 2));

  const tags = JSON.parse(metadata.filemetadata);
  console.log("The filemetadata array is: ", tags);
  const tagsArray =
    tags.length > 0
      ? tags.map((tag) => ({
          key: tag.key,
          value: tag.value,
        }))
      : [];

  let isUpdateInput = false;
  if (metadata.updateinput) {
    isUpdateInput = true;
    console.log("Metadata contain updateInput: ", metadata.updateinput);
  }

  // metadata information is lower case.
  const file = {
    input: {
      name: metadata.name,
      fileCategoryId: metadata.filecategoryid,
      filepath: filePath,
      projectId: metadata.projectid,
      description: metadata.description,
      fileMetadata: tagsArray,
      isGenerated: isUpdateInput,
    },
  };

  console.log("MetaData from S3: ", JSON.stringify(file));

  const requestToBeSigned = new HttpRequest({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      host: endpoint.host,
    },
    hostname: endpoint.host,
    body: JSON.stringify({ query: CreateIbisFile, variables: file }),
    path: endpoint.pathname,
  });

  const signed = await signer.sign(requestToBeSigned);
  const request = new Request(endpoint, signed);

  let statusCode = 200;
  let body;
  let response;

  try {
    response = await fetch(request);
    body = await response.json();
    if (body.errors) {
      statusCode = 400;
      console.log(body.errors);
    }
    console.log("The response body is: ", body);

    // console.log("Need to update proberesult? ", isUpdateInput);

    if (isUpdateInput) {
      console.log("Start Update Proberesult ...");
      const fileid = body.data.createIbisFile; // the create graphql mutation will return the created document's id
      const updateInput = JSON.parse(metadata.updateinput);

      // console.log("The parsed updateInput is: ", updateInput);

      const updateVariable = {
        input: {
          id: updateInput.id,
          resultFileId: fileid,
          status: updateInput.status,
          description: updateInput.description,
        },
      };

      console.log("The Update Input is: ", JSON.stringify(updateVariable));

      const updateRequestToBeSigned = new HttpRequest({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          host: endpoint.host,
        },
        hostname: endpoint.host,
        body: JSON.stringify({
          query: UpdateIbisProbeResultStatus,
          variables: updateVariable,
        }),
        path: endpoint.pathname,
      });

      console.log("Signing the update request...");
      const updateSigned = await signer.sign(updateRequestToBeSigned);
      console.log("Update request signed successfully. ", updateSigned);

      const updateRequest = new Request(endpoint, updateSigned);

      console.log("Sending the update request...");
      response = await fetch(updateRequest);
      console.log("Update request sent, awaiting response...");

      body = await response.json();
      if (body.errors) {
        statusCode = 400;
        console.log(body.errors);
      }
      console.log("The update response body is: ", body);
    }
  } catch (error) {
    statusCode = 500;
    body = {
      errors: [
        {
          message: error.message,
        },
      ],
    };
    console.error("Error occurred: ", error);
  }

  return {
    statusCode,
    //  Uncomment below to enable CORS requests
    // headers: {
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Headers": "*"
    // },
    body: JSON.stringify(body),
  };
};
