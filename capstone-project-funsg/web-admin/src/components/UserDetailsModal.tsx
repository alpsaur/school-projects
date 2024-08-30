import { User } from "../hooks/useUsers.ts";
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

interface UserDetailsModalProps {
  user: User;
  onClose: () => void;
}

const UserDetailsModal = ({ user, onClose }: UserDetailsModalProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} size="3xl">
        <DialogTitle>
          <div className="flex items-center space-x-4">
            <img
              src={user.profileImage}
              alt="User Profile"
              className="w-12 h-12 rounded-full"
            />
            <span>{user.name}</span>
          </div>
        </DialogTitle>
        <DialogBody>
          <Fieldset>
            <FieldGroup>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                <Field>
                  <Label>Id</Label>
                  <Input value={user.userId} readOnly />
                </Field>
                <Field>
                  <Label>Email</Label>
                  <Input value={user.email} readOnly />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                <Field>
                  <Label>Created At</Label>
                  <Input value={user.createdAt.substring(0, 10)} readOnly />
                </Field>
                <Field>
                  <Field>
                    {user.status === undefined ? (
                      <>
                        <Label>Role</Label>
                        <Input value="Admin" readOnly />
                      </>
                    ) : (
                      <>
                        <Label>Status</Label>
                        <Input value={user.status} readOnly />
                      </>
                    )}
                  </Field>
                </Field>
              </div>

              {user.status !== "admin" && (
                <>
                  {/* Tendencies Section */}
                  {user.ie_Tendancy !== undefined &&
                    user.ns_Tendancy !== undefined &&
                    user.tf_Tendancy !== undefined &&
                    user.jp_Tendancy !== undefined && (
                      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                        <Field>
                          <Label>IE-Tendency</Label>
                          <Input value={user.ie_Tendancy} readOnly />
                        </Field>
                        <Field>
                          <Label>NS-Tendency</Label>
                          <Input value={user.ns_Tendancy} readOnly />
                        </Field>
                        <Field>
                          <Label>TF-Tendency</Label>
                          <Input value={user.tf_Tendancy} readOnly />
                        </Field>
                        <Field>
                          <Label>JP-Tendency</Label>
                          <Input value={user.jp_Tendancy} readOnly />
                        </Field>
                      </div>
                    )}

                  {/* Events Section */}
                  {Array.isArray(user.events) && (
                    <Field>
                      <Label>Events Details</Label>
                      <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="px-4 py-5 sm:p-6">
                          <ul className="list-disc list-inside">
                            {user.events.map((event, index) => (
                              <li key={index} className="py-1">
                                {event}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 justify-end mt-2 w-24">
                        <Label>Total:</Label>
                        <span className="inline-flex items-center w-12 text-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                          {user.events.length}
                        </span>
                      </div>
                    </Field>
                  )}

                  {/* Group Section */}
                  {Array.isArray(user.groups) &&
                    Array.isArray(user.hostedGroups) && (
                      <Field>
                        <Label>Groups Details</Label>
                        <div className="flex flex-col mt-2 sm:flex-row gap-4">
                          {/* Owned Groups */}
                          <div className="flex-1 flex flex-col">
                            <Label>Owned Groups</Label>
                            <div className="flex-1 overflow-hidden rounded-lg bg-white shadow">
                              <div className="px-4 py-5 sm:p-6">
                                <ul className="list-disc list-inside">
                                  {user.hostedGroups.map((group, index) => (
                                    <li key={index} className="py-1">
                                      {group}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-2 justify-end">
                              <Label>Total:</Label>
                              <span className="inline-flex items-center w-12 text-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                {user.hostedGroups.length}
                              </span>
                            </div>
                          </div>

                          {/* Joined Groups */}
                          <div className="flex-1 flex flex-col">
                            <Label>Joined Groups</Label>
                            <div className="flex-1 overflow-hidden rounded-lg bg-white shadow">
                              <div className="px-4 py-5 sm:p-6">
                                <ul className="list-disc list-inside">
                                  {user.groups.map((group, index) => (
                                    <li key={index} className="py-1">
                                      {group}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-2 justify-end">
                              <Label>Total:</Label>

                              <span className="inline-flex items-center w-12 text-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                {user.groups.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Field>
                    )}
                </>
              )}
            </FieldGroup>
          </Fieldset>
        </DialogBody>
        <DialogActions>
          <Button color="zinc" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserDetailsModal;
