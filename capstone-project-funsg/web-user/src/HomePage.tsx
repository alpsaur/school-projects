import Navbar from "./components/Navbar.tsx";
import CategoryList from "./components/CategoryList.tsx";
import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom'
import axiosConfig from "./axiosConfig.tsx";
import './css/DoTest.css'
import EventGrid from "./components/EventGrid.tsx";
import {EventDetail} from "./model/EventDetail.ts";
import {User} from "./model/User.ts";
import {GroupDetail} from "./model/GroupDetail.ts";
import GroupGrid from "./components/GroupGrid.tsx";

function HomePage(){

    const[groupGrid,setGroupGrid]=useState<GroupDetail[]>([]);
    const[eventGrid,setEventGrid]=useState<EventDetail[]>([]);
    const[eventURL,setEventURL]=useState(`/events`);
    const[groupURL,setGroupURL]=useState(`/groups`);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [groupTitle,setGroupTitle]=useState('Most Popular Groups');
    const [eventTitle,setEventTitle]=useState('Most Recent Events');

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                    const response = await axiosConfig.get(`/users/status`);

                if (response.status===200) {
                    setIsLoggedIn(true);
                    setUser(response.data.user);
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

    const handleSuggestion=(checked:boolean)=>{

        if(!isLoggedIn){
            navigate('/login');
        }else{
            if(checked){
                setEventURL(`/events/recommendations`);
                setGroupURL(`/groups/recommendations`);
                setEventTitle('Events May Interest You');
                setGroupTitle('Groups May Interest You');
            }else {

                setEventURL(`/events`);
                setGroupURL(`/groups`);
                setEventTitle('Most Recent Events')
                setGroupTitle('Most Popular Groups')
            }
            console.log("Event URL:", eventURL);
            console.log("Group URL:", groupURL);
            console.log("user:",user)
        }
    };

    useEffect(() => {
        axiosConfig.get(eventURL)
            .then(response => {
                const formattedData = response.data.map((event: any) => ({
                    name: event.name,
                    profileImagePath: event.profileImagePath,
                    id: event.id,
                    description: event.description,
                    start: event.start,
                    end: event.end,
                    location: event.location,
                    groupId: event.groupId,
                    groupName: event.groupName,
                    maxParticipants: event.maxParticipants,
                    status: event.status,
                    eventParticipants: event.eventParticipants || [], // Default to an empty array if undefined
                    createdBy: event.createdBy,
                    type: "event" // Assuming this is a constant or derived value
                }));
                setEventGrid(formattedData);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    }, [eventURL]);

    useEffect(() => {
        axiosConfig.get(groupURL)
            .then(response => {
                const formattedData = response.data.map((group: any) => ({
                    id: group.id,
                    name: group.name,
                    description: group.description,
                    categoryId: group.categoryId,
                    categoryName: group.categoryName,
                    status: group.status,
                    profileImagePath: group.profileImagePath || null, // Handles cases where image may be null
                    host: group.host as User,
                    members: group.members as User[],
                }));
                setGroupGrid(formattedData);
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
            });
    }, [groupURL]);

    const handleDoTestClick = () =>{
        if(!isLoggedIn){
            navigate('/login');
            console.log('Not login');
        }else {

                navigate('/mbtiPrediction');
        }

    }

    return(
        <>
            <Navbar />
            <CategoryList isShowSuggestion={true} onSuggestion={handleSuggestion}/>
            <EventGrid title={eventTitle} list={eventGrid}/>
            <div style={{marginBottom: '40px'}}></div>
            <GroupGrid title={groupTitle} list={groupGrid}/>
            <div className="text-dark py-2 mt-5 bg-body-tertiary">
                <div className="container d-flex justify-content-center align-items-center">
                    <strong className="me-2">Not finding what you’re looking for?</strong>
                    <span className="d-none d-md-inline">
        Share a bit about yourself, and we’ll tailor recommendations just for you.
      </span>
                    <button className="px-1 ms-2" onClick={handleDoTestClick}> Vibe check</button>
                </div>
            </div>
        </>
    );
}

export default HomePage;