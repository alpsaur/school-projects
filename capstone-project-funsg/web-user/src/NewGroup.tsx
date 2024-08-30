import React, { useState, useEffect, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/NewGroup.css';
import UploadGroupPhoto from './UploadGroupPhoto';
import axiosConfig from "./axiosConfig.tsx";

const NewGroup: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [groupImageUrl, setGroupImageUrl] = useState<string>('');
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [errors, setErrors] = useState<{ name?: string; description?: string; category?: string; general?: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosConfig.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };

        fetchCategories();
    }, []);

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

        if (categoryId === null) {
            newErrors.category = 'Category is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleCreateGroup = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!groupImageUrl) {
            setError('Please upload a group image.');
            return;
        }

        console.log("Group Image URL:", groupImageUrl);
        const groupRequest = {
            categoryId,
            name,
            description,
            groupImageUrl: groupImageUrl || '',
        };

        console.log("Creating group with:", groupRequest);

        try {
            const response = await axiosConfig.post('/groups', groupRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                withCredentials: true,
            });
            if (response.status === 201) {
                alert('Successfully created group! Please wait for admin to approve.');
                navigate('/HomePage');
            } else {
                console.error('Group creation failed');
            }
        } catch (error) {
            console.error('Error creating group', error);
        }
    };

    return (
        <div className="create-group-container">
            <h2>Create New Group</h2>
            <div className="edit-event-image">Choose Group Image</div>
            <UploadGroupPhoto onUploadSuccess={setGroupImageUrl}/>
            {error && <div className="error-message">{error}</div>}
            <br/>
            <form onSubmit={handleCreateGroup} className="create-group-form">
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
                <div>
                    <label>Category</label>
                    <select
                        value={categoryId ?? ''}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors?.category && <div className="error">{errors.category}</div>}
                </div>
                <input type="hidden" name="groupImageUrl" value={groupImageUrl}/>
                {errors?.general && <div className="error">{errors.general}</div>}
                <button type="submit">
                    Create Group
                </button>
            </form>
        </div>
    );
};

export default NewGroup;
