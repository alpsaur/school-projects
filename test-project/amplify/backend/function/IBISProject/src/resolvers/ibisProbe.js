import {
  IbisProbeController,
  IbisSubProbeController,
  IbisParameterController,
  IbisFileCombinationController,
  IbisFileCategoryController,
} from "@myorg/ibis-mongodb";

async function listAllProbes(inputs) {
  const { name, type } = inputs;
  const foundProbes = await IbisProbeController.listProbes(name, type); // the fileGroupSetting is populated ...
  const populatedProbes = await Promise.all(
    foundProbes.map(async (ibisprobe) => {
      const foundSubProbes = await IbisSubProbeController.listSubProbes(
        ibisprobe._id
      );
      const populatedSubProbes = await Promise.all(
        foundSubProbes.map(async (ibissubprobe) => {
          try {
            const foundParameters =
              await IbisParameterController.listParameters(ibissubprobe._id);
            return {
              ...ibissubprobe.toObject(),
              parameters: foundParameters,
            };
          } catch (error) {
            return { ...ibissubprobe.toObject(), parameters: [] };
          }
        })
      );
      const fileGroupSettingData = ibisprobe.fileGroupSettingId;

      const fileGroupSettingDataId = fileGroupSettingData._id;
      const fileCombinationsFound =
        await IbisFileCombinationController.listFileCombinationsByFileGroupSettingId(
          fileGroupSettingDataId
        );
      const populatedFileCombinations = await Promise.all(
        fileCombinationsFound.map(async (filecombination) => {
          const categoryId = filecombination.categoryId;
          const foundCategory =
            await IbisFileCategoryController.getIbisFileCategory(categoryId);
          return {
            ...filecombination.toObject(),
            category: foundCategory,
          };
        })
      );
      const populatedFileGroupSetting = {
        ...fileGroupSettingData.toObject(),
        fileCombinations: populatedFileCombinations,
      };

      const transformedProbe = {
        ...ibisprobe.toObject(),
        fileGroupSetting: populatedFileGroupSetting,
        subprobes: populatedSubProbes,
      };
      return transformedProbe;
    })
  );

  return populatedProbes;
}

async function createProbe(inputs) {
  const {
    refNo,
    name,
    url,
    description,
    fileGroupSettingId,
    ownerId,
    isPublic,
    type,
  } = inputs;
  const createdProbe = await IbisProbeController.createIbisProbe({
    refNo: refNo,
    name: name,
    url: url,
    description: description,
    fileGroupSetting: fileGroupSettingId,
    ownerId: ownerId,
    isPublic: isPublic,
    type: type,
  });
  return createdProbe._id;
}

async function updateProbe(inputs) {
  const { id, name, url, description, fileGroupSettingId, isPublic, type } =
    inputs;
  await IbisProbeController.updateProbe(id, {
    name: name,
    url: url,
    description: description,
    fileGroupSetting: fileGroupSettingId,
    isPublic: isPublic,
    type: type,
  });
  return id;
}

async function getProbeById(inputs) {
  const { id } = inputs;
  const probeByIdFound = await IbisProbeController.getProbeById(id);
  if (probeByIdFound) {
    const foundSubProbes = await IbisSubProbeController.listSubProbes(id);
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
    const fileGroupSettingData = probeByIdFound.fileGroupSettingId;
    const fileGroupSettingDataId = fileGroupSettingData._id;
    const fileCombinationsFound =
      await IbisFileCombinationController.listFileCombinationsByFileGroupSettingId(
        fileGroupSettingDataId
      );
    const populatedFileCombinations = await Promise.all(
      fileCombinationsFound.map(async (filecombination) => {
        const categoryId = filecombination.categoryId;
        const foundCategory =
          await IbisFileCategoryController.getIbisFileCategory(categoryId);
        return {
          ...filecombination.toObject(),
          category: foundCategory,
        };
      })
    );
    const populatedFileGroupSetting = {
      ...fileGroupSettingData.toObject(),
      fileCombinations: populatedFileCombinations,
    };

    const transformedProbe = {
      ...probeByIdFound.toObject(),
      fileGroupSetting: populatedFileGroupSetting,
      subprobes: populatedSubProbes,
    };
    return transformedProbe;
  } else {
    return null;
  }
}

async function deleteProbeById(inputs) {
  const { deleteId } = inputs;
  await IbisProbeController.deleteProbe(deleteId);
  return deleteId;
}

export {
  listAllProbes,
  createProbe,
  updateProbe,
  getProbeById,
  deleteProbeById,
};
