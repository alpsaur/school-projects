import {
  IbisInspectionController,
  IbisProbeGroupResultController,
  IbisProbeResultController,
} from "@myorg/ibis-mongodb";

// Inspection
async function listInspections(inputs) {
  const { projectId } = inputs;
  const inspectionsFound =
    await IbisInspectionController.listInspectionsByProjectId(projectId);
  const populatedInspections = await Promise.all(
    inspectionsFound.map(async (inspection) => {
      const probeGroupResultsFound =
        await IbisProbeGroupResultController.listProbeGroupResultsByInspectionId(
          inspection._id
        );
      const populatedProbeGroupResult = await Promise.all(
        probeGroupResultsFound.map(async (probegroupResult) => {
          const probeResultsFound =
            await IbisProbeResultController.listProbeResultsByProbeGroupResultId(
              probegroupResult._id
            );
          const formattedProbeResults = probeResultsFound.map(
            (eachProbeResult) => {
              const inputFilesForThisProbeResult = eachProbeResult.inputFileIds; // already populated ...
              const inputFileIds = inputFilesForThisProbeResult.map(
                (eachfile) => {
                  return eachfile.id;
                }
              );
              return {
                ...eachProbeResult.toObject(),
                inputFiles: inputFilesForThisProbeResult,
                inputFileIds: inputFileIds,
              };
            }
          );

          return {
            ...probegroupResult.toObject(),
            probeResults: formattedProbeResults,
          };
        })
      );
      return {
        ...inspection.toObject(),
        probeGroupResults: populatedProbeGroupResult,
      };
    })
  );
  return populatedInspections;
}

async function getInspectionById(inputs) {
  const { id } = inputs;
  try {
    const ibisInspectionFound =
      await IbisInspectionController.getInspectionById(id);
    if (ibisInspectionFound == null) {
      throw new Error("Inspection Not Found");
    }
    const probeGroupResultsFound =
      await IbisProbeGroupResultController.listProbeGroupResultsByInspectionId(
        id
      );
    const populatedProbeGroupResult = await Promise.all(
      probeGroupResultsFound.map(async (probegroupResult) => {
        const probeResultsFound =
          await IbisProbeResultController.listProbeResultsByProbeGroupResultId(
            probegroupResult._id
          );
        const formattedProbeResults = probeResultsFound.map(
          (eachProbeResult) => {
            const inputFilesForThisProbeResult = eachProbeResult.inputFileIds; // already populated ...
            const inputFileIds = inputFilesForThisProbeResult.map(
              (eachfile) => {
                return eachfile.id;
              }
            );
            return {
              ...eachProbeResult.toObject(),
              inputFiles: inputFilesForThisProbeResult,
              inputFileIds: inputFileIds,
            };
          }
        );

        return {
          ...probegroupResult.toObject(),
          probeResults: formattedProbeResults,
        };
      })
    );
    return {
      ...ibisInspectionFound.toObject(),
      probeGroupResults: populatedProbeGroupResult,
    };
  } catch (err) {}
}

async function createInspection(inputs) {
  const { refNo, name, description, projectId, type } = inputs;

  const createdInspection = await IbisInspectionController.createInspection({
    refNo: refNo,
    name: name,
    desc: description,
    projectId: projectId,
    type: type,
  });

  const inspectionId = createdInspection._id;
  return inspectionId;
}

async function updateInspection(inputs) {
  const { id, name, description, status, type } = inputs;
  await IbisInspectionController.updateInspectionById(
    id,
    name,
    description,
    type,
    status
  );
  return id;
}

async function deleteInspection(inputs) {
  const { deleteId } = inputs;
  await IbisInspectionController.deleteInspectionById(deleteId);
  return deleteId;
}

// ProbeGroup Result
async function createProbeGroupResult(inputs) {
  const { probeGroupId, inspectionId, description } = inputs;
  const createdProbeGroupResult =
    await IbisProbeGroupResultController.createProbeGroupResult(
      probeGroupId,
      inspectionId,
      description
    );
  return createdProbeGroupResult._id;
}

async function updateProbeGroupResult(inputs) {
  const { probeGroupId, id, status, description } = inputs;
  await IbisProbeGroupResultController.updateProbeGroupResultById(
    id,
    status,
    probeGroupId,
    description
  );
  return id;
}

async function deleteProbeGroupResult(inputs) {
  const { deleteId } = inputs;
  await IbisProbeGroupResultController.deleteProbeGroupResultById(deleteId);
  return deleteId;
}

// Probe Result
async function createProbeResult(inputs) {
  const { probeId, inputFileIds, probeGroupResultId } = inputs;
  const createdProbeResult = await IbisProbeResultController.createProbeResult({
    probeId: probeId,
    probeGroupResultId: probeGroupResultId,
    inputFileIds: inputFileIds,
  });
  return createdProbeResult._id;
}

async function updateProbeResult(inputs) {
  const { id, inputFileIds, resultFileId, description, status } = inputs;
  await IbisProbeResultController.updateProbeResultById(
    id,
    inputFileIds,
    resultFileId,
    description,
    status
  );
  return id;
}

async function updateProbeResultStatus(inputs) {
  const updateId = await updateProbeResult(inputs);
  const proberesult = await IbisProbeResultController.getProbeResultById(
    updateId
  );
  const inputFilesForThisProbeResult = proberesult.inputFileIds; // already populated ...
  const inputFileIds = inputFilesForThisProbeResult.map((eachfile) => {
    return eachfile.id;
  });
  const populatedProberesult = {
    ...proberesult.toObject(),
    inputFiles: inputFilesForThisProbeResult,
    inputFileIds: inputFileIds,
  };
  return populatedProberesult;
}

async function deleteProbeResult(inputs) {
  const { deleteId } = inputs;
  await IbisProbeResultController.deleteProbeResultById(deleteId);
  return deleteId;
}

export {
  listInspections,
  getInspectionById,
  createInspection,
  updateInspection,
  deleteInspection,
};

export {
  createProbeGroupResult,
  updateProbeGroupResult,
  deleteProbeGroupResult,
};

export {
  createProbeResult,
  updateProbeResult,
  deleteProbeResult,
  updateProbeResultStatus,
};
