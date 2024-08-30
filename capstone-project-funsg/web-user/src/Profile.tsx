import Navbar from "./components/Navbar.tsx";
import axiosConfig from "./axiosConfig.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import { User as UserType} from "./model/User.ts";
import "./css/Profile.css"
import {EventItem} from "./model/EventItem.ts";
import EventList from "./components/EventList.tsx";
import NumberCard from "./components/NumberCard.tsx";
import {GroupDetail} from "./model/GroupDetail.ts";

function Profile() {
    const navigate = useNavigate();
    const [user,setUser]=useState<UserType | null>(null);
    const[eventList,setEventList]=useState<EventItem[]>([]);
    const[eventHostedList,setEventHostedList]=useState<EventItem[]>([]);
    const[groupList,setGroupList]=useState<EventItem[]>([]);
    const[groupHostedList,setGroupHostedList]=useState<EventItem[]>([]);
    const [visibleList, setVisibleList] = useState('');
    const [isHost,setIsHost]=useState(false)
    const [idList, setIdList]=useState<number[]>([]);
    const [groupTemp,setGroupTemp]=useState<GroupDetail[]>([]);

    const handleEventCancel = (eventId:number) => {
        setEventHostedList(prevList => prevList.filter(event => event.id !== eventId));
    };

    useEffect(() => {
        axiosConfig.get('/users/profile')
            .then(response => {
                console.log("users", response.data);
                setUser(response.data);
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
    }, []);

    const handleLogout = async () => {
        try {
            const response = await axiosConfig.post('/auth/logout');
            if (response.status === 200) {
                console.log('Logged out successfully');
                navigate('/');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    useEffect(() => {
        axiosConfig.get('users/events')
            .then(response => {
                const formattedData = response.data.map((event: any) => ({
                    name: event.name,
                    image: event.profileImagePath,
                    id:event.id,
                    type:"event",
                    content:event.start.substring(0,10)
                }));
                setEventList(formattedData);
                console.log(response.data)
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    }, []);


    useEffect(() => {
        if (user?.userId) { // Ensure userId is defined before making the request
            axiosConfig.get(`events/${user.userId}/hostEvents`)
                .then(response => {
                    const formattedData = response.data.map((event: any) => ({
                        name: event.name,
                        image: event.profileImagePath,
                        id: event.id,
                        type: "event",
                        content: event.start.substring(0, 10)
                    }));
                    setEventHostedList(formattedData);
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error fetching events:', error);
                });
        }
    }, [user?.userId]);

    useEffect(() => {
        axiosConfig.get('users/groups')
            .then(response => {
                const ids = response.data.map((group: any) => group.host.userId);
                console.log("idlist",idList)
                setIdList(ids);

                const formattedData = response.data.map((event: any) => ({
                    name: event.name,
                    image: event.profileImagePath,
                    id:event.id,
                    type:"group",
                    content:event.members.length
                }));
                setGroupList(formattedData);
                setGroupTemp(response.data)
                console.log("groupList",response.data)
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
            });
    }, []);

    useEffect(() => {
        if (user?.userId) {
            console.log("userId", user.userId);
            setIsHost(idList.includes(user.userId));
            console.log("isHost",isHost)
            console.log('idlist',idList)
            if(groupTemp){
                const filteredAndMappedEvents = groupTemp
                    .filter(group => group.host.userId === user?.userId)// Filter the events
                    .map(event => ({                    // Map the filtered events
                        name: event.name,
                        image: event.profileImagePath,
                        id:event.id,
                        type:"group",
                        content:event.members.length.toString()
                    }));

                setGroupHostedList(filteredAndMappedEvents)
            }


        } else {
            console.log("user is undefined or userId is not available yet");
        }
    }, [user, groupTemp, idList]);

    const handleListCanSee = (list: any[],listType:string) => {
        if(list.length === 0){
            if(listType==="eventList" || listType === "groupList"){
                navigate('/')
            }else if(listType === "eventHostedList"){
                alert("Go to your Group page to create event");
            }
        }
        else{
            setVisibleList(listType);
        }

    };

    const navigateToChangePhoto = () => {
        navigate('/changePhoto');
    };
    const renderContent = () => {
        switch (isHost){
            case false:
                return (
                    <>
                        <div className="number-card" onClick={() => handleListCanSee(groupList, 'groupList')}>
                            <NumberCard type="group" title="Join Groups" length={groupList.length} text="Congratulations! Hope you can join more groups to find more friends!"/>
                        </div>
                        <div className="number-card" onClick={() => handleListCanSee(eventList, 'eventList')}>
                            <NumberCard type="event" title="Join Events" length={eventList.length} text="Congratulations! Hope you can participate in more events!"/>
                        </div>
                    </>
                );
            case true:
                return (
                    <>
                        <div className="host-card-container">
                            <div className="host-number-card" onClick={() => handleListCanSee(groupList, 'groupList')}>
                                <NumberCard type="group" title="Join Groups" length={groupList.length} text="Congratulations! Participate join more groups to find more friends!"/>
                            </div>
                            <div className="host-number-card" onClick={() => handleListCanSee(groupList, 'groupHostedList')}>
                                <NumberCard type="groupHosted" title="Host Groups" length={groupHostedList.length} text='Click here! Better manage your group to attract more members!'/>
                            </div>
                        </div>
                        <div className="host-card-container">
                            <div className="host-number-card" onClick={() => handleListCanSee(eventList, 'eventList')}>
                                <NumberCard type="event" title="Join Events" length={eventList.length} text="Congratulations! Hope you can participate in more events!"/>
                            </div>
                            <div className="host-number-card" onClick={() => handleListCanSee(eventHostedList, 'eventHostedList')}>
                                <NumberCard type="eventHosted" title="Host Events" length={eventHostedList.length} text="Click Here! Quickly view and manage the events you've created!"/>
                            </div>
                        </div>

                    </>
                );
        }
    }


    return (
        <>
            <Navbar />
            <div className="profile-container">
                <div className="img-container">
                    <img src={user?.profileImage} className='user-Image' />
                </div>
                <h4 className={'fw-semibold'}>{user?.name}</h4>
                <h6>{user?.email}</h6>
                <h6>we meet at {user?.createdAt.substring(0, 10)}</h6>
                <hr/>
                <ul>
                    {/*<a className={"nav-link fw-semibold "}>Update Profile</a>*/}
                    <a className={"nav-link fw-semibold "} onClick={navigateToChangePhoto}>Change Photo</a>
                    <a className={"nav-link fw-semibold "} onClick={handleLogout}>Logout</a>
                </ul>
            </div>
            <div className='card-container'>
                <div>{renderContent()}</div>
                {visibleList === 'groupList' && (
                    <div className="ListContainer">
                        <EventList isHost={false} list={groupList}/>
                    </div>
                )}
                {visibleList === 'groupHostedList' && (
                    <div className="ListContainer">
                        <EventList isHost={true} list={groupHostedList}/>
                    </div>
                )}
                {visibleList === 'eventList' && (

                    <div className="ListContainer">
                        <EventList isHost={false} list={eventList}/>
                    </div>
                )}
                {visibleList === 'eventHostedList' && (

                    <div className="ListContainer">
                        <EventList isHost={true} list={eventHostedList} onEventCancel={handleEventCancel}/>
                    </div>
                )}


            </div>


        </>
    );
}

export default Profile;