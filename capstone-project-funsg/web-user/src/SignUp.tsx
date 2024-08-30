import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/SignUp.css';
import Logo from './assets/Logo.png';
import userPhoto from './assets/userPhoto.png';
import axiosConfig from "./axiosConfig.tsx";
import authService from "./services/authService.tsx";

const SignUp: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const validateBasicInfo = (): boolean => {
        const newErrors = {
            name: '',
            email: '',
            password: '',
        };

        let isValid = true;

        if (name.trim() === '') {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (email.trim() === '' || !/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Valid email is required';
            isValid = false;
        }

        if (password.trim() === '' || password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const uploadDefaultImage = async () =>{
        try {
            const user = authService.getCurrentUser();
            const token = user.token;

            const response = await fetch(userPhoto);
            const blob = await response.blob();
            const file = new File([blob], 'defaultProfilePhoto.png', { type: blob.type });

            const formData = new FormData();
            formData.append('file', file);

            const Response = await axiosConfig.post(`/users/profileImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });
            if(Response.status===200){
                console.log('post success');
            }
        } catch (error) {
            console.error('Default image upload error', error);
        }
    };

    const handleSignUp = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!validateBasicInfo()) {
            return;
        }

        const registerUserRequest = {
            email,
            password,
            username: name,
        };

        try {
            const response = await axiosConfig.post('/auth/signup', registerUserRequest, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                await uploadDefaultImage();

                navigate(`/mbtiPrediction`);
            } else {
                console.error('Sign up failed');
            }
        } catch (error) {
            console.error('Sign up error', error);
        }
    };

    return (
        <div className="signup-container">
            <img src={Logo} alt="Logo" className="logo1"/>
            <div className="sign-divider"></div>
            <form onSubmit={handleSignUp} className="signup-form">
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <div className="error">{errors.name}</div>}
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <div className="error">{errors.email}</div>}
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <div className="error">{errors.password}</div>}
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default SignUp;
