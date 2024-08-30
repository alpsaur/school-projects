import useRequests from "../hooks/useRequests.ts";
import { Heading } from "../components/catalystui/heading.tsx";
import GroupRequestTable from "../components/GroupRequestTable.tsx";

const RequestPage = () => {
  const {
    data: newGroups,
    isLoading,
    error,
    approveGroup,
    rejectGroup,
  } = useRequests();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      <Heading>
        <p className="text-4xl mb-8">New Group Requests</p>
      </Heading>
      <GroupRequestTable
        newGroups={newGroups}
        handleApprove={approveGroup}
        handleReject={rejectGroup}
      />
    </>
  );
};

export default RequestPage;
