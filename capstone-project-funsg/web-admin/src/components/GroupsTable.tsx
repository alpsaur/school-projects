import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/catalystui/table.tsx";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "../components/catalystui/dropdown.tsx";
import {
  ArchiveBoxXMarkIcon,
  ArrowPathIcon,
  EllipsisHorizontalIcon,
  ViewColumnsIcon,
} from "@heroicons/react/16/solid";
import { Badge } from "../components/catalystui/badge.tsx";
import { Group } from "../hooks/useGroups.ts";
import { useState } from "react";
import GroupDetailsModal from "./GroupDetailsModal.tsx";
import RejectReasonModal from "./RejectReasonModal.tsx";

interface GroupDetailsTableProps {
  sortedGroups: Group[];
  sortField: keyof Group | null;
  sortOrder: "asc" | "desc" | null;
  handleSort: (field: keyof Group) => void | null;
  handleActivate: (groupId: number) => void;
  handleDeactivate: (groupId: number, message: string) => void;
}

const GroupsTable = ({
  sortedGroups,
  sortField,
  sortOrder,
  handleSort,
  handleActivate,
  handleDeactivate,
}: GroupDetailsTableProps) => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [deactivatingGroup, setDeactivatingGroup] = useState<Group | null>(
    null,
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleViewClick = (group: Group) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const handleDeactivateClick = (group: Group) => {
    setDeactivatingGroup(group);
    console.log("Reject clicked for group:", group); // Debugging log
  };

  const handleDeactivateCancel = () => {
    setDeactivatingGroup(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
  };

  return (
    <>
      <Table className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
        <TableHead>
          <TableRow>
            <TableHeader
              onClick={() => handleSort("id")}
              className="cursor-pointer"
            >
              Id {sortField === "id" ? (sortOrder === "asc" ? "↑" : "↓") : "↑"}
            </TableHeader>
            <TableHeader
              onClick={() => handleSort("name")}
              className="cursor-pointer"
            >
              Name{" "}
              {sortField === "name" ? (sortOrder === "asc" ? "↑" : "↓") : "↑"}
            </TableHeader>
            <TableHeader
              onClick={() => handleSort("host")}
              className="cursor-pointer"
            >
              Host{" "}
              {sortField === "host" ? (sortOrder === "asc" ? "↑" : "↓") : "↑"}
            </TableHeader>
            <TableHeader
              onClick={() => handleSort("numOfMember")}
              className="cursor-pointer"
            >
              Member{" "}
              {sortField === "numOfMember"
                ? sortOrder === "asc"
                  ? "↑"
                  : "↓"
                : "↑"}
            </TableHeader>
            <TableHeader
              onClick={() => handleSort("createdAt")}
              className="cursor-pointer"
            >
              Created At{" "}
              {sortField === "createdAt"
                ? sortOrder === "asc"
                  ? "↑"
                  : "↓"
                : "↑"}
            </TableHeader>
            <TableHeader
              onClick={() => handleSort("status")}
              className="cursor-pointer"
            >
              Status{" "}
              {sortField === "status" ? (sortOrder === "asc" ? "↑" : "↓") : "↑"}
            </TableHeader>
            <TableHeader
              onClick={() => handleSort("categoryName")}
              className="cursor-pointer"
            >
              Category{" "}
              {sortField === "categoryName"
                ? sortOrder === "asc"
                  ? "↑"
                  : "↓"
                : "↑"}
            </TableHeader>
            <TableHeader className="relative w-0">
              <span className="sr-only">Actions</span>
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedGroups?.map((group) => (
            <TableRow key={group.id}>
              <TableCell>{group.id}</TableCell>
              <TableCell className="font-medium">{group.name}</TableCell>
              <TableCell>{group.host}</TableCell>
              <TableCell>{group.numOfMember}</TableCell>
              <TableCell>{group.createdAt.substring(0, 10)}</TableCell>
              <TableCell>
                {group.status === "active" ? (
                  <Badge color="lime">Active</Badge>
                ) : group.status === "inactive" ? (
                  <Badge color="orange">Inactive</Badge>
                ) : group.status === "rejected" ? (
                  <Badge color="zinc">Rejected</Badge>
                ) : null}
              </TableCell>
              <TableCell className="text-zinc-500">
                {group.categoryName}
              </TableCell>
              <TableCell>
                <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                  <Dropdown>
                    <DropdownButton plain aria-label="More options">
                      <EllipsisHorizontalIcon />
                    </DropdownButton>
                    <DropdownMenu anchor="bottom end">
                      <DropdownItem onClick={() => handleViewClick(group)}>
                        <ViewColumnsIcon />
                        View
                      </DropdownItem>
                      {group.status === "active" ? (
                        <DropdownItem
                          onClick={() => handleDeactivateClick(group)}
                        >
                          <ArchiveBoxXMarkIcon />
                          Deactivate
                        </DropdownItem>
                      ) : group.status === "inactive" ? (
                        <DropdownItem onClick={() => handleActivate(group.id)}>
                          <ArrowPathIcon />
                          Activate
                        </DropdownItem>
                      ) : null}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isModalOpen && selectedGroup && (
        <GroupDetailsModal group={selectedGroup} onClose={handleCloseModal} />
      )}

      {deactivatingGroup && (
        <RejectReasonModal
          group={deactivatingGroup}
          onClose={handleDeactivateCancel}
          onReject={handleDeactivate}
        />
      )}
    </>
  );
};

export default GroupsTable;
