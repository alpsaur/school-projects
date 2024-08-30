import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./catalystui/table.tsx";
import { Group } from "../hooks/useGroups.ts";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "./catalystui/dropdown.tsx";
import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import RejectReasonModal from "./RejectReasonModal.tsx";
import NewGroupDetailsModal from "./NewGroupDetailsModal.tsx";

interface GroupRequestTableProp {
  newGroups?: Group[];
  handleApprove: (groupId: number) => void;
  handleReject: (groupId: number, message: string) => void;
}

const GroupRequestTable = ({
  newGroups,
  handleReject,
  handleApprove,
}: GroupRequestTableProp) => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [rejectingGroup, setRejectingGroup] = useState<Group | null>(null);

  const handleView = (group: Group) => {
    setSelectedGroup(group);
  };

  const handleCloseModal = () => {
    setSelectedGroup(null);
  };

  const handleRejectClick = (group: Group) => {
    setRejectingGroup(group);
    console.log("Reject clicked for group:", group); // Debugging log
  };

  const handleRejectCancel = () => {
    setRejectingGroup(null);
  };

  if (!Array.isArray(newGroups) || newGroups.length === 0) {
    return <div>No new group requests available</div>;
  }

  return (
    <>
      <Table className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Host</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Application Date</TableHeader>
            <TableHeader className="relative w-0">
              <span className="sr-only">Actions</span>
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {newGroups.map((group) => (
            <TableRow key={group.id}>
              <TableCell className="font-medium">{group.name}</TableCell>
              <TableCell>{group.host}</TableCell>
              <TableCell className="text-zinc-500">
                {group.categoryName}
              </TableCell>
              <TableCell className="text-zinc-500">
                {group.createdAt.substring(0, 10)}
              </TableCell>
              <TableCell>
                <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                  <Dropdown>
                    <DropdownButton plain aria-label="More options">
                      <EllipsisHorizontalIcon />
                    </DropdownButton>
                    <DropdownMenu anchor="bottom end">
                      <DropdownItem onClick={() => handleView(group)}>
                        View
                      </DropdownItem>
                      <DropdownItem onClick={() => handleApprove(group.id)}>
                        Approve
                      </DropdownItem>
                      <DropdownItem onClick={() => handleRejectClick(group)}>
                        Reject
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {rejectingGroup && (
        <RejectReasonModal
          group={rejectingGroup}
          onClose={handleRejectCancel}
          onReject={handleReject}
        />
      )}

      {selectedGroup && (
        <NewGroupDetailsModal
          group={selectedGroup}
          onClose={handleCloseModal}
          handleApprove={handleApprove}
          handleReject={handleReject}
        />
      )}
    </>
  );
};

export default GroupRequestTable;
