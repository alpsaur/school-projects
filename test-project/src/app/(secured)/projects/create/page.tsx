import CreateProjectClientComponent from "./CreateProjectClientComponent";
import { headers } from "next/headers";

export default async function CreateProjectServerPage() {
  const headerLists = headers();
  const ownerIdValue: string = headerLists.get("X-IBIS-ID") ?? "";
  console.log("ownerIdValue: ", ownerIdValue);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col rounded-lg bg-indigo-50 border border-cyan-500 my-5 w-4/5">
        <div className="flex container mx-auto px-4 justify-center my-2 h-auto">
          <p className="text-3xl/loose font-bold bg-gradient-to-r from-slate-700 to-indigo-500 text-transparent bg-clip-text">
            Create Project
          </p>
        </div>
        <CreateProjectClientComponent ownerId={ownerIdValue} />
      </div>
    </div>
  );
}
