// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import HomePage from './HomePage';
import SignUp from "./SignUp";
import Profile from "./Profile.tsx";
import NewGroup from './NewGroup.tsx';
import NewEvent from "./NewEvent.tsx";
import './services/axiosInterceptor';
import EventDetail from "./EventDetail.tsx";
import GroupDetail from "./GroupDetail.tsx";
import MbtiPrediction from "./MbtiPrediction.tsx";
import CategoryPage from "./CategoryPage.tsx";
import AllEventsPage from "./AllEventsPage.tsx";
import AllGroupsPage from "./AllGroupsPage.tsx";
import GroupEdit from "./GoupEdit.tsx";
import PostMedia from "./PostMedia.tsx";
import ModifyProfile from "./ModifyProfile.tsx";
import ChangePhoto from "./ChangePhoto.tsx";
import SearchResult from "./SearchResult.tsx";
import EventEdit from "./EventEdit.tsx";
import Search_no_result from "./Search_no_result.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/HomePage" element={<HomePage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/newGroup" element={<NewGroup/>} />
                <Route path="/newEvent/:groupId" element={<NewEvent/>} />
                <Route path="/mbtiPrediction" element={<MbtiPrediction/>} />
                <Route path="/events" element={<AllEventsPage />} />
                <Route path="/event/:eventId" element={<EventDetail />} />
                <Route path="/groups" element={<AllGroupsPage />} />
                <Route path="/group/:groupId" element={<GroupDetail />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/editGroup/:groupId" element={<GroupEdit/>} />
                <Route path="/editEvent/:eventId" element={<EventEdit/>} />
                <Route path="/postMedia/:eventId" element={<PostMedia/>} />
                <Route path="/search-results" element={<SearchResult />} />
                <Route path="/search-no-results" element={<Search_no_result />} />
                <Route path="/modifyProfile" element={<ModifyProfile/>} />
                <Route path="/changePhoto" element={<ChangePhoto/>} />
            </Routes>
        </Router>
    );
};

export default App;
