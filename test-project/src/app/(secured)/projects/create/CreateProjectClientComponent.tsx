"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IbisButton } from "@/components/IbisComponent";
import IbisInputBar from "@/components/IbisComponent/IbisInputBar";
import { createProject } from "./actions";

interface CreateProjectComponentProps {
  // createProject: (name: string, userId: string, desc?: string) => Promise<void>;
  ownerId: string;
}

const CreateProjectClientComponent: React.FC<CreateProjectComponentProps> = ({
  ownerId,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(name, description);
    console.log("handleSubmit name:", name);
    console.log("handleSubmit description:", description);
    await createProject(name, ownerId, description);
  };

  return (
    <div>
      <div className="mx-10 my-5">
        <IbisInputBar
          labelName={"Name"}
          attributeName={"name"}
          type={"text"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mx-10 my-5">
        <IbisInputBar
          labelName={"Description"}
          attributeName={"description"}
          type={"textarea"}
          value={description}
          textAreaOnChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex flex-row my-5 px-5 justify-center">
        <IbisButton
          type="button"
          className="bg-slate-400 hover:bg-slate-600 mx-2"
          normalOnClick={() => router.back()}
        >
          Cancel
        </IbisButton>

        <IbisButton type="submit" className="mx-2" aysncOnClick={handleSubmit}>
          Create
        </IbisButton>
      </div>
    </div>
  );
};

export default CreateProjectClientComponent;
