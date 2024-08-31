"use server";
import config from "@/amplifyconfiguration.json";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { cookies } from "next/headers";
import { IbisFileCategory, IbisFileGroupSetting } from "@/API";
import {
  getIbisFileCategory,
  getIbisFileGroupSetting,
  listIbisFileCategories,
  listIbisFileGroupSettings,
} from "@/graphql/queries";

const client = generateServerClientUsingCookies({
  config,
  cookies,
});

async function fetchFileCategories(): Promise<IbisFileCategory[]> {
  const result = await client.graphql({
    query: listIbisFileCategories,
  });

  const { data } = result;
  const categoryList = data.listIbisFileCategories;

  if (categoryList) {
    return categoryList;
  } else {
    return [];
  }
}

async function getFileCategoryById(
  id: string
): Promise<IbisFileCategory | null> {
  const result = await client.graphql({
    query: getIbisFileCategory,
    variables: {
      id: id,
    },
  });

  const { data } = result;
  const fetchedFileCategory = data.getIbisFileCategory;

  if (fetchedFileCategory) {
    return fetchedFileCategory;
  } else {
    return null;
  }
}

async function getFileGroupSettingById(
  id: string
): Promise<IbisFileGroupSetting | null> {
  const result = await client.graphql({
    query: getIbisFileGroupSetting,
    variables: {
      id: id,
    },
  });

  const data = result.data.getIbisFileGroupSetting;

  if (data) {
    return data;
  } else {
    return null;
  }
}

export { fetchFileCategories, getFileCategoryById, getFileGroupSettingById };
