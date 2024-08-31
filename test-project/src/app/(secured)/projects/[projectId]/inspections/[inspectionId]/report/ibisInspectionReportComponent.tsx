"use client";
import {
  CreateProbeGroupInput,
  CreateProbeGroupResultInput,
  GetIbisInspectionQuery,
  IbisFile,
  IbisInspection,
  IbisProbe,
  IbisProbeGroup,
  IbisProbeGroupResult,
  ProbeTypeEnum,
} from "@/API";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import IbisInspectionResultComponent from "../../(inspectionComponents)/(report)/inspectionResultComponent";
import IbisProbeGroupResultReportComponent from "../../(inspectionComponents)/(report)/probegroupResultReportComponent";
import ColorViewerComponent from "../../(inspectionComponents)/(threeViewer)/ColorViewerComponent";
import MarkerViewerComponent from "../../(inspectionComponents)/(threeViewer)/MarkerViewerComponent";
import XmiViewerComponent from "../../(inspectionComponents)/(threeViewer)/XmiViewerComponent";
import config from "@/amplifyconfiguration.json";
import { Amplify } from "aws-amplify";

Amplify.configure(config, { ssr: true });

interface PathGroup {
  filePath: string;
  resultPath: string;
  type: string;
}
interface InspectionReportProps {
  inspectionQueryFromServer: GetIbisInspectionQuery;
  fileRefDataFromServer: IbisFile[];
  probegroupsResultDataFromServer: IbisProbeGroupResult[];
  allProbeGroupsDataFromServer: IbisProbeGroup[];
  projectId: string;
  inspectionId: string;
  pathGroup: PathGroup[];
}

const IbisInspectionReportComponent: React.FC<InspectionReportProps> = ({
  inspectionQueryFromServer,
  fileRefDataFromServer,
  probegroupsResultDataFromServer,
  allProbeGroupsDataFromServer,
  projectId,
  inspectionId,
  pathGroup,
}) => {
  const fileRefData = fileRefDataFromServer;
  const probegroupsResultData = probegroupsResultDataFromServer;
  const allProbeGroupsData = allProbeGroupsDataFromServer;
  const [isSideBarVisible, setIsSideBarVisible] = useState<boolean>(true);
  const [sidebarWidth, setSidebarWidth] = useState("w-1/2");

  const toggleSidebar = () => {
    setIsSideBarVisible(!isSideBarVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarWidth("w-2/3"); // For smaller screens, make the sidebar wider
      } else {
        setSidebarWidth("w-1/2"); // For larger screens, set the sidebar width to 1/3 of the window
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial width based on current window size

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // console.log("fetchInspectionData", fetchedInspectionData);

  console.log("fileRefData", fileRefData);

  // console.log("probegroupsResultData", probegroupsResultData);

  // console.log("allProbeGroupsData", allProbeGroupsData);
  const viewMode = pathGroup[0].type;
  return (
    <div className="flex-grow flex flex-row-reverse bg-gray-200 h-full">
      {/* 3D Viewer Content - should be replaced with 3dviewer component later... */}
      <div className="flex-grow bg-gray-200 p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold">3D Viewer</h1>
        <p className="mt-4">
          This is the 3d viewer area. The right sidebar can be folded by
          clicking the arrow.
        </p>
        {viewMode === ProbeTypeEnum.PROGRESS ? (
          <ColorViewerComponent pathGroup={pathGroup} />
        ) : viewMode === ProbeTypeEnum.PROBE ? (
          <MarkerViewerComponent pathGroup={pathGroup} />
        ) : (
          <>
            <XmiViewerComponent pathGroup={pathGroup} status="traget" />
            <XmiViewerComponent pathGroup={pathGroup} status="source" />
          </>
        )}
      </div>

      {/* Right Sidebar */}
      <div
        className={`h-[calc(100vh-4rem)] fixed bg-white shadow-lg z-10 transition-all duration-200 ${
          isSideBarVisible ? `${sidebarWidth}` : "w-0"
        }`}
      >
        <div className="flex flex-col items-center w-full h-full overflow-y-auto py-5">
          {/* back to inspection detail/edit page button */}
          <Link
            href={`/projects/${projectId}/inspection/${inspectionId}`}
            className="w-full px-5"
          >
            <div
              className={`bg-blue-400 hover:bg-blue-800 text-white w-full h-6 font-bold rounded text-center`}
            >
              Back to Inspection Detail Page
            </div>
          </Link>

          {/* Inspection Basic Info and Final Result Status Component ... */}
          <div className="w-full px-5 items-center">
            <IbisInspectionResultComponent
              inspectionQueryFromServer={inspectionQueryFromServer}
            />
          </div>

          {/* Each ProbeGroup Info and Result Status Components ... (with corresponding contains_result probe result components) */}
          {probegroupsResultData.map((probegroupresult) => {
            const probegroupId = probegroupresult.probeGroupId;
            const probegroupRefData = allProbeGroupsData.find(
              (probegroup) => probegroup.id === probegroupId
            ) as IbisProbeGroup;

            const probeRefDatas = probegroupRefData.probes as IbisProbe[];
            return (
              <div
                key={probegroupresult.id}
                className="w-full px-5 items-center"
              >
                <IbisProbeGroupResultReportComponent
                  probegroupresultDataFromServer={probegroupresult}
                  probegroupRefDataFromServer={probegroupRefData}
                  probesRefDataFromServer={probeRefDatas}
                  refFilesDataFromServer={fileRefData}
                />
              </div>
            );
          })}
        </div>

        {/* Toggle Button */}
        <div
          onClick={toggleSidebar}
          className={`absolute top-1/2 transform -translate-y-1/2 w-10 h-20 bg-blue-500 text-white flex items-center justify-center cursor-pointer z-20 ${
            isSideBarVisible ? "-left-10" : "fixed right-0"
          }`}
        >
          <span>{isSideBarVisible ? "▶" : "◀"}</span>
        </div>
      </div>
    </div>
  );
};

export default IbisInspectionReportComponent;
