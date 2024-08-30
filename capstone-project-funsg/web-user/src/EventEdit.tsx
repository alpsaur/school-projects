import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosConfig from './axiosConfig.tsx';
import authService from './services/authService.tsx';
import './css/EventEdit.css';
import UploadEventPhoto from './UploadEventPhoto.tsx';

const EditEvent: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [start, setStart] = useState<string>('');
    const [end, setEnd] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [maxParticipants, setMaxParticipants] = useState<number>(0);
    const [profileImagePath, setProfileImagePath] = useState<string>(''); // For storing current event image URL
    const [newImageUrl, setNewImageUrl] = useState<string>(''); // For storing newly uploaded image URL
    const [errors, setErrors] = useState<{ [key: string]: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axiosConfig.get(`/events/${eventId}`);
                const event = response.data;
                setName(event.name);
                setDescription(event.description);
                setStart(event.start);
                setEnd(event.end);
                setLocation(event.location);
                setMaxParticipants(event.maxParticipants);
                setProfileImagePath(event.profileImagePath || ''); // Initialize with the current event image URL
            } catch (error) {
                console.error('Error fetching event details', error);
                setError('Failed to fetch event details');
            }
        };

        fetchEventDetails();
    }, [eventId]);

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        let isValid = true;

        const now = new Date().toISOString();

        if (!name.trim()) {
            newErrors.name = 'Event name is required';
            isValid = false;
        }

        if (!start.trim() || start < now) {
            newErrors.start = 'Start date and time are required and must be in the future';
            isValid = false;
        }

        if (!end.trim() || end < start) {
            newErrors.end = 'End date and time are required and must be after the start date';
            isValid = false;
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
            isValid = false;
        }

        if (!location.trim()) {
            newErrors.location = 'Location is required';
            isValid = false;
        }

        if (maxParticipants <= 0) {
            newErrors.maxParticipants = 'Max participants must be greater than 0';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleUpdateEvent = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!newImageUrl && !profileImagePath) {
            setImageError('Please upload an image.');
            return;
        }

        const eventRequest = {
            name,
            start,
            end,
            description,
            location,
            maxParticipants,
            eventImageUrl: newImageUrl || profileImagePath, // Use new image URL if available, otherwise use original URL
        };

        try {
            const user = authService.getCurrentUser();
            const token = user.token;
            const response = await axiosConfig.put(`/events/${eventId}`, eventRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });
            if (response.status === 200) {
                navigate(`/event/${eventId}`);
            } else {
                console.error('Event update failed');
                setError('Event update failed');
            }
        } catch (error) {
            console.error('Error updating event', error);
            setError('Error updating event');
        }
    };

    const handleUploadSuccess = (imageUrl: string) => {
        setNewImageUrl(imageUrl);
        setImageError(null);
    };

    return (
        <div className="edit-event-container">
            <h2>Edit Event</h2>
            <div className="edit-event-image">Choose Image again</div>
            <UploadEventPhoto groupId={parseInt(eventId!)} onUploadSuccess={handleUploadSuccess} />
            {imageError && <div className="error-message">{imageError}</div>}
            <form onSubmit={handleUpdateEvent} className="edit-event-form">
                <div>
                    <label>Event Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors?.name && <div className="error">{errors.name}</div>}
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors?.description && <div className="error">{errors.description}</div>}
                </div>
                <div>
                    <label>Start</label>
                    <input
                        type="datetime-local"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                    />
                    {errors?.start && <div className="error">{errors.start}</div>}
                </div>
                <div>
                    <label>End</label>
                    <input
                        type="datetime-local"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                    />
                    {errors?.end && <div className="error">{errors.end}</div>}
                </div>
                <div>
                    <label>Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    {errors?.location && <div className="error">{errors.location}</div>}
                </div>
                <div>
                    <label>Max Participants</label>
                    <input
                        type="number"
                        value={maxParticipants}
                        onChange={(e) => setMaxParticipants(Number(e.target.value))}
                    />
                    {errors?.maxParticipants && <div className="error">{errors.maxParticipants}</div>}
                </div>
                {profileImagePath && (
                    <input
                        type="hidden"
                        name="currentImageUrl"
                        value={profileImagePath}
                    />
                )}
                {error && <div className="error-message">{error}</div>}
                <button type="submit">
                    Update Event
                </button>
            </form>
        </div>
    );
};

export default EditEvent;
