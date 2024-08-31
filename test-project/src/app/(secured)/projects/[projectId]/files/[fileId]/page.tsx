import React from "react";

export default function page({ params }: { params: { fileId: string } }) {
  return <div>page of file {params.fileId}</div>;
}
