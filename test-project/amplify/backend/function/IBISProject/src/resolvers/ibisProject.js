import { IbisProjectController } from "@myorg/ibis-mongodb";

async function createIbisProject(inputs) {
  const { name, description, ownerId } = inputs;
  let returnedProj = await IbisProjectController.CreateProject({
    name: name,
    description: description,
    ownerId: ownerId,
  });
  return returnedProj.id;
}

// may be should add inputs parameters for better searching???
async function listIbisProjects(inputs) {
  const { ownerId } = inputs;
  let foundProjects = null;
  if (ownerId) {
    foundProjects = await IbisProjectController.listProjects(ownerId);
  } else {
    foundProjects = await IbisProjectController.listProjects();
  }
  return foundProjects;
}

async function updateIbisProject(inputs) {
  const { id, name, description } = inputs;
  await IbisProjectController.updateProject(id, {
    name: name,
    description: description,
  });
  return id;
}

async function deleteIbisProject(inputs) {
  const { deleteId } = inputs;
  await IbisProjectController.DeleteProjectById(deleteId);
  return deleteId;
}

async function getIbisProject(inputs) {
  const { id } = inputs;
  const foundProject = await IbisProjectController.getProjectById(id);
  return foundProject;
}

export {
  createIbisProject,
  listIbisProjects,
  updateIbisProject,
  deleteIbisProject,
  getIbisProject,
};
