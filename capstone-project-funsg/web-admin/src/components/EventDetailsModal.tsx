import { Event } from "../hooks/useEvents.ts";
import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "./catalystui/dialog.tsx";
import { Field, FieldGroup, Fieldset, Label } from "./catalystui/fieldset.tsx";
import { Input } from "./catalystui/input.tsx";

import { Button } from "./catalystui/button.tsx";

interface EventDetailsModalProps {
  event: Event;
  onClose: () => void;
}

const EventDetailsModal = ({ event, onClose }: EventDetailsModalProps) => {
  const [isOpen, setIsOpen] = useState(true); // Modal starts open

  const handleCancel = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleCancel} size="3xl">
        <DialogTitle>{event.name} </DialogTitle>
        <DialogBody>
          <Fieldset>
            <FieldGroup>
              {/* Event Basic Information */}
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                <Field>
                  <Label>Id</Label>
                  <Input value={event.id} readOnly />
                </Field>
                <Field>
                  <Label>Host</Label>
                  <Input value={event.createdBy.name} readOnly />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                <Field>
                  <Label>Category</Label>
                  <Input value={event.categoryName} readOnly />
                </Field>
                <Field>
                  <Label>Group</Label>
                  <Input
                    value={event.groupName + "  (Id: " + event.groupId + ")"}
                    readOnly
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                <Field>
                  <Label>Max Participants</Label>
                  <Input value={event.maxParticipants} readOnly />
                </Field>
                <Field>
                  <Label>Created At</Label>
                  <Input value={event.createdAt.substring(0, 10)} readOnly />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                <Field>
                  <Label>Start Time</Label>
                  <Input
                    value={
                      new Date(event.start).toLocaleDateString() +
                      "\t" +
                      new Date(event.start).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }
                    readOnly
                  />
                </Field>
                <Field>
                  <Label>End Time </Label>
                  <Input
                    value={
                      new Date(event.end).toLocaleDateString() +
                      "\t" +
                      new Date(event.end).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }
                    readOnly
                  />
                </Field>
              </div>

              <Field>
                <Label>Location</Label>
                <div className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="px-4 py-5 sm:p-6">{event.location}</div>
                </div>
              </Field>
              <Field>
                <Label>Description</Label>
                <div className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="px-4 py-5 sm:p-6">{event.description}</div>
                </div>
              </Field>

              {/* Participants Section */}
              <Field>
                <Label>Participants</Label>
                <div className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="px-4 py-5 sm:p-6">
                    <ul className="list-disc list-inside">
                      {event.eventParticipants.map((participant, index) => (
                        <li key={index} className="py-1">
                          {participant.name +
                            "\t" +
                            "  [ " +
                            participant.email +
                            " ]"}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2 justify-end w-24">
                  <Label>Total:</Label>
                  <span className="inline-flex items-center w-12 text-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    {event.eventParticipants.length}
                  </span>
                </div>
              </Field>

              {/* Event Image */}
              <Field>
                <Label>Event Image</Label>
                <img
                  src={event.profileImagePath || ""}
                  alt="Event Image"
                  className="w-48 h-48 object-cover rounded-lg"
                />
              </Field>
            </FieldGroup>
          </Fieldset>
        </DialogBody>
        <DialogActions>
          <Button color="zinc" onClick={handleCancel}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventDetailsModal;
