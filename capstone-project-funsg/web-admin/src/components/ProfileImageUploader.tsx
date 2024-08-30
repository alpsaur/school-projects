import useProfile from "../hooks/useProfile.ts";
import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "./catalystui/dialog.tsx";
import { Button } from "./catalystui/button.tsx";
import { Input } from "./catalystui/input.tsx";
import { Field, Label } from "./catalystui/fieldset.tsx";

interface ProfileImageUploaderProps {
  onClose: () => void;
}

const ProfileImageUploader = ({ onClose }: ProfileImageUploaderProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const { data: profile, updateProfileImage } = useProfile();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);

      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      updateProfileImage.mutate(selectedFile);
    }
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>
        <div className="flex items-center space-x-4">
          <img
            src={profile?.profileImage}
            alt="User Profile"
            className="w-12 h-12 rounded-full"
          />
          <span>{profile?.name}</span>
        </div>
      </DialogTitle>
      <DialogBody>
        <div className="p-4">
          <Field>
            <Label>Your new profile avatar</Label>
            <Input type="file" name="file" onChange={handleFileChange} />
          </Field>

          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Selected Profile"
                className="rounded-full w-24 h-24 object-cover"
              />
            </div>
          )}
          <Button outline onClick={handleUpload} className="mt-4">
            Upload
          </Button>
        </div>
      </DialogBody>
      <DialogActions>
        <Button color="zinc" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileImageUploader;
