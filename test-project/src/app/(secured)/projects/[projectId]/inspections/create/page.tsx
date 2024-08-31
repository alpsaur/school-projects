import { saveInspectionInput } from "../_lib/graphqlApi";
import {
  CreateInspectionInput,
  InspectionStatusEnum,
  ProbeTypeEnum,
  UpdateInspectionInput,
} from "@/API";
import { redirect } from "next/navigation";
import InspectionDetailClientComponent from "../(inspectionComponents)/(edit)/InspectionDetailClientComponent";
import config from "@/amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import { createInspectionAction } from "./actions";
import { v4 as uuidv4 } from "uuid";

Amplify.configure(config, { ssr: true });
async function createInspection(
  inputInspectionData: CreateInspectionInput | UpdateInspectionInput
): Promise<void> {
  "use server";
  const resultId = await createInspectionAction(
    inputInspectionData as CreateInspectionInput
  );

  // only for create page...
  redirect(
    `/projects/${inputInspectionData.projectId}/inspections/${resultId}/edit`
  );
}

export default async function CreateInspectionPage({
  params,
}: {
  params: { projectId: string };
}) {
  const initialInspectionInput: CreateInspectionInput | UpdateInspectionInput =
    {
      id: uuidv4(),
      refNo: "",
      name: "",
      description: "",
      type: ProbeTypeEnum.MATCH,
      projectId: params.projectId,
      status: InspectionStatusEnum.CREATED,
    };

  return (
    <div className="flex flex-col items-center w-full p-5">
      <div className="contents p-5 w-full items-center">
        <InspectionDetailClientComponent
          initialInspectionInput={initialInspectionInput}
          handleInspectionSaveFunction={createInspection}
        />
      </div>
    </div>
  );
}
