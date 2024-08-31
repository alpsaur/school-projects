"use client";
import {
  CreateProbeResultInput,
  IbisFile,
  IbisProbe,
  IbisSubProbe,
} from "@/API";
import GeneralTable from "@/components/Table/GeneralTable";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { downloadData } from "@aws-amplify/storage";
import {
  InspectionRequestType,
  ProbeResultType,
  SubProbeResultType,
} from "@/ibisTypes";

interface ProbeResultReportProps {
  proberesultFromParent: CreateProbeResultInput;
  fileDatasFromParent: IbisFile[];
  probeRefDataFromParent: IbisProbe;
  resultFileRef: IbisFile;
}

interface CheckFileTableRow {
  id: string;
  NO: number;
  Name: string;
  // FileCategory: string;
  UploadedOn: string;
}

interface ElementTableRow {
  id: string;
  NO: number;
  Status: string;
  ExpectedValue: string;
  ActualValue: string;
  Description: string;
}

function convert2DisplayFileTableRowFormat(
  inputData: IbisFile[],
  prefix: string
): CheckFileTableRow[] {
  const rowFormatData: CheckFileTableRow[] = inputData.map((file, index) => {
    return {
      id: prefix + "@" + file.id,
      NO: index + 1,
      Name: file.name || "",
      // FileCategory: file.fileCategory?.name || "",
      UploadedOn: file.createdOn || "",
    };
  });
  return rowFormatData;
}

function convert2ResultTableRowFormat(
  inputData: SubProbeResultType
): ElementTableRow[] {
  if (inputData === undefined) return [];

  const elementArray = inputData.elements;
  const rowFormatData: ElementTableRow[] = elementArray.map((ele, index) => {
    return {
      id: uuidv4() + ele.id,
      NO: index + 1,
      Status: ele.status,
      ExpectedValue: ele.expectedValue,
      ActualValue: ele.actualValue,
      Description: ele.description,
    };
  });
  return rowFormatData;
}

const IbisProbeResultReportComponent: React.FC<ProbeResultReportProps> = ({
  proberesultFromParent,
  fileDatasFromParent,
  probeRefDataFromParent,
  resultFileRef,
}) => {
  // State hooks example
  const [fileContent, setFileContent] = useState<ProbeResultType>(); // currently none .... can not in json format ...
  const subprobeRefData: IbisSubProbe[] = probeRefDataFromParent.subprobes
    ? (probeRefDataFromParent.subprobes as IbisSubProbe[])
    : [];
  const displayFilesData: CheckFileTableRow[] =
    convert2DisplayFileTableRowFormat(
      fileDatasFromParent,
      proberesultFromParent.id || "UNDEFINED"
    );
  const fileColumnName: string[] = ["NO", "Name", "FileCategory", "UploadedOn"];

  // console.log("probeRefDataFromParent", probeRefDataFromParent);
  const resultColumnName: string[] = [
    "NO",
    "Status",
    "ExpectedValue",
    "ActualValue",
    "Description",
  ];
  const [subprobeResultsArray, setSubprobeResultArray] = useState<
    SubProbeResultType[]
  >([]);

  // Download corresponding result file based on the resultFileId in proberesult ...
  // using useEffect ...

  useEffect(() => {
    const fetchTextFile = async () => {
      try {
        const filePath = resultFileRef.filepath || "";
        // console.log("Start fetching file from ", filePath);

        // const filePath =
        //   "private/ap-southeast-1:0d48a6ec-62f8-cbf0-adbb-726a72363941/08a1ef3b-0a8a-4ee9-8561-d99311482761.json";
        const downloadResult = await downloadData({
          path: filePath,
        }).result;

        const textData = await downloadResult.body.text();

        // console.log("Succeed", textData);
        const parsedJsonData: InspectionRequestType = JSON.parse(textData);
        // console.log("Result Only Print: ", parsedJsonData.result);

        const resultData: ProbeResultType | undefined = parsedJsonData.result;

        if (resultData === undefined) {
          throw new Error("Fetch result file failed...");
        }

        // console.log("The Result Object is: ", resultData);

        // Set the text data in the state
        setFileContent(resultData);
        setSubprobeResultArray(resultData.subProbeResults);
      } catch (error) {
        console.error("Error fetching text file:", error);
      }
    };
    fetchTextFile();
  });

  return (
    <>
      {/* Probe Result Summary Component */}
      <div className="w-full">
        <p>
          <span className="font-bold">Probe Name: </span>
          <span>{probeRefDataFromParent.name}</span>
        </p>
        <p>
          <span className="font-bold">Probe Result: </span>
          <span>{proberesultFromParent.status}</span>
        </p>
        <p>
          <span className="font-bold">Probe Result Description: </span>
          <span>{proberesultFromParent.description}</span>
        </p>
      </div>

      {/* checked files ... */}
      <div className="w-full">
        <p className="font-bold">Checked Files: </p>
        <GeneralTable<CheckFileTableRow>
          columns={fileColumnName}
          rows={displayFilesData}
          pathname={""}
          needOperation={false}
          operationType=""
        ></GeneralTable>
      </div>

      {/* Subprobes result display */}
      {subprobeRefData.map((subprobe) => {
        // console.log("subProbe", subprobe);
        const subprobeId = subprobe.id;
        const subprobeResultContent: SubProbeResultType =
          subprobeResultsArray.find(
            (d) => d.subProbeId === subprobeId
          ) as SubProbeResultType;
        const elementDisplayDatas: ElementTableRow[] =
          convert2ResultTableRowFormat(subprobeResultContent);

        // console.log("subprobeId", subprobeId);
        // console.log("The SubprobeResult is: ", subprobeResultContent);

        return (
          <div
            key={proberesultFromParent.id + "@" + subprobe.id}
            className="w-full"
          >
            {subprobeId && (
              <div className="bg-white p-2 w-full mt-2 mb-2 rounded-lg border-2 border-cyan-700">
                <p>
                  <span className="font-bold">SubProbe Name: </span>
                  <span>{subprobe?.name}</span>
                </p>
                <p>
                  <span className="font-bold">SubProbe Result: </span>
                  <span>{subprobeResultContent?.status}</span>
                </p>
                <p>
                  <span className="font-bold">
                    SubProbe Result Description:{" "}
                  </span>
                  <span>{subprobeResultContent?.description}</span>
                </p>

                <div>
                  {/* Display the subprobe related result data ... */}
                  <GeneralTable<ElementTableRow>
                    columns={resultColumnName}
                    rows={elementDisplayDatas}
                    pathname=""
                    needOperation={false}
                    operationType=""
                  ></GeneralTable>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default IbisProbeResultReportComponent;
