import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosConfig from './axiosConfig.tsx';
import './css/ModifyProfile.css';

const ModifyProfile: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        axiosConfig.get('/users/profile')
            .then(response => {
                setName(response.data.name);
                setEmail(response.data.email);
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
                setError('Failed to load profile');
            });
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axiosConfig.put('/users/profile', { name, email, password });
            if (response.status === 200) {
                console.log('Profile updated successfully');
                navigate('/profile');
            } else {
                setError('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('An error occurred while updating the profile');
        }
    };

    return (
        <div className="modify-profile-container">
            <h2 className="title">Modify Profile</h2>
            <form onSubmit={handleSave} className="modify-profile-form">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="save-button">Save Changes</button>
                <button type="button" className="cancel-button" onClick={() => navigate('/profile')}>Cancel</button>
            </form>
        </div>
    );
};

export default ModifyProfile;
