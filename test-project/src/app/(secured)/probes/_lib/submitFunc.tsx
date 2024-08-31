"use server";

import {
  CreateParameterInput,
  CreateProbeInput,
  CreateSubProbeInput,
} from "@/API";
import { createFlag, deleteFlag, updateFlag } from "@/ibisTypes";
import {
  createNewParameter,
  createNewProbe,
  createNewSubProbe,
  deleteParameter,
  deleteSubProbe,
  updateParameter,
  updateProbe,
  updateSubProbe,
} from "./graphqlApi";

async function handleEditProbePageSubmit(
  submitProbeData: CreateProbeInput
): Promise<void> {
  console.log("-> Update Probe:", submitProbeData);
  await updateProbe(submitProbeData);

  const relatedSubProbeDatas =
    submitProbeData.subprobes as CreateSubProbeInput[];

  for (const eachSubmitSubProbe of relatedSubProbeDatas) {
    const receivedInputRelatedParamsData =
      eachSubmitSubProbe.parameters as CreateParameterInput[];

    let subprobeIdWithPrefix = eachSubmitSubProbe.id as string;

    let [_, subprobeId] = subprobeIdWithPrefix.split("|"); // if no change to this subprobe, the subprobeId will be undefined ...

    if (subprobeIdWithPrefix.startsWith(createFlag)) {
      console.log("-> Create SubProbe: ", eachSubmitSubProbe);
      const createdSubProbe = await createNewSubProbe(eachSubmitSubProbe);
      subprobeId = createdSubProbe;
    }
    if (subprobeIdWithPrefix.startsWith(updateFlag)) {
      console.log("-> Update SubProbe: ", eachSubmitSubProbe);
      const updatesubprobeInput: CreateSubProbeInput = {
        ...eachSubmitSubProbe,
        id: subprobeId,
      };
      await updateSubProbe(updatesubprobeInput);
    }
    if (subprobeIdWithPrefix.startsWith(deleteFlag)) {
      console.log("-> Delete SubProbe: ", eachSubmitSubProbe);
      await deleteSubProbe(subprobeId);
      continue;
    }

    for (const eachRelatedParameter of receivedInputRelatedParamsData) {
      const finalParameterInput = {
        ...eachRelatedParameter,
        subProbeId:
          subprobeId === undefined ? subprobeIdWithPrefix : subprobeId,
      };
      const parameterIdWithPrefix = finalParameterInput.id as string;

      const [_, parameterId] = parameterIdWithPrefix.split("|");

      if (parameterIdWithPrefix.startsWith(createFlag)) {
        console.log("-> Create Parameter: ", finalParameterInput);
        await createNewParameter(finalParameterInput);
      }
      if (parameterIdWithPrefix.startsWith(updateFlag)) {
        console.log("-> Update Parameter: ", finalParameterInput);
        const updateParameterInput: CreateParameterInput = {
          ...finalParameterInput,
          id: parameterId,
        };
        await updateParameter(updateParameterInput);
      }
      if (parameterIdWithPrefix.startsWith(deleteFlag)) {
        console.log("-> Delete Parameter: ", finalParameterInput);
        await deleteParameter(parameterId);
      }
    }
  }
}

async function handleCreateProbePageSubmit(
  submitProbeData: CreateProbeInput
): Promise<void> {
  const submitSubProbeDatas =
    submitProbeData.subprobes as CreateSubProbeInput[];
  const createdProbeId = await createNewProbe(submitProbeData);
  console.log("Received created probeId: ", createdProbeId);

  for (const submitSubprobe of submitSubProbeDatas) {
    const submitParameterDatas =
      submitSubprobe.parameters as CreateParameterInput[];

    const submitSubprobeData: CreateSubProbeInput = {
      ...submitSubprobe,
      probeId: createdProbeId,
    };

    const createdSubprobeId = await createNewSubProbe(submitSubprobeData);

    for (const submitParameter of submitParameterDatas) {
      const submitParameterData: CreateParameterInput = {
        ...submitParameter,
        subProbeId: createdSubprobeId,
      };

      const isValid =
        !!submitParameterData.name &&
        !!submitParameterData.type &&
        !!submitParameterData.valueType &&
        !!submitParameterData.unit;
      if (!isValid) {
        continue;
      }

      await createNewParameter(submitParameterData);
    }
  }
}

export { handleEditProbePageSubmit, handleCreateProbePageSubmit };
