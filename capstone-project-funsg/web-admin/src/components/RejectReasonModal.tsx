import { Group } from "../hooks/useGroups.ts";
import { useState } from "react";

import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "./catalystui/dialog.tsx";
import { Textarea } from "./catalystui/textarea.tsx";
import { Button } from "./catalystui/button.tsx";

interface RejectReasonModalProps {
  group: Group;
  onClose: () => void;
  onReject: (groupId: number, message: string) => void;
}

const RejectReasonModal = ({
  group,
  onClose,
  onReject,
}: RejectReasonModalProps) => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const handleCancel = () => {
    setIsOpen(false);
    onClose();
  };
  const handleReject = () => {
    if (message.trim()) {
      onReject(group.id, message);
      onClose();
    } else {
      alert("Please enter a reason for rejection");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>Name: {group.name}</DialogTitle>

        <DialogBody>
          <Textarea
            placeholder="Enter reason..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogBody>
        <DialogActions>
          <Button color="zinc" onClick={handleCancel}>
            Cancel
          </Button>
          <Button color="red" onClick={handleReject}>
            Reject/Deactivate
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RejectReasonModal;
