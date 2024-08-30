import useUsers from "../hooks/useUsers.ts";
import UsersTable from "../components/UsersTable.tsx";
import { Heading } from "../components/catalystui/heading.tsx";
import { useState } from "react";
import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
} from "../components/catalystui/pagination.tsx";

const UsersPage = () => {
  const pageSize = 15;
  const [page, setPage] = useState(1);
  const {
    data: paginatedUsers,
    error,
    isLoading,
    enableUser,
    banUser,
  } = useUsers({ page, pageSize });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      <Heading>
        <p className="text-4xl mb-8">Users</p>
      </Heading>
      <UsersTable
        users={paginatedUsers?.users || []}
        handleBan={banUser}
        handleEnable={enableUser}
      />

      <Pagination className="flex justify-between mt-2">
        <PaginationPrevious
          href={page > 1 ? `?page=${page - 1}` : null}
          onClick={() => setPage(page - 1)}
        />
        <PaginationNext
          href={
            page < (paginatedUsers?.totalPages ?? 1)
              ? `?page=${page + 1}`
              : null
          }
          onClick={() => setPage(page + 1)}
          disabled={page >= (paginatedUsers?.totalPages ?? 1)}
        />
      </Pagination>
    </>
  );
};

export default UsersPage;
