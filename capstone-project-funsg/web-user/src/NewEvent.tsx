import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './css/NewGroup.css'; // Use NewGroup.css for consistent styling
import UploadEventPhoto from './UploadEventPhoto'; // Import the UploadEventPhoto component
import axiosConfig from "./axiosConfig.tsx";
import authService from "./services/authService.tsx";

const NewEvent: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [start, setStart] = useState<string>('');
    const [end, setEnd] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [maxParticipants, setMaxParticipants] = useState<number>(0);
    const [eventImageUrl, setEventImageUrl] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { groupId } = useParams<{ groupId: string }>();

    useEffect(() => {
        // Optional: Fetch data or perform actions on component mount
    }, []);

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

    const handleCreateEvent = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!eventImageUrl) {
            setError('Please upload an image.');
            return;
        }

        const eventRequest = {
            name,
            start,
            end,
            description,
            location,
            maxParticipants,
            eventImageUrl,
        };

        try {
            const user = authService.getCurrentUser();
            const token = user.token;
            const response = await axiosConfig.post(`/events/${groupId}/events`, eventRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });
            if (response.status === 201) {
                navigate(`/group/${groupId}`);
            } else {
                console.error('Event creation failed');
                setError('Event creation failed');
            }
        } catch (error) {
            console.error('Error creating event', error);
            setError('You are not Group host, error creating event');
        }
    };

    const handleUploadSuccess = (imageUrl: string) => {
        setEventImageUrl(imageUrl);
    };

    return (
        <div className="create-group-container">
            <h2>Create New Event</h2>
            <div className="edit-event-image">Choose Event Image</div>
            <UploadEventPhoto groupId={parseInt(groupId!)} onUploadSuccess={handleUploadSuccess}/>
            {error && <div className="error-message">{error}</div>}
            <br/>
            <form onSubmit={handleCreateEvent} className="create-group-form">
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
                    <label>Start Date & Time</label>
                    <input
                        type="datetime-local"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                    />
                    {errors?.start && <div className="error">{errors.start}</div>}
                </div>
                <div>
                    <label>End Date & Time</label>
                    <input
                        type="datetime-local"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                    />
                    {errors?.end && <div className="error">{errors.end}</div>}
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
                {error && <div className="error-message">{error}</div>}
                <button type="submit">
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default NewEvent;
