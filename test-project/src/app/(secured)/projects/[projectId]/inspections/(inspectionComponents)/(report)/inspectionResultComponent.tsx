"use client";
import { GetIbisInspectionQuery } from "@/API";
import React from "react";

interface InspectionResultProps {
  inspectionQueryFromServer: GetIbisInspectionQuery;
}

const IbisInspectionResultComponent: React.FC<InspectionResultProps> = ({
  inspectionQueryFromServer,
}) => {
  const inspection = inspectionQueryFromServer.getIbisInspection;
  return (
    <div className="bg-white p-5 w-full mt-2 mb-2 rounded-lg border-2 border-cyan-700">
      <h1 className="font-bold">Inspection Detail</h1>
      <p>
        <span className="font-bold">Name: </span>
        <span>{inspection?.name}</span>
      </p>
      <p>
        <span className="font-bold">Description: </span>
        <span>{inspection?.description}</span>
      </p>
      <p>
        <span className="font-bold">Analysis Result: </span>
        <span>{inspection?.status}</span>
      </p>
      {/* this result status is repoStatus: onCreate, Computing, Complete ... */}
    </div>
  );
};

export default IbisInspectionResultComponent;
