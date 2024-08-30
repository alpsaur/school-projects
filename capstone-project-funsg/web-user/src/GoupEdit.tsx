import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosConfig from './axiosConfig.tsx';
import './css/GroupEdit.css';

const GroupEdit: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [errors, setErrors] = useState<{ name?: string; description?: string; category?: string; general?: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchGroupDetails = async () => {
            try {
                const response = await axiosConfig.get(`/groups/${groupId}`);
                const group = response.data;
                setName(group.name);
                setDescription(group.description);
            } catch (error) {
                console.error('Error fetching group details', error);
            }
        };

        fetchGroupDetails();
    }, [groupId]);

    const validateForm = (): boolean => {
        const newErrors: { name?: string; description?: string; category?: string } = {};
        let isValid = true;

        if (!name.trim()) {
            newErrors.name = 'Group name is required';
            isValid = false;
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleUpdateGroup = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const groupRequest = {
            name,
            description,
        };

        try {
            const response = await axiosConfig.put(`/groups/${groupId}`, groupRequest, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                navigate(`/group/${groupId}`);
            } else {
                console.error('Group update failed');
            }
        } catch (error) {
            console.error('Error updating group', error);
        }
    };

    return (
        <div className="edit-group-container">
            <h2>Edit Group</h2>
            <form onSubmit={handleUpdateGroup} className="edit-group-form">
                <div>
                    <label>Group Name</label>
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
                {errors?.general && <div className="error">{errors.general}</div>}
                <button type="submit">
                    Update Group
                </button>
            </form>
        </div>
    );
};

export default GroupEdit;
