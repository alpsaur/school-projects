import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './css/NewGroup.css';
import authService from "./services/authService.tsx";
import axiosConfig from "./axiosConfig.tsx";

const PostMedia: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setSelectedFiles(Array.from(files));
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setUploadError('Please select at least one file to upload');
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            const user = authService.getCurrentUser();
            const token = user.token;

            const uploadPromises = selectedFiles.map(file => {
                const formData = new FormData();
                formData.append('file', file);

                return axiosConfig.post(`/events/${eventId}/media`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
            });

            const responses = await Promise.all(uploadPromises);

            const successfulUploads = responses
                .filter(response => response.status === 201)
                .map((_, index) => selectedFiles[index].name); // Get original file names

            setUploadedFiles(prev => [...prev, ...successfulUploads]); // Add new uploaded files to the list

            if (successfulUploads.length === 0) {
                setUploadError('Some files failed to upload');
            }

            setSelectedFiles([]); // Clear the selected files after upload
        } catch (error) {
            setUploadError('Failed to upload files');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate(`/event/${eventId}`);
    };

    return (
        <div className="create-group-container">
            <h2>Post event photos</h2>
            <input
                type="file"
                accept="image/*"
                id="fileInput"
                multiple
                onChange={handleFileChange}
            />
            <button onClick={handleUpload} disabled={isUploading || selectedFiles.length === 0}>
                {isUploading ? 'Uploading...' : 'Upload Selected Image'}
            </button>

            {/* Display uploaded file names */}
            {uploadedFiles.length > 0 && (
                <div>
                    <h3>Uploaded Images:</h3>
                    <ul>
                        {uploadedFiles.map((fileName, index) => (
                            <li key={index}>{fileName}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit} className="create-group-form">
                {uploadError && <div className="error-message">{uploadError}</div>}
                <button type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default PostMedia;
