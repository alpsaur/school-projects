import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./catalystui/table.tsx";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "./catalystui/dropdown.tsx";
import {
  CheckCircleIcon,
  EllipsisHorizontalIcon,
  ViewColumnsIcon,
  XCircleIcon,
} from "@heroicons/react/16/solid";

import { Event } from "../hooks/useEvents.ts";
import { Badge } from "./catalystui/badge.tsx";
import { useState } from "react";
import EventDetailsModal from "./EventDetailsModal.tsx";

interface Props {
  filteredEvents: Event[];
  handleCancel: (eventId: number) => void;
  handleReopen: (eventId: number) => void;
}

const EventsTable = ({ filteredEvents, handleCancel, handleReopen }: Props) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleViewClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };
  return (
    <>
      <Table className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
        <TableHead>
          <TableRow>
            <TableHeader>id</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Host</TableHeader>
            <TableHeader>Start Date</TableHeader>
            <TableHeader>End Date</TableHeader>
            <TableHeader>Participants</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader className="relative w-0">
              <span className="sr-only">Actions</span>
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredEvents.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.id}</TableCell>
              <TableCell className="font-medium">{event.name}</TableCell>
              <TableCell>{event.createdBy.name}</TableCell>

              <TableCell>{event.start.substring(0, 10)}</TableCell>
              <TableCell>{event.end.substring(0, 10)}</TableCell>

              <TableCell>{event.eventParticipants.length}</TableCell>
              <TableCell>
                {event.status === "open" ? (
                  <Badge color="lime">Open</Badge>
                ) : event.status === "close" ? (
                  <Badge color="zinc">Close</Badge>
                ) : (
                  <Badge color="orange">Canceled</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                  <Dropdown>
                    <DropdownButton plain aria-label="More options">
                      <EllipsisHorizontalIcon />
                    </DropdownButton>
                    <DropdownMenu anchor="bottom end">
                      <DropdownItem onClick={() => handleViewClick(event)}>
                        <ViewColumnsIcon />
                        View
                      </DropdownItem>
                      {event.status === "open" ? (
                        <DropdownItem onClick={() => handleCancel(event.id)}>
                          <XCircleIcon />
                          Cancel
                        </DropdownItem>
                      ) : event.status === "canceled" ? (
                        <DropdownItem onClick={() => handleReopen(event.id)}>
                          <CheckCircleIcon />
                          Resume
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
      {isModalOpen && selectedEvent && (
        <EventDetailsModal event={selectedEvent} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default EventsTable;
