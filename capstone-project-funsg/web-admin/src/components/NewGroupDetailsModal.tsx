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
import { Textarea } from "./catalystui/textarea.tsx";
import { Group } from "../hooks/useGroups.ts";
import RejectReasonModal from "./RejectReasonModal.tsx";

interface NewGroupDetailModalProps {
  group: Group;
  onClose: () => void;
  handleApprove: (groupId: number) => void;
  handleReject: (groupId: number, message: string) => void;
}

const NewGroupDetailsModal = ({
  group,
  onClose,
  handleApprove,
  handleReject,
}: NewGroupDetailModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleCancel = () => {
    setIsOpen(false);
    onClose();
  };

  const handleApproveClick = () => {
    handleApprove(group.id);
    setIsOpen(false);
    onClose();
  };

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleCancel}>
        <DialogTitle>New Group Request </DialogTitle>
        <DialogBody>
          <Fieldset>
            <FieldGroup>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                <Field>
                  <Label>Id</Label>
                  <Input value={group.id} readOnly />
                </Field>
                <Field>
                  <Label>Group Name</Label>
                  <Input value={group.name} readOnly />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                <Field>
                  <Label>Host</Label>
                  <Input value={group.host} readOnly />
                </Field>
                <Field>
                  <Label>Category</Label>
                  <Input value={group.categoryName} readOnly />
                </Field>
              </div>
              <Field>
                <Label>Application Date</Label>
                <Input value={group.createdAt.substring(0, 10)} readOnly />
              </Field>
              <Field>
                <Label>Description</Label>
                <Textarea value={group.description || ""} readOnly />
              </Field>
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
            Cancel
          </Button>
          <Button color="green" onClick={handleApproveClick}>
            Approve
          </Button>
          <Button color="red" onClick={handleRejectClick}>
            Reject
          </Button>
        </DialogActions>
      </Dialog>
      {showRejectModal && (
        <RejectReasonModal
          group={group}
          onClose={handleRejectCancel}
          onReject={handleReject}
        />
      )}
    </>
  );
};

export default NewGroupDetailsModal;
