"use server";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import config from "@/amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import { cookies } from "next/headers";
import { createIbisProject } from "@/graphql/mutations";
import { redirect } from "next/navigation";

Amplify.configure(config, { ssr: true });
const client = generateServerClientUsingCookies({
  config,
  cookies,
});

export async function createProject(
  name: string,
  userId: string,
  description?: string
) {
  "use server";
  const createdProject = await client.graphql({
    query: createIbisProject,
    variables: {
      input: {
        name: name,
        description: description,
        ownerId: userId,
      },
    },
  });

  console.log("The created project id is: ", createdProject);
  redirect("/projects");
}
