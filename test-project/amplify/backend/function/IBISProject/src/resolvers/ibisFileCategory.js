import { IbisFileCategoryController } from "@myorg/ibis-mongodb";

async function createIbisFileCatagory(inputs) {
  const { name, description, acceptableExtensions } = inputs;
  const createdFileCategory =
    await IbisFileCategoryController.createFileCategory({
      name: name,
      description: description,
      acceptableExtensions: acceptableExtensions,
    });
  return createdFileCategory._id;
}

async function updateIbisFileCategory(inputs) {
  const { id, name, description, acceptableExtensions } = inputs;
  await IbisFileCategoryController.updateFileCategory(id, {
    name: name,
    description: description,
    acceptableExtensions: acceptableExtensions,
  });
  return id;
}

async function deleteIbisFileCategory(inputs) {
  const { deleteId } = inputs;
  await IbisFileCategoryController.deleteFileCategory(deleteId);
  return deleteId;
}

async function listIbisFileCategories() {
  return await IbisFileCategoryController.listIbisFileCategories();
}

async function getIbisFileCategory(inputs) {
  const { id } = inputs;
  return await IbisFileCategoryController.getIbisFileCategory(id);
}

export {
  createIbisFileCatagory,
  updateIbisFileCategory,
  deleteIbisFileCategory,
  listIbisFileCategories,
  getIbisFileCategory,
};
