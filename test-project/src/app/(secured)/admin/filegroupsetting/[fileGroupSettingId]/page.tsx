import React from "react";

export default function FileGroupSettingDetailPage({
  params,
}: {
  params: { fileGroupSettingId: string };
}) {
  return <div>FileGroupSettingDetailPage {params.fileGroupSettingId}</div>;
}
