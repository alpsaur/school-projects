import FileUploadClientComponent from "./FileUploadClientComponent";

export default async function FileUploadPage({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;
  return (
    <>
      <FileUploadClientComponent projectId={projectId} />
    </>
  );
}
