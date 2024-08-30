// UploadGroupPhoto.tsx
import React, { ChangeEvent } from 'react';
import axiosConfig from "./axiosConfig.tsx";

interface UploadGroupPhotoProps {
    onUploadSuccess: (imageUrl: string) => void;
}

const UploadGroupPhoto: React.FC<UploadGroupPhotoProps> = ({ onUploadSuccess }) => {
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axiosConfig.post('/groups/groupImage', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                });
                const imageUrl = response.data;
                console.log(imageUrl);
                onUploadSuccess(imageUrl);  // Call onUploadSuccess with the image URL
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
        </div>
    );
};

export default UploadGroupPhoto;
