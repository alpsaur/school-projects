import { User } from "../hooks/useUsers.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./catalystui/table.tsx";
import { Avatar } from "./catalystui/avatar.tsx";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "./catalystui/dropdown.tsx";
import {
  EllipsisHorizontalIcon,
  LockClosedIcon,
  LockOpenIcon,
  ViewColumnsIcon,
} from "@heroicons/react/16/solid";
import { useState } from "react";
import { Badge } from "./catalystui/badge.tsx";
import UserDetailsModal from "./UserDetailsModal.tsx";

interface UserDetailsTableProps {
  users: User[];
  handleBan: (userId: number) => void;
  handleEnable: (userId: number) => void;
}

const UsersTable = ({
  users,
  handleBan,
  handleEnable,
}: UserDetailsTableProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleViewClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <Table
        dense
        className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]"
      >
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader className="text-center"> Created At</TableHeader>
            <TableHeader className="text-center">Owned Groups</TableHeader>
            <TableHeader className="text-center">Joined Groups</TableHeader>
            <TableHeader className="text-center">Past Events</TableHeader>
            <TableHeader className="text-center">Status</TableHeader>
            <TableHeader className="text-center"></TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.userId}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Avatar
                      src={user.profileImage}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      className="size-12"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-zinc-500">
                      <a href="#" className="hover:text-zinc-700">
                        {user.email}
                      </a>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {user.createdAt.substring(0, 10)}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {user.hostedGroups.length}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {user.groups.length}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {user.events.length}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {user.status === "active" ? (
                  <Badge color="lime">Active</Badge>
                ) : (
                  <Badge color="orange">Banned</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                  <Dropdown>
                    <DropdownButton plain aria-label="More options">
                      <EllipsisHorizontalIcon />
                    </DropdownButton>
                    <DropdownMenu anchor="bottom end">
                      <DropdownItem onClick={() => handleViewClick(user)}>
                        <ViewColumnsIcon />
                        View
                      </DropdownItem>
                      {user.status === "active" ? (
                        <DropdownItem onClick={() => handleBan(user.userId)}>
                          <LockClosedIcon />
                          Ban
                        </DropdownItem>
                      ) : (
                        <DropdownItem onClick={() => handleEnable(user.userId)}>
                          <LockOpenIcon />
                          Enable
                        </DropdownItem>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isModalOpen && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default UsersTable;
