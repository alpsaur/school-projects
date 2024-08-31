"use client";
import {
  IbisInspection,
  IbisProject,
  ListIbisInspectionsQuery,
  ProbeTypeEnum,
} from "@/API";
import IbisBarChart from "@/components/IbisComponent/IbisBarChart";
import React, { useState } from "react";

interface BarChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

interface ProjectDashboardProps {
  projectFromServer: IbisProject;
  inspectionsQueryFromServer: ListIbisInspectionsQuery;
}

function processInspectionData(data: IbisInspection[]): BarChartData {
  const labels: string[] = [
    ProbeTypeEnum.MATCH,
    ProbeTypeEnum.PROGRESS,
    ProbeTypeEnum.PROBE,
  ];
  const dataset = {
    label: "Inspection",
    data: [
      data.filter((d) => d.type === ProbeTypeEnum.MATCH).length,
      data.filter((d) => d.type === ProbeTypeEnum.PROGRESS).length,
      data.filter((d) => d.type === ProbeTypeEnum.PROBE).length,
    ],
    backgroundColor: "rgba(153, 102, 255, 0.6)",
  };

  return {
    labels: labels,
    datasets: [dataset],
  };
}

const ProjectDashboardPageClientComponent: React.FC<ProjectDashboardProps> = ({
  projectFromServer,
  inspectionsQueryFromServer,
}) => {
  const inspections = inspectionsQueryFromServer.listIbisInspections;
  const inspBarchart = processInspectionData(inspections as IbisInspection[]);

  return (
    <>
      {/* Project Info Display ... */}
      <div className="w-full border border-blue-700 rounded-lg bg-white mb-5 p-2">
        <div className="flex text-indigo-800 font-bold text-3xl px-2 items-center">
          <span>{projectFromServer?.name}</span>
        </div>
        <div className="flex text-indigo-950 text-xl px-2">
          <span>{projectFromServer?.description}</span>
        </div>
      </div>

      {/* Other Page Summary display ... */}
      <div className="w-full border border-blue-700 rounded-lg bg-white my-5 p-2">
        <div className="flex-col text-indigo-800 font-bold text-3xl px-2 items-center">
          <span>Summary</span>
          <div className="flex text-blue-800 text-xl px-2 items-center">
            <span className="mr-5">Inspection Type: </span>
            <IbisBarChart
              data={inspBarchart}
              className="flex flex-1"
              verticalBar={false}
              displayLabel={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDashboardPageClientComponent;
