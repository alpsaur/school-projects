/* Amplify Params - DO NOT EDIT
	AUTH_IBIS3819DDBF_USERPOOLID
	ENV
	REGION
	STORAGE_IBISFILESTORAGE_BUCKETNAME
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { defaultProvider } from "@aws-sdk/credential-provider-node";

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: defaultProvider(),
});

export async function handler(event) {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  try {
    const requestBody = JSON.parse(event.body);
    const fileData = requestBody.file;
    const fileBuffer = Buffer.from(fileData, "utf-8");

    const metadata = requestBody.filemetadata;
    const key = requestBody.key;
    const bucket = process.env.STORAGE_IBISFILESTORAGE_BUCKETNAME;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: "application/json",
      Metadata: metadata,
    });

    const value = await s3Client.send(command);
    console.log("The S3 return value is: ", value);

    return {
      statusCode: 200,
      //  Uncomment below to enable CORS requests
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify("Upload File through REST API success!"),
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to upload file",
        error: error.message,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
    };
  }
}
