import {
  IbisProbeGroupController,
  IbisSubProbeController,
  IbisParameterController,
  IbisFileCombinationController,
  IbisFileCategoryController,
} from "@myorg/ibis-mongodb";

async function listIbisProbeGroups(inputs) {
  const { name } = inputs;
  let foundProbeGroups = null;
  if (name) {
    foundProbeGroups = await IbisProbeGroupController.listProbeGroups(name);
  } else {
    foundProbeGroups = await IbisProbeGroupController.listProbeGroups();
  }

  const populatedProbeGroups = await Promise.all(
    foundProbeGroups.map(async (ibisprobegroup) => {
      const foundProbes = ibisprobegroup.probeIds; // this is already populated through the function listProbeGroups ...
      const populatedProbes = await Promise.all(
        foundProbes.map(async (ibisprobe) => {
          const foundSubProbes = await IbisSubProbeController.listSubProbes(
            ibisprobe._id
          );
          const populatedSubProbes = await Promise.all(
            foundSubProbes.map(async (ibissubprobe) => {
              try {
                const foundParameters =
                  await IbisParameterController.listParameters(
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
                await IbisFileCategoryController.getIbisFileCategory(
                  categoryId
                );
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
          return {
            ...ibisprobe.toObject(),
            subprobes: populatedSubProbes,
            fileGroupSetting: populatedFileGroupSetting,
          };
        })
      );
      const t_populatedprobegroup = {
        ...ibisprobegroup.toObject(),
        probes: populatedProbes,
      };
      delete t_populatedprobegroup.probeIds;
      return t_populatedprobegroup;
    })
  );
  return populatedProbeGroups;
}

async function createProbeGroup(inputs) {
  const { ownerId, refNo, name, description, isPublic, probeIds, type } =
    inputs;
  const createdProbeGroup = await IbisProbeGroupController.createProbeGroup({
    refNo: refNo,
    name: name,
    description: description,
    isPublic: isPublic,
    ownerId: ownerId,
    probeIds: probeIds,
    type: type,
  });
  return createdProbeGroup._id;
}

async function updateProbeGroup(inputs) {
  const { id, name, description, isPublic, probeIds, type } = inputs;
  await IbisProbeGroupController.updateProbeGroupById(id, {
    name: name,
    description: description,
    isPublic: isPublic,
    probeIds: probeIds,
    type: type,
  });
  return id;
}

async function deleteProbeGroupById(inputs) {
  const { deletId } = inputs;
  await IbisProbeGroupController.deleteProbeGroupById(deletId);
  return deletId;
}

async function getProbeGroupById(inputs) {
  const { id } = inputs;
  const probeGroupFound = await IbisProbeGroupController.getProbeGroupById(id);

  if (probeGroupFound !== null) {
    const foundProbes = probeGroupFound.probeIds; // this is already populated through the function listProbeGroups ...
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
        return {
          ...ibisprobe.toObject(),
          subprobes: populatedSubProbes,
          fileGroupSetting: populatedFileGroupSetting,
        };
      })
    );
    const t_populatedprobegroup = {
      ...probeGroupFound.toObject(),
      probes: populatedProbes,
    };
    delete t_populatedprobegroup.probeIds;
    return t_populatedprobegroup;
  } else {
    return null;
  }
}

export {
  listIbisProbeGroups,
  createProbeGroup,
  updateProbeGroup,
  deleteProbeGroupById,
  getProbeGroupById,
};
