"use client";
import { IbisButton } from "@/components/IbisComponent";
import React, { useState } from "react";
import { uploadData } from "aws-amplify/storage";
import { useRouter } from "next/navigation";

import { Amplify } from "aws-amplify";
import awsconfig from "@/amplifyconfiguration.json";
import IbisInputBar from "@/components/IbisComponent/IbisInputBar";

Amplify.configure(awsconfig, { ssr: true });

type Tag = {
  key: string;
  value: string;
};

export default function FileUploadClientComponent({
  projectId,
}: {
  projectId: string;
}) {
  const [filename, setFilename] = useState<string>("");
  const [filedesc, setFiledesc] = useState<string>("");

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [tags, setTags] = useState<Tag[]>([] as Tag[]);
  const [tagKey, setTagKey] = useState("");
  const [tagValue, setTagValue] = useState("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  function removeTag(e: React.MouseEvent<HTMLButtonElement>): void {
    const relatedValue = e.currentTarget.value;
    const [targetKey, targetValue] = relatedValue.split("|");
    if (targetKey && targetValue) {
      setTags((prevTags) =>
        prevTags.filter(
          (tag) => tag.key !== targetKey && tag.value !== targetValue
        )
      );
    }
  }

  async function handleSubmit(
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await uploadFile(filename, uploadedFile as File, filedesc);
      console.log("Succeeded: ", result);
      router.push(`/projects/${projectId}/files`);
    } catch (error) {
      console.log("Failed: ", error);
    }
  }
  // deprecated uploadData function. need to update based on aws-amplify v6.2.0 and above
  async function uploadFile(
    fileName: string,
    file: File,
    fileDescription: string
  ) {
    const result = await uploadData({
      path: `private/${projectId}/${fileName}`,
      data: file,
      options: {
        metadata: {
          name: fileName,
          projectId: projectId,
          description: fileDescription,
          fileMetadata: JSON.stringify(tags),
        },
      },
    }).result;
    return result;
  }

  return (
    <div className="container mx-auto px-5 justify-center items-center relative">
      {/* Header ... */}
      <div className="flex container mx-auto px-5 justify-center my-2 h-auto">
        <p className="text-3xl/loose font-bold bg-gradient-to-r from-slate-700 to-indigo-500 text-transparent bg-clip-text">
          File Upload
        </p>
      </div>

      {/* Enter the file Metadatas ... */}
      <div className="mt-15 bg-white rounded-lg border-2 border-indigo-500 p-5">
        <IbisInputBar
          labelName={"File Name"}
          attributeName={"filename"}
          type={"text"}
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />
        <IbisInputBar
          labelName={"File Description"}
          attributeName={"filedesc"}
          type={"textarea"}
          value={filedesc}
          textAreaOnChange={(e) => setFiledesc(e.target.value)}
        />
        <div className="flex flex-col w-full my-1">
          <div className="w-full flex">
            <span className="w-1/3">File Metadatas: </span>
            {/* Add Metadata ... */}
            <div className="flex flex-row my-1 w-2/3">
              <input
                type="text"
                placeholder="Key"
                className="border rounded h-10 w-3/12 px-2"
                value={tagKey}
                onChange={(e) => setTagKey(e.target.value)}
              />
              <input
                type="text"
                placeholder="Value"
                className="border rounded h-10 flex-1 mx-2 px-2"
                value={tagValue}
                onChange={(e) => setTagValue(e.target.value)}
              />
              <button
                type="button"
                className="bg-slate-400 hover:bg-slate-600 px-4 py-2 rounded text-white font-bold"
                onClick={() => {
                  if (tagKey && tagValue) {
                    setTags([...tags, { key: tagKey, value: tagValue }]);
                    setTagKey("");
                    setTagValue("");
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Added Metadatas ... */}
          {tags.length > 0 && (
            <div className="flex w-full">
              <div className="w-1/3"></div>
              <div className="w-2/3 flex flex-row flex-wrap">
                {tags.map((tag) => {
                  return (
                    <div
                      key={`${tag.key}|${tag.value}`}
                      className="flex flex-row h-8 items-center rounded-lg border border-indigo-500 bg-indigo-300 hover:bg-indigo-100 text-indigo-800 px-2 mr-1 my-1"
                    >
                      <p className="pr-1">{`${tag.key}: ${tag.value}`}</p>
                      <button
                        className="bg-blue-300 hover:bg-slate-100 rounded-md border border-indigo-500"
                        onClick={removeTag}
                        value={`${tag.key}|${tag.value}`}
                      >
                        {/* Close icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="red"
                            d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                          />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Select File from local ... */}
        <div className="flex w-full">
          <span className="w-1/3">Select File:</span>
          <div className="flex items-center space-x-2 w-2/3">
            <input
              className="block w-full text-gray-900 border border-gray-900 rounded-lg cursor-pointer bg-gray-50"
              type="file"
              name="file"
              required
              onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>
      </div>

      {/* Submit Button ...  */}
      <div className="w-full flex justify-center mt-5">
        <IbisButton
          type="button"
          className="bg-slate-400 hover:bg-slate-600 mr-2 px-4 py-2 rounded flex-1"
          normalOnClick={() => router.back()}
        >
          Cancel
        </IbisButton>
        <button
          type="button"
          className={`w-1/2 inline-flex items-center justify-center bg-blue-400 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded cursor-pointer`}
          onClick={handleSubmit}
        >
          {isLoading && (
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0a12 12 0 00-12 12h4z"
              ></path>
            </svg>
          )}
          <span>Submit</span>
        </button>
      </div>
    </div>
  );
}
