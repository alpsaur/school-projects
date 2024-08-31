import {
  IbisSubProbeController,
  IbisParameterController,
} from "@myorg/ibis-mongodb";

async function listAllSubProbes(inputs) {
  const { probeId } = inputs;
  const foundSubProbes = await IbisSubProbeController.listSubProbes(
    probeId
  );
  const populatedSubProbes = await Promise.all(
    foundSubProbes.map(async (ibissubprobe) => {
      try {
        const foundParameters = await IbisParameterController.listParameters(
          ibissubprobe._id
        );
        return {
          ...ibissubprobe.toObject(),
          parameters: foundParameters,
        };
      } catch (error) {
        return { ...ibissubprobe.toObject(), parameters: [] };
      }
    })
  );
  return populatedSubProbes;
}

async function createSubProbe(inputs) {
  const { name, description, isVisible, probeId, ownerId } = inputs;
  const createdSubProbe = await IbisSubProbeController.createSubProbe({
    name: name,
    description: description,
    isVisible: isVisible,
    probeId: probeId,
    ownerId: ownerId,
  });
  return createdSubProbe._id;
}

async function updateSubProbe(inputs) {
  const { id, name, description, isVisible } = inputs;
  await IbisSubProbeController.updateSubProbeById(id, {
    name: name,
    description: description,
    isVisible: isVisible,
  });
  return id;
}

async function deleteSubProbeById(inputs) {
  const { deleteId } = inputs;
  await IbisSubProbeController.deleteSubProbeById(deleteId);
  return deleteId;
}

export { listAllSubProbes, createSubProbe, updateSubProbe, deleteSubProbeById };
