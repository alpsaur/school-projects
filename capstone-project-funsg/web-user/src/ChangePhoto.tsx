import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from "./services/authService.tsx";
import axiosConfig from "./axiosConfig.tsx";
import './css/ChangePhoto.css';

const ChangePhoto: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadMessage, setUploadMessage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadMessage('Please select a file to upload.');
            return;
        }

        setIsUploading(true);
        setUploadMessage(null);

        try {
            const user = authService.getCurrentUser();
            const token = user.token;

            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await axiosConfig.post(`/users/profileImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                setUploadMessage('Profile photo uploaded successfully.');
            } else {
                setUploadMessage('Failed to upload the profile photo.');
            }
        } catch (error) {
            setUploadMessage('An error occurred while uploading the photo.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleBack = () => {
        navigate('/profile');
    };

    return (
        <div className="change-photo-container">
            <br/>
            <h2>Change Profile Photo</h2>
            <br/>
            <input
                type="file"
                accept="image/*"
                id="fileInput"
                onChange={handleFileChange}
            />

            {/* Preview selected image */}
            {previewUrl && (
                <img src={previewUrl} alt="Selected Preview" />
            )}

            <br/>
            <div className="button-container">
                <button onClick={handleUpload} disabled={isUploading || !selectedFile}>
                    {isUploading ? 'Uploading...' : 'Upload Selected Photo'}
                </button>
                <button onClick={handleBack}>
                    Back
                </button>
            </div>
            <br/>

            {/* Display upload message */}
            {uploadMessage && (
                <div className="upload-message">
                    {uploadMessage}
                </div>
            )}
            <br/>
        </div>
    );
};

export default ChangePhoto;
