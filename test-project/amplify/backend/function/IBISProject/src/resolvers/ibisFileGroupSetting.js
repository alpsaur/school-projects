import {
  IbisFileCombinationController,
  IbisFileGroupSettingController,
  IbisFileCategoryController,
} from "@myorg/ibis-mongodb";

async function getIbisFileGroupSetting(inputs) {
  const { id } = inputs;
  const fileGroupSettingFound =
    await IbisFileGroupSettingController.getFileGroupSettingById(id);
  const fileCombinationsFound =
    await IbisFileCombinationController.listFileCombinationsByFileGroupSettingId(
      id
    );
  return { ...fileGroupSettingFound, fileCombinations: fileCombinationsFound };
}

// need to populate the filecombinations?
async function listIbisFileGroupSettings() {
  const foundFileGroupSettings =
    await IbisFileGroupSettingController.listFileGroupSettings();
  const populatedFileGroupSettings = await Promise.all(
    foundFileGroupSettings.map(async (fgs) => {
      const fgs_id = fgs._id;
      const relatedFileCombinations =
        await IbisFileCombinationController.listFileCombinationsByFileGroupSettingId(
          fgs_id
        );
      const populatedFileCombinations = await Promise.all(
        relatedFileCombinations.map(async (fc) => {
          const categoryId = fc.categoryId;
          const foundCategory =
            await IbisFileCategoryController.getIbisFileCategory(categoryId);
          return { ...fc.toObject(), category: foundCategory };
        })
      );
      return { ...fgs.toObject(), fileCombinations: populatedFileCombinations };
    })
  );
  return populatedFileGroupSettings;
}

async function createIbisFileGroupSetting(inputs) {
  const { name, description, ownerId } = inputs;
  const createdFileGroupSetting =
    await IbisFileGroupSettingController.createFileGroupSetting({
      name: name,
      description: description,
      ownerId: ownerId,
    });
  return createdFileGroupSetting._id;
}

async function updateIbisFileGroupSetting(inputs) {
  const { id, name, description } = inputs;
  await IbisFileGroupSettingController.updateFileGroupSetting(id, {
    name: name,
    description: description,
  });
  return id;
}

async function deleteIbisFileGroupSetting(inputs) {
  const { deleteId } = inputs;
  await IbisFileGroupSettingController.deleteFileGroupSetting(deleteId);
  return deleteId;
}

async function createIbisFileCombination(inputs) {
  const { name, description, categoryId, quantity, fileGroupSettingId } =
    inputs;
  const createdFileCombination =
    await IbisFileCombinationController.createFileCombination({
      name: name,
      description: description,
      categoryId: categoryId,
      quantity: quantity,
      fileGroupSettingId: fileGroupSettingId,
    });
  return createdFileCombination._id;
}

async function updateIbisFileCombination(inputs) {
  const { id, name, description, quantity, categoryId } = inputs;
  await IbisFileCombinationController.updateFileCombination(id, {
    name: name,
    description: description,
    categoryId: categoryId,
    quantity: quantity,
  });
  return id;
}

async function deleteIbisFileCombination(inputs) {
  const { deleteId } = inputs;
  await IbisFileCombinationController.deleteFileCombination(deleteId);
  return deleteId;
}

async function getIbisFileCombination(inputs) {
  const { id } = inputs;
  return await IbisFileCombinationController.getFileCombinationById(id);
}

export {
  listIbisFileGroupSettings,
  createIbisFileGroupSetting,
  getIbisFileGroupSetting,
  updateIbisFileGroupSetting,
  deleteIbisFileGroupSetting,
};

export {
  createIbisFileCombination,
  updateIbisFileCombination,
  deleteIbisFileCombination,
  getIbisFileCombination,
};
