"use server";

import config from "@/amplifyconfiguration.json";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { cookies } from "next/headers";

import {
  CreateInspectionInput,
  CreateProbeGroupResultInput,
  CreateProbeResultInput,
  IbisInspection,
  InspectionStatusEnum,
  UpdateInspectionInput,
} from "@/API";

import { IbisFile, IbisProbe, IbisProbeGroup } from "@/API";
import { createFlag, deleteFlag, updateFlag } from "@/ibisTypes";
import {
  getIbisInspection,
  listIbisFiles,
  listIbisProbeGroups,
  listIbisProbes,
} from "@/graphql/queries";
import {
  createIbisInspection,
  createIbisProbeGroupResult,
  createIbisProbeResult,
  deleteIbisProbeGroupResult,
  deleteIbisProbeResult,
  updateIbisInspection,
  updateIbisProbeGroupResult,
  updateIbisProbeResult,
} from "@/graphql/mutations";

const client = generateServerClientUsingCookies({
  config,
  cookies,
});

function removeTypename(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeTypename);
  } else if (typeof obj === "object" && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && key !== "__typename") {
        newObj[key] = removeTypename(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

function formatInpuData(
  pgr: CreateProbeGroupResultInput
): CreateProbeGroupResultInput {
  const formattedPGR: CreateProbeGroupResultInput = {
    id: pgr.id,
    probeGroupId: pgr.probeGroupId,
    status: pgr.status,
    description: pgr.description,
    inspectionId: pgr.inspectionId,
    probeResults: pgr.probeResults?.map((pr) => {
      const formattedPR: CreateProbeResultInput = {
        id: pr.id,
        probeId: pr.probeId,
        resultFileId: pr.resultFileId,
        description: pr.description,
        inputFileIds: pr.inputFileIds,
        probeGroupResultId: pr.probeGroupResultId,
        status: pr.status,
      };
      return formattedPR;
    }),
  };
  return formattedPGR;
}

/* 
    GRAPHQL QUERY FUNCTIONS ... 
*/
async function fetchIbisProbes(
  name?: string,
  type?: string
): Promise<IbisProbe[]> {
  const result = await client.graphql({
    query: listIbisProbes,
    variables: {
      name: name,
      type: type,
    },
  });

  const { data } = result;

  if (data.listIbisProbes === undefined || data.listIbisProbes === null) {
    return [];
  } else {
    return removeTypename(data.listIbisProbes);
  }
}

async function fetchIbisProbeGroups(name?: string): Promise<IbisProbeGroup[]> {
  const result = await client.graphql({
    query: listIbisProbeGroups,
    variables: {
      name: name,
    },
  });

  const { data } = result;
  const rawData = data.listIbisProbeGroups;

  if (rawData === undefined || rawData === null) {
    return [];
  }
  return removeTypename(rawData);
}

async function fetchIbisFiles(
  projectId: string,
  categoryId?: string
): Promise<IbisFile[]> {
  const result = await client.graphql({
    query: listIbisFiles,
    variables: {
      projectId: projectId,
      categoryId: categoryId,
    },
  });

  const { data } = result;
  const rawData = data.listIbisFiles;

  if (rawData === undefined || rawData === null) {
    return [];
  } else {
    return removeTypename(rawData);
  }
}

async function fetchIbisInspection(
  inspectionId: string
): Promise<IbisInspection | null> {
  const result = await client.graphql({
    query: getIbisInspection,
    variables: {
      id: inspectionId,
    },
  });
  console.log("result in fetchIbisInspection", result);
  const { data } = result;
  const fetchedInspection = data.getIbisInspection;

  return fetchedInspection ? removeTypename(fetchedInspection) : null;
}

/* 
    GRAPHQL MUTATION FUNCTIONS ... 
*/
async function saveInspectionInput(
  updateInspectionInput: UpdateInspectionInput
): Promise<string> {
  console.log("Final Check Submitted Inspection Data: ", updateInspectionInput);
  const result = await client.graphql({
    query: updateIbisInspection,
    variables: {
      input: updateInspectionInput,
    },
  });
  console.log("Update Inspection End...");
  return result.data.updateIbisInspection;
}

// This will save all probegroupresults data to database (but 1 save with 1 probegroupresult may be better ?)
async function saveProbeGroupResultInput(
  submittedProbeGroupResultsInput: CreateProbeGroupResultInput[]
): Promise<void> {
  console.log(
    "Final Check Submitted ProbeGroupResults Data: ",
    submittedProbeGroupResultsInput
  );

  for (const eachInputData of submittedProbeGroupResultsInput) {
    await saveSingleProbeGroupResult(eachInputData);
  }

  console.log("End Save All ProbeGroupResults ...");
}

// usually, it only contains create/update of probegroupresult, and CUD for proberesults ... (seems can be handle delete probegroupresult ...)
async function saveSingleProbeGroupResult(
  submittedProbeGroupResultInput: CreateProbeGroupResultInput
): Promise<void> {
  console.log(
    " - Final Check Submitted ProbeGroupResult Data: ",
    submittedProbeGroupResultInput
  );

  const formattedSubmittedData = formatInpuData(submittedProbeGroupResultInput);
  console.log(
    " -- Formatted Submitted ProbeGroupResult Data: ",
    formattedSubmittedData
  );

  let probegroupresultId = formattedSubmittedData.id || "";
  const isNew_ProbeGroupResult = probegroupresultId.startsWith(createFlag);
  const isDelect_ProbeGroupResult = probegroupresultId.startsWith(deleteFlag);
  const isUpdate_ProbeGroupResult = probegroupresultId.startsWith(updateFlag);

  // process the probegroup result ... C? U? D?
  if (isNew_ProbeGroupResult) {
    const createdResult1 = await client.graphql({
      query: createIbisProbeGroupResult,
      variables: {
        input: formattedSubmittedData,
      },
    });
    probegroupresultId = createdResult1.data.createIbisProbeGroupResult;
  } else {
    if (isDelect_ProbeGroupResult) {
      // delete this probegroupresult and related all proberesults and subproberesults ...
      const [_, oriId] = probegroupresultId.split("|");
      console.log(" - Delete probe group result id: ", oriId);
      await client.graphql({
        query: deleteIbisProbeGroupResult,
        variables: {
          deleteId: oriId,
        },
      });
      console.log(" - Delete the probe group result with id ", oriId);
      return;
    } else {
      const [_, oriId] = probegroupresultId.split("|");
      console.log(" - Update probe group result id: ", oriId);
      const updateProbeGroupResultInput: CreateProbeGroupResultInput = {
        ...formattedSubmittedData,
        id: oriId,
      };
      if (isUpdate_ProbeGroupResult) {
        await client.graphql({
          query: updateIbisProbeGroupResult,
          variables: {
            input: updateProbeGroupResultInput,
          },
        });
      }
      console.log(" - Update the probe group result with id ", oriId);
      probegroupresultId = oriId;
    }
  }

  // preparing for processing probe results of this probegroup result ...
  const proberesults = formattedSubmittedData.probeResults;
  if (proberesults === null || proberesults === undefined) {
    return; // no proberesult having, end ...
  }

  // Processing the probe results of this probegroupresult ... C? U? D?
  for (const eachProberesult of proberesults) {
    let proberesultId = eachProberesult.id || "";
    const isNew_ProbeResult = proberesultId.startsWith(createFlag);
    const isDelete_ProbeResult = proberesultId.startsWith(deleteFlag);
    const isUpdate_ProbeResult = proberesultId.startsWith(updateFlag);
    console.log(" --- Final Check Input ProbeResult Data:", eachProberesult);

    if (isNew_ProbeResult) {
      const createInput: CreateProbeResultInput = {
        ...eachProberesult,
        probeGroupResultId: probegroupresultId,
      };
      const createdResult2 = await client.graphql({
        query: createIbisProbeResult,
        variables: {
          input: createInput,
        },
      });
      console.log(
        " ----- Create the new probe result id: ",
        createdResult2.data.createIbisProbeResult
      );
    } else {
      if (isDelete_ProbeResult) {
        const [_, oriProberesultId] = proberesultId.split("|");
        console.log(" ----- Delete proberesult id: ", oriProberesultId);
        await client.graphql({
          query: deleteIbisProbeResult,
          variables: {
            deleteId: oriProberesultId,
          },
        });
        console.log(
          " ----- Delete the Probe result with id ",
          oriProberesultId
        );
        continue;
      } else {
        if (isUpdate_ProbeResult) {
          const [_, oriProberesultId] = proberesultId.split("|");
          console.log(" ----- Update probe result id: ", oriProberesultId);
          const updateProbeResultInput: CreateProbeResultInput = {
            ...eachProberesult,
            id: oriProberesultId,
          };
          await client.graphql({
            query: updateIbisProbeResult,
            variables: {
              input: updateProbeResultInput,
            },
          });
          console.log(
            " ----- Update the Probe result with id ",
            oriProberesultId
          );
        }
      }
    }
  }

  console.log("Exit Save Single ProbeGroupResult ...");
}

async function updateInspectionStatus(
  id: string,
  status: InspectionStatusEnum
): Promise<void> {
  const updateInput: UpdateInspectionInput = {
    id: id,
    status: status,
  };
  await client.graphql({
    query: updateIbisInspection,
    variables: {
      input: updateInput,
    },
  });
  console.log("Update Inspection Status end ...");
}

// export queries ...
export {
  fetchIbisProbes,
  fetchIbisProbeGroups,
  fetchIbisFiles,
  fetchIbisInspection,
};

// export mutations ...
export {
  saveSingleProbeGroupResult,
  saveInspectionInput,
  saveProbeGroupResultInput,
  updateInspectionStatus,
};
