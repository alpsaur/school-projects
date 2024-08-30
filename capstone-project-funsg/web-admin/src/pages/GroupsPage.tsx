import useGroups, { Group } from "../hooks/useGroups.ts";
import { useEffect, useState } from "react";

import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
} from "../components/catalystui/pagination.tsx";
import GroupsTable from "../components/GroupsTable.tsx";
import CategoryDropdown from "../components/CategoryDropdown.tsx";
import { Heading } from "../components/catalystui/heading.tsx";

const GroupsPage = () => {
  const pageSize = 15;
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number>();

  const {
    data: paginatedGroups,
    error,
    isLoading,
    activateGroup,
    deactivateGroup,
  } = useGroups({ page, pageSize, categoryId });

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedGroups, setSortedGroups] = useState<Group[]>([]);
  const [sortField, setSortField] = useState<keyof Group>("id");

  // Function to sort groups based on the current sortField
  const sortGroups = (
    groups: Group[] | undefined, // Allow `groups` to be undefined initially
    order: "asc" | "desc",
    field: keyof Group,
  ) => {
    if (!groups || !Array.isArray(groups)) {
      console.error("The groups variable is not defined or is not an array.");
      setSortedGroups([]); // Set sortedGroups to an empty array if there is an issue
      return;
    }

    const sorted = [...groups].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
    setSortedGroups(sorted);
  };

  // Sort groups when they are fetched or when sortOrder or sortField changes
  useEffect(() => {
    console.log(paginatedGroups);
    if (paginatedGroups?.groups && Array.isArray(paginatedGroups.groups)) {
      console.log("Content to be sorted:", paginatedGroups.groups);
      sortGroups(paginatedGroups.groups, sortOrder, sortField);
    } else {
      console.log("No content found or content is not an array.");
    }
  }, [paginatedGroups, sortOrder, sortField]);

  // Handler for sorting any column
  const handleSort = (field: keyof Group) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      <Heading>
        <p className="text-4xl mb-8">Interest Groups</p>
      </Heading>
      <CategoryDropdown categoryId={categoryId} setCategoryId={setCategoryId} />

      <GroupsTable
        sortedGroups={sortedGroups}
        sortField={sortField}
        sortOrder={sortOrder}
        handleSort={handleSort}
        handleActivate={activateGroup}
        handleDeactivate={deactivateGroup}
      />

      <Pagination className="flex justify-between mt-2">
        <PaginationPrevious
          href={page > 1 ? `?page=${page - 1}` : null}
          onClick={() => setPage(page - 1)}
        />
        <PaginationNext
          href={
            page < (paginatedGroups?.totalPages ?? 1)
              ? `?page=${page + 1}`
              : null
          }
          onClick={() => setPage(page + 1)}
          disabled={page >= (paginatedGroups?.totalPages ?? 1)}
        />
      </Pagination>
    </>
  );
};
export default GroupsPage;
