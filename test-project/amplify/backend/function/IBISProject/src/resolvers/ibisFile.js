import {
  IbisFileController,
  IbisFileMetadataController,
} from "@myorg/ibis-mongodb";

async function createIbisFile(inputs) {
  const { name, filepath, projectId, fileMetadata, description, isGenerated } =
    inputs;
  if (fileMetadata) {
    // const metadatas = fileMetadata.map((metadata) => {key: metadata.key, value: metadata.value});
    console.log(
      "- FUNCTION createIbisFile: The received metadatas are: ",
      fileMetadata
    );
    const createdFile = await IbisFileController.createIbisFile(
      {
        name: name,
        filepath: filepath,
        projectId: projectId,
        description: description,
        isGenerated: isGenerated,
      },
      fileMetadata
    );
    return createdFile._id;
  } else {
    const createdFile = await IbisFileController.createIbisFile(
      {
        name: name,
        filepath: filepath,
        projectId: projectId,
        description: description,
        isGenerated: isGenerated,
      },
      []
    );
    return createdFile._id;
  }
}

async function createIbisFileMetadata(inputs) {
  const { key, value, fileId } = inputs;
  const createdMetadata = await IbisFileMetadataController.createFileMetadata({
    key: key,
    value: value,
    fileId: fileId,
  });
  return createdMetadata._id;
}

async function listIbisFiles(inputs) {
  const { projectId, categoryId } = inputs;
  let foundFiles = null;
  if (categoryId) {
    foundFiles = await IbisFileController.listFiles(projectId, categoryId);
  } else {
    foundFiles = await IbisFileController.listFiles(projectId);
  }

  const populatedFiles = await Promise.all(
    foundFiles.map(async (ibisfile) => {
      try {
        const fileId = ibisfile._id;
        const foundMetadatas =
          await IbisFileMetadataController.listAllFileMetadatas(
            undefined,
            undefined,
            fileId
          );
        return {
          ...ibisfile.toObject(),
          fileMetadata: [...foundMetadatas],
        };
      } catch (error) {
        return { ...ibisfile.toObject(), fileMetadata: [] };
      }
    })
  );

  return populatedFiles;
}

async function updateIbisFile(inputs) {
  const { fileId, name, description } = inputs;
  await IbisFileController.updateFile(fileId, {
    name: name,
    description: description,
  });
  return fileId;
}

async function updateIbisFileMetadata(inputs) {
  const { id, key, value } = inputs;
  await IbisFileMetadataController.updateFileMetadataById(id, {
    key: key,
    value: value,
  });
  return id;
}

async function deleteIbisFileMetadata(inputs) {
  const { deleteId } = inputs;
  await IbisFileMetadataController.deleteFileMetadataById(deleteId);
  return deleteId;
}

async function deleteIbisFile(inputs) {
  const { deleteId } = inputs;
  await IbisFileController.deleteFile(deleteId);
  return deleteId;
}

async function getIbisFile(inputs) {
  const { id } = inputs;
  return await IbisFileController.getIbisFile(id);
}

async function getIbisFileMetadata(inputs) {
  const { id } = inputs;
  return await IbisFileMetadataController.getFileMetadataById(id);
}

export {
  createIbisFile,
  listIbisFiles,
  updateIbisFile,
  deleteIbisFile,
  getIbisFile,
};
export {
  createIbisFileMetadata,
  updateIbisFileMetadata,
  deleteIbisFileMetadata,
  getIbisFileMetadata,
};
