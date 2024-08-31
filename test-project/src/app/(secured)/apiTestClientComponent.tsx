"use client";

import React, { useState } from "react";
import { post } from "aws-amplify/api";

import { Amplify } from "aws-amplify";
import config from "@/amplifyconfiguration.json";
import { fetchAuthSession } from "aws-amplify/auth";
import { IbisLoadingBtn } from "@/components/IbisComponent/IbisLoadingBtn";
Amplify.configure(config, { ssr: true });

async function quickTestUploadFileApi() {
  const authToken = (
    await fetchAuthSession()
  ).tokens?.idToken?.toString() as string;
  console.log("End fetching accessToken: ", authToken);

  const fileName = "dummytestRestApi123.json";
  const metadata = {
    name: fileName,
    fileCategoryId: "6674ea828e4b15846a518d89",
    projectId: "669884e39c04c9b4ea5a1602",
    description: "probe result file for inspection test ...",
    fileMetadata: JSON.stringify([]),
  };
  try {
    const restOperation = post({
      apiName: "apiUploadResultFile",
      path: "/uploadresult",
      options: {
        body: {
          file: "test test test",
          filemetadata: metadata,
          key: `private/${
            process.env.NEXT_PUBLIC_S3_FOLDER_NAME as string
          }/${fileName}`,
        },
      },
    });

    // console.log("RestOperation: ", restOperation);

    const { body } = await restOperation.response;
    const response = await body.json();
    console.log("POST call succeeded");
    console.log(response);
  } catch (e: any) {
    console.log("POST call failed: ", JSON.parse(e.response.body));
  }
}

const ApiTestClientComponent: React.FC = () => {
  const [btnColor, setBtnColor] = useState<string>("blue");
  const [btnText, setBtnText] = useState<string>("Process");

  async function handleUploadBtnClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setBtnColor("red");
    await quickTestUploadFileApi();
    setBtnColor("blue");
  }

  async function dummyAsyncFunction(
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    e.preventDefault();
    setBtnText("Processing");

    const startTime = new Date().toISOString();
    console.log(`Start time: ${startTime}`);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const endTime = new Date().toISOString();
    console.log(`End time: ${endTime}`);

    setBtnText("Process");
  }

  return (
    <div className="w-1/2 m-2 p-5 justify-center items-center text-center">
      <h1>TEST MY API PAGE</h1>

      <button
        onClick={handleUploadBtnClick}
        className={`w-full bg-${btnColor}-400 font-bold text-white hover:bg-${btnColor}-900 rounded-lg h-10 my-5`}
      >
        Test UPLOAD FILE POST API
      </button>

      <IbisLoadingBtn
        btnText={btnText}
        onclick={dummyAsyncFunction}
        disabled={false}
        color={"green"}
      />
    </div>
  );
};

export default ApiTestClientComponent;
