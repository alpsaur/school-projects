import React, { ChangeEvent, useState } from 'react';
import axiosConfig from "./axiosConfig.tsx";

interface UploadEventPhotoProps {
    groupId: number;
    onUploadSuccess: (imageUrl: string) => void;
}

const UploadEventPhoto: React.FC<UploadEventPhotoProps> = ({ groupId, onUploadSuccess }) => {
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            setIsUploading(true);
            setUploadError(null);

            try {
                const response = await axiosConfig.post(`/events/${groupId}/eventImage`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                });
                const imageUrl = response.data;
                onUploadSuccess(imageUrl);  // Call onUploadSuccess with the image URL
                setIsUploading(false);
            } catch (error) {
                setUploadError('Failed to upload image');
                setIsUploading(false);
            }
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={() => handleFileChange} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload Image'}
            </button>
            {uploadError && <p>{uploadError}</p>}
        </div>
    );
};

export default UploadEventPhoto;
