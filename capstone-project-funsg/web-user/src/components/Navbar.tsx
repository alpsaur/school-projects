import '../css/Navbar.css';
import React, { useEffect, useState } from "react";
import axiosConfig from "../axiosConfig.tsx";
import Logo from '../assets/Logo.png';
import userPhoto from '../assets/userPhoto.png';
import { useNavigate } from "react-router-dom";
import { User as UserType } from "../model/User.ts";
import {EventDetail} from "../model/EventDetail.ts";
import {GroupDetail} from "../model/GroupDetail.ts";

interface WebSearchResultsResponse {
    eventList: EventDetail[];
    groupList: GroupDetail[];
}

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [user, setUser] = useState<UserType | null>(null);
    const [keywords, setKeywords] = useState<string>('');
    const navigate = useNavigate();

    const navigateToNewGroup = async () => {
        try {
            const response = await axiosConfig.get('/users/status');
            if (response.status === 200) {
                const user = { token: response.data.token };
                navigate('/newGroup', { state: { user } });
            } else {
                console.log('User not authenticated, redirecting to login');
                navigate('/login');
            }
        } catch (error) {
            console.error('Error fetching user status:', error);
            navigate('/login');
        }
    };

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axiosConfig.get('/users/status');
                const profile = await axiosConfig.get('/users/profile');
                if (response.status === 200) {
                    setIsLoggedIn(true);
                    setUserName(profile.data.name);
                    setUser(profile.data);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error checking login status:', error);
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();
    }, []);

    const handleProfileClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (isLoggedIn) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeywords(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axiosConfig.get<WebSearchResultsResponse>('/search', {
                params: {
                    query: keywords,
                    client: 'web'
                }
            });

            if (response.data) {

                    // Navigate to the search results page with query params
                    navigate('/search-results', { state: { results: response.data, query: keywords } });

                console.log('results',response.data)
            }else{
                navigate('/search-no-results', { state: { query: keywords } });
            }
        } catch (error) {
            console.error("Search request failed", error);
        }
    };

    return (
        <div className="NavBar">
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    {/*<a className="navbar-brand badge text-wrap custom-bg fs-4" href="/HomePage">Fun_SG</a>*/}
                    <a className="navbar-brand" href="/HomePage">
                        <img src={Logo} alt="Fun_SG" className="img-fluid" style={{ width: '100px', height: 'auto' }} />
                    </a>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <div className="d-flex mx-auto">
                            <form className="d-flex" role="search" onSubmit={handleSubmit}>
                                <input className="form-control me-2 search-input" value={keywords}
                                       onChange={handleSearchChange} type="search" placeholder="Search"
                                       aria-label="Search" />
                                <button className="btn searchBtn" type="submit">Search</button>
                            </form>
                        </div>
                        <div className="d-flex">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <button className="btn nav-link" onClick={navigateToNewGroup}>Sign Up New Group</button>
                                </li>
                                <li className="nav-item">
                                    {isLoggedIn ? (
                                        <span className="nav-link">Hi, {userName}</span>
                                    ) : (
                                        <a className="btn nav-link" href="/login">Login</a>
                                    )}
                                </li>
                                <li className="nav-item">
                                    <a href="#" onClick={handleProfileClick}>
                                        <img
                                            src={user?.profileImage ? user.profileImage : userPhoto}
                                            className="user-photo" alt="User Photo" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <hr className="hr-height" />
        </div>
    );
}

export default Navbar;
