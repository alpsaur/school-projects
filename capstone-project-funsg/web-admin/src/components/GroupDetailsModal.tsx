import { Group } from "../hooks/useGroups.ts";
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

interface GroupDetailsModalProps {
  group: Group;
  onClose: () => void;
}

const GroupDetailsModal = ({ group, onClose }: GroupDetailsModalProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleCancel = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleCancel} size="3xl">
        <DialogTitle>{group.name} </DialogTitle>
        <DialogBody>
          <Fieldset>
            <FieldGroup>
              {/* Group Basic Information */}
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                <Field>
                  <Label>Id</Label>
                  <Input value={group.id} readOnly />
                </Field>
                <Field>
                  <Label>Host</Label>
                  <Input value={group.host} readOnly />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                <Field>
                  <Label>Category</Label>
                  <Input value={group.categoryName} readOnly />
                </Field>
                <Field>
                  <Label>Created At</Label>
                  <Input value={group.createdAt.substring(0, 10)} readOnly />
                </Field>
              </div>

              {/* Description */}
              <Field>
                <Label>Description</Label>
                <div className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="px-4 py-5 sm:p-6">{group.description}</div>
                </div>
              </Field>

              {/* Events Section */}
              <Field>
                <Label>Events</Label>
                <div className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="px-4 py-5 sm:p-6">
                    <ul className="list-disc list-inside">
                      {group.events.map((event, index) => (
                        <li key={index} className="py-1">
                          {event.name +
                            "\t" +
                            "  [ " +
                            new Date(event.start).toLocaleDateString() +
                            "\t" +
                            new Date(event.start).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            }) +
                            " ]"}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center space-x-2 justify-end mt-2 w-24">
                  <Label>Total:</Label>
                  <span className="inline-flex items-center w-12 text-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    {group.numOfEvent}
                  </span>
                </div>
              </Field>

              {/* Members Section */}
              <Field>
                <Label>Members</Label>
                <div className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="px-4 py-5 sm:p-6">
                    <ul className="list-disc list-inside">
                      {group.members.map((participant, index) => (
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
                    {group.numOfMember}
                  </span>
                </div>
              </Field>

              {/* Group Image */}
              <Field>
                <Label>Group Image</Label>
                <img
                  src={group.profileImagePath || ""}
                  alt="Group Image"
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

export default GroupDetailsModal;
