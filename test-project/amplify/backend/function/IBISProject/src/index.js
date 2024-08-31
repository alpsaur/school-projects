/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

import { dbConnection } from "@myorg/ibis-mongodb";

import {
  createIbisProject,
  deleteIbisProject,
  getIbisProject,
  listIbisProjects,
  updateIbisProject,
} from "./resolvers/ibisProject.js";

import {
  getProbeById,
  listAllProbes,
  updateProbe,
  createProbe,
  deleteProbeById,
} from "./resolvers/ibisProbe.js";

import {
  listAllSubProbes,
  updateSubProbe,
  createSubProbe,
  deleteSubProbeById,
} from "./resolvers/ibisSubProbe.js";

import {
  createParameter,
  deleteParameterById,
  listAllParameters,
  updateParameter,
} from "./resolvers/ibisParameter.js";

import {
  listIbisProbeGroups,
  createProbeGroup,
  updateProbeGroup,
  deleteProbeGroupById,
  getProbeGroupById,
} from "./resolvers/ibisProbeGroup.js";

import {
  listInspections,
  getInspectionById,
  createInspection,
  updateInspection,
  deleteInspection,
} from "./resolvers/ibisInspection.js";

import {
  updateProbeGroupResult,
  createProbeGroupResult,
  deleteProbeGroupResult,
} from "./resolvers/ibisInspection.js";

import {
  updateProbeResult,
  createProbeResult,
  deleteProbeResult,
  updateProbeResultStatus,
} from "./resolvers/ibisInspection.js";

import {
  createIbisFile,
  listIbisFiles,
  getIbisFile,
  deleteIbisFile,
  updateIbisFile,
  createIbisFileMetadata,
  deleteIbisFileMetadata,
  updateIbisFileMetadata,
} from "./resolvers/ibisFile.js";

import {
  createIbisFileCombination,
  getIbisFileCombination,
  updateIbisFileCombination,
  deleteIbisFileCombination,
} from "./resolvers/ibisFileGroupSetting.js";

import {
  createIbisFileGroupSetting,
  listIbisFileGroupSettings,
  deleteIbisFileGroupSetting,
  getIbisFileGroupSetting,
  updateIbisFileGroupSetting,
} from "./resolvers/ibisFileGroupSetting.js";

import {
  createIbisFileCatagory,
  deleteIbisFileCategory,
  getIbisFileCategory,
  listIbisFileCategories,
  updateIbisFileCategory,
} from "./resolvers/ibisFileCategory.js";

export async function handler(event, context, callback) {
  const MONGO_USER = process.env.MONGODB_USER;
  const PASSWORD = process.env.MONGODB_PASSWORD;
  const DB_NAME = process.env.DB_NAME;
  dbConnection.setUrlConstructor(MONGO_USER, PASSWORD, DB_NAME);
  await dbConnection.connMongoDB();
  console.log(`EVENT: ${JSON.stringify(event)}`);
  try {
    switch (event.typeName) {
      case "Query":
        switch (event.fieldName) {
          case "listIbisProjects":
            return await listIbisProjects(event.arguments);
          case "getIbisProject":
            return await getIbisProject(event.arguments);

          case "listIbisFiles":
            return await listIbisFiles(event.arguments);
          case "getIbisFile":
            return await getIbisFile(event.arguments);

          case "listIbisFileCategories":
            return await listIbisFileCategories();
          case "getIbisFileCategory":
            return await getIbisFileCategory(event.arguments);

          case "getIbisFileCombination":
            return await getIbisFileCombination(event.arguments);

          case "listIbisFileGroupSettings":
            return await listIbisFileGroupSettings();
          case "getIbisFileGroupSetting":
            return await getIbisFileGroupSetting(event.arguments);

          case "listIbisProbeGroups":
            return await listIbisProbeGroups(event.arguments);
          case "getIbisProbeGroup":
            return await getProbeGroupById(event.arguments);

          case "listIbisProbes":
            return await listAllProbes(event.arguments);
          case "getIbisProbe":
            return await getProbeById(event.arguments);

          case "listIbisSubProbes":
            return await listAllSubProbes(event.arguments);
          case "listIbisParameters":
            return await listAllParameters(event.arguments);

          case "listIbisInspections":
            return await listInspections(event.arguments);
          case "getIbisInspection":
            return await getInspectionById(event.arguments);

          // maybe not needed ...
          // case "getIbisProbeGroupResult":
          //   return await get;
          // case "getIbisProbeResult":
          //   return;
          default:
            throw new Error(`Unknown fieldName: \${event.fieldName}`);
        }
      case "Mutation":
        switch (event.fieldName) {
          case "createIbisProject":
            return await createIbisProject(event.arguments.input);
          case "updateIbisProject":
            return await updateIbisProject(event.arguments.input);
          case "deleteIbisProject":
            return await deleteIbisProject(event.arguments);

          case "createIbisFile":
            return await createIbisFile(event.arguments.input);
          case "updateIbisFile":
            return await updateIbisFile(event.arguments.input);
          case "deleteIbisFile":
            return await deleteIbisFile(event.arguments);

          case "createIbisFileCategory":
            return await createIbisFileCatagory(event.arguments.input);
          case "updateIbisFileCategory":
            return await updateIbisFileCategory(event.arguments.input);
          case "deleteIbisFileCategory":
            return await deleteIbisFileCategory(event.arguments);

          case "createIbisFileCombination":
            return await createIbisFileCombination(event.arguments.input);
          case "updateIbisFileCombination":
            return await updateIbisFileCombination(event.arguments.input);
          case "deleteIbisFileCombination":
            return await deleteIbisFileCombination(event.arguments);

          case "createIbisFileGroupSetting":
            return await createIbisFileGroupSetting(event.arguments.input);
          case "updateIbisFileGroupSetting":
            return await updateIbisFileGroupSetting(event.arguments.input);
          case "deleteIbisFileGroupSetting":
            return await deleteIbisFileGroupSetting(event.arguments);

          case "createIbisFileMetadata":
            return await createIbisFileMetadata(event.arguments.input);
          case "updateIbisFileMetadata":
            return await updateIbisFileMetadata(event.arguments.input);
          case "deleteIbisFileMetadata":
            return await deleteIbisFileMetadata(event.arguments);

          case "createIbisProbeGroup":
            return await createProbeGroup(event.arguments.input);
          case "updateIbisProbeGroup":
            return await updateProbeGroup(event.arguments.input);
          case "deleteIbisProbeGroup":
            return await deleteProbeGroupById(event.arguments);

          case "createIbisProbe":
            return await createProbe(event.arguments.input);
          case "updateIbisProbe":
            return await updateProbe(event.arguments.input);
          case "deleteIbisProbe":
            return await deleteProbeById(event.arguments);

          case "createIbisSubProbe":
            return await createSubProbe(event.arguments.input);
          case "updateIbisSubProbe":
            return await updateSubProbe(event.arguments.input);
          case "deleteIbisSubProbe":
            return await deleteSubProbeById(event.arguments);

          case "createIbisParameter":
            return await createParameter(event.arguments.input);
          case "updateIbisParameter":
            return await updateParameter(event.arguments.input);
          case "deleteIbisParameter":
            return await deleteParameterById(event.arguments);

          case "createIbisInspection":
            return await createInspection(event.arguments.input);
          case "updateIbisInspection":
            return await updateInspection(event.arguments.input);
          case "deleteIbisInspection":
            return await deleteInspection(event.arguments);

          case "createIbisProbeGroupResult":
            return await createProbeGroupResult(event.arguments.input);
          case "updateIbisProbeGroupResult":
            return await updateProbeGroupResult(event.arguments.input);
          case "deleteIbisProbeGroupResult":
            return await deleteProbeGroupResult(event.arguments);

          case "createIbisProbeResult":
            return await createProbeResult(event.arguments.input);
          case "updateIbisProbeResult":
            return await updateProbeResult(event.arguments.input);
          case "deleteIbisProbeResult":
            return await deleteProbeResult(event.arguments);

          // special mutation for subscription ...
          case "updateIbisProbeResultStatus":
            return await updateProbeResultStatus(event.arguments.input);
          default:
            throw new Error(`Unknown fieldName: \${event.fieldName}`);
        }
      default:
        throw new Error(`Unknown typeName: \${event.typeName}`);
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  } finally {
    await dbConnection.disconnMongoDB();
  }
}
