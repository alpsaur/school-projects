import React, {useState, FormEvent, ChangeEvent} from 'react';
import './css/Login.css';
import {useNavigate} from 'react-router-dom';
import Logo from './assets/Logo.png';
import authService from './services/authService'; // Import authService

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError(null); // Reset error before making the request
        try {
            const response = await authService.login(email, password);
            if (response.status === 200) {
                console.log('Login successful');
                navigate('/HomePage');
            } else {
                setError('Login failed: Invalid email or password.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Login failed: Invalid email or password. Please check your email and password.');
        }

    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setPassword(e.target.value);
    };

    const handleSignUpClick = (): void => {
        navigate('/signup');
    };

    return (
        <div className="login-container">
            <img src={Logo} alt="Logo" className="logo"/>
            <form onSubmit={handleSubmit} className="login-form">
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit">Login</button>
                <div className="divider"></div>
                <div className="new-user">
                    <span>New User </span>
                    <button className="signup-button" onClick={handleSignUpClick}>Sign up</button>
                </div>
            </form>
        </div>
    );
};

export default Login;
