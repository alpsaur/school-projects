import React from "react";
import Selection from "./Selection";

const ProjectSideBarComponent = ({
  params,
}: {
  params: { projectId: string };
}) => {
  return (
    <div className="bg-indigo-900/80 h-[calc(100vh-4rem)] w-10 md:w-40">
      <Selection params={params} />
    </div>
  );
};

export default ProjectSideBarComponent;
