import {
  InspectionRequestType,
  ProbeResultType,
  SubProbeInfoType,
  SubProbeResultElementType,
  SubProbeResultType,
} from "@/ibisTypes";
import { NextRequest, NextResponse } from "next/server";

const deployApi =
  "https://master.dh2ddtk39bfwm.amplifyapp.com/api/inspection/result";

// create dummy result json obj based on the received data ...
function dummyResultCreate(receivedData: InspectionRequestType): any {
  const probeData = receivedData.probe;
  const probeId: string = probeData.id;
  const subprobeids: SubProbeInfoType[] =
    probeData.subprobes as SubProbeInfoType[];

  const dummyelementResult: SubProbeResultElementType = {
    id: "string",
    elementId: "string",
    fileId: "string",
    status: "PASS",
    expectedValue: "string",
    actualValue: "string",
    parameterId: "string",
    description: "string",
    valueType: "string",
    actualValueUnit: null,
    expectedValueUnit: null,
    coordinates: null,
  };

  const dummySubProbeResultsReturn: SubProbeResultType[] = subprobeids.map(
    (subprobeid) => {
      const subproberesult = {
        id: ".....test test .....",
        subProbeId: subprobeid.id,
        status: "FAIL",
        description: "some checks failed",
        elements: [
          {
            id: "string",
            elementId: "2iLvaTS_j0BAlcdZq$$9gE",
            fileId: "string",
            status: "PASS",
            expectedValue: "string",
            actualValue: "string",
            parameterId: "string",
            description: "string",
            valueType: "string",
            actualValueUnit: null,
            expectedValueUnit: null,
            coordinates: null,
          },
          {
            id: "string",
            elementId: "2iLvaTS_j0BAlcdZq$$9h3",
            fileId: "string",
            status: "PASS",
            expectedValue: "string",
            actualValue: "string",
            parameterId: "string",
            description: "string",
            valueType: "string",
            actualValueUnit: null,
            expectedValueUnit: null,
            coordinates: null,
          },
          {
            id: "string",
            elementId: "2iLvaTS_j0BAlcdZq$$9mq",
            fileId: "string",
            status: "FAIL",
            expectedValue: "string",
            actualValue: "string",
            parameterId: "string",
            description: "string",
            valueType: "string",
            actualValueUnit: null,
            expectedValueUnit: null,
            coordinates: null,
          },
          {
            id: "string",
            elementId: "2iLvaTS_j0BAlcdZq$$9_w",
            fileId: "string",
            status: "FAIL",
            expectedValue: "string",
            actualValue: "string",
            parameterId: "string",
            description: "string",
            valueType: "string",
            actualValueUnit: null,
            expectedValueUnit: null,
            coordinates: null,
          },
          {
            id: "string",
            elementId: "2iLvaTS_j0BAlcdZq$$9$N",
            fileId: "string",
            status: "PASS",
            expectedValue: "string",
            actualValue: "string",
            parameterId: "string",
            description: "string",
            valueType: "string",
            actualValueUnit: null,
            expectedValueUnit: null,
            coordinates: null,
          },
          {
            id: "string",
            elementId: "1EtRbWNYf4fxFr0wkMV0_V",
            fileId: "string",
            status: "PASS",
            expectedValue: "string",
            actualValue: "string",
            parameterId: "string",
            description: "string",
            valueType: "string",
            actualValueUnit: null,
            expectedValueUnit: null,
            coordinates: null,
          },
          {
            id: "string",
            elementId: "1EtRbWNYf4fxFr0wkMV0r$",
            fileId: "string",
            status: "PASS",
            expectedValue: "string",
            actualValue: "string",
            parameterId: "string",
            description: "string",
            valueType: "string",
            actualValueUnit: null,
            expectedValueUnit: null,
            coordinates: null,
          },
          {
            id: "string",
            elementId: "1EtRbWNYf4fxFr0wkMV09r",
            fileId: "string",
            status: "PASS",
            expectedValue: "string",
            actualValue: "string",
            parameterId: "string",
            description: "string",
            valueType: "string",
            actualValueUnit: null,
            expectedValueUnit: null,
            coordinates: null,
          },
          {
            id: "string",
            elementId: "1EtRbWNYf4fxFr0wkMV0F0",
            fileId: "string",
            status: "PASS",
            expectedValue: "string",
            actualValue: "string",
            parameterId: "string",
            description: "string",
            valueType: "string",
            actualValueUnit: null,
            expectedValueUnit: null,
            coordinates: null,
          },
          {
            id: "string",
            elementId: "1EtRbWNYf4fxFr0wkMV0EG",
            fileId: "string",
            status: "PASS",
            expectedValue: "string",
            actualValue: "string",
            parameterId: "string",
            description: "string",
            valueType: "string",
            actualValueUnit: null,
            expectedValueUnit: null,
            coordinates: null,
          },
          {
            id: "string",
            elementId: "1EtRbWNYf4fxFr0wkMV01M",
            fileId: "string",
            status: "PASS",
            expectedValue: "string",
            actualValue: "string",
            parameterId: "string",
            description: "string",
            valueType: "string",
            actualValueUnit: null,
            expectedValueUnit: null,
            coordinates: null,
          },
          {
            id: "string",
            elementId: "1EtRbWNYf4fxFr0wkMV03a",
            fileId: "string",
            status: "PASS",
            expectedValue: "string",
            actualValue: "string",
            parameterId: "string",
            description: "string",
            valueType: "string",
            actualValueUnit: null,
            expectedValueUnit: null,
            coordinates: null,
          },
          {
            id: "string",
            elementId: "0$Y9MYm5f1d9pWcLD3cDYe",
            fileId: "string",
            status: "PASS",
            expectedValue: "string",
            actualValue: "string",
            parameterId: "string",
            description: "string",
            valueType: "string",
            actualValueUnit: null,
            expectedValueUnit: null,
            coordinates: null,
          },
        ],
      };
      return subproberesult;
    }
  );

  const dummyProbeResultReturn: ProbeResultType = {
    id: receivedData.probeResultId,
    probeId: probeId,
    status: "FAIL",
    description: "Some subprobe checks failed ...",
    subProbeResults: dummySubProbeResultsReturn,
  };

  const dummyInspectionResultReturn: InspectionRequestType = {
    appId: receivedData.appId,
    refId: receivedData.refId,
    inspectionId: receivedData.inspectionId,
    probeResultId: receivedData.probeResultId,
    projectId: receivedData.projectId,
    probe: receivedData.probe,
    inputFiles: receivedData.inputFiles,
    result: dummyProbeResultReturn,
    error: null,
  };

  return dummyInspectionResultReturn;
}

// currently used for receive data that should be sent to analysis api ...
export async function POST(req: NextRequest) {
  const requestData = await req.json();

  // console.log("Received requestData: ", requestData);
  // console.log("Test get field data appId: ", requestData.appId);

  const jsonData = JSON.parse(requestData) as InspectionRequestType;

  // do something based on the input request data ...
  const dummyResult = dummyResultCreate(jsonData);

  console.log("The dummy result is: ", JSON.stringify(dummyResult, null, 2));

  try {
    const response = await fetch(deployApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dummyResult),
    });

    const result = await response.json();

    // Respond to the client
    return NextResponse.json(
      { message: "Data sent to apiB", result },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error calling apiB", error },
      { status: 500 }
    );
  }
}
