import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { CreateProbeResultInput } from "@/API";
import { Amplify } from "aws-amplify";
import config from "@/amplifyconfiguration.json";
import { post } from "@aws-amplify/api/server";
import { runWithAmplifyServerContext } from "@/app/utils/amplifyServerUtils";
Amplify.configure(config, { ssr: true });

export async function POST(req: NextRequest) {
  const res = NextResponse.next();
  try {
    // Parse the request body
    const requestData = await req.json();
    const resultData = requestData.result;
    const proberesultId: string = resultData.id;
    const proberesultStatus: string =
      resultData.status === "PASS" ? "PASS" : "FAILED";
    const proberesultDesc: string = resultData.description;

    const updateproberesultInput: CreateProbeResultInput = {
      id: proberesultId,
      status: proberesultStatus,
      resultFileId: "",
      description: proberesultDesc,
    };

    // upload result file to database...
    const projectId: string = requestData.projectId;
    const fileName: string = `${uuidv4()}.json`;

    const tags: any[] = [];
    const metadata = {
      name: fileName,
      fileCategoryId: "6674ea828e4b15846a518d89",
      projectId: projectId,
      description: "probe result file for inspection test ...",
      fileMetadata: JSON.stringify(tags),
      updateInput: JSON.stringify(updateproberesultInput),
    };

    console.log("Start sending request to REST API ...");

    const result = await runWithAmplifyServerContext({
      nextServerContext: { request: req, response: res },
      operation: async (contextSpec) => {
        try {
          const restOperation = post(contextSpec, {
            apiName: "apiUploadResultFile",
            path: "/uploadresult",
            options: {
              body: {
                file: JSON.stringify(requestData, null, 2),
                filemetadata: metadata,
                key: `private/${
                  process.env.NEXT_PUBLIC_S3_FOLDER_NAME as string
                }/${fileName}`,
              },
            },
          });
          const { body } = await restOperation.response;
          const response = await body.json();
          console.log("POST call succeeded");
          console.log(response);
          return response;
        } catch (error: any) {
          console.error("Request failed: ", error);
          throw error;
        }
      },
    });

    console.log("Result: ", result);

    return NextResponse.json(
      { message: "File uploaded successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Failed to upload file through API ... ", error);

    return NextResponse.json(
      { message: "File upload failed", error: error.message },
      { status: 500 }
    );
  }
}
