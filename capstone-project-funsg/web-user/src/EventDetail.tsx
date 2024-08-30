import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "./components/Navbar.tsx";
import DetailLeft from "./components/DetailLeft.tsx";
import DetailRight from "./components/DetailRight.tsx";
import { EventDetailWithPhoto as EventDetailType } from './model/EventDetail.ts';
import axiosConfig from "./axiosConfig.tsx";
import "./css/Detail.css";

const registerForEvent = async (eventId: number) => {
    try {
        const response = await axiosConfig.post(
            `/events/${eventId}/register`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.split('jwt=')[1]}`
                },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error('Failed to register for the event');
    }
};

const getUserDetails = async () => {
    try {
        const response = await axiosConfig.get('/users/profile', {
            headers: {
                'Authorization': `Bearer ${document.cookie.split('jwt=')[1]}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to retrieve user details:', error);
        return null;
    }
};

function EventDetail() {
    const { eventId } = useParams<{ eventId: string }>();
    const [event, setEvent] = useState<EventDetailType | null>(null);
    const [isHost, setIsHost] = useState(false);
    const navigate = useNavigate();
    const [eventDetails, setEventDetails] = useState<any>(null);
    const [groupImg, setGroupImg] = useState("");
    const [photoList,setPhotoList]=useState<string[]>([])

    useEffect(() => {
        const loadEventDetails = async () => {
            try {
                const [eventResponse, userResponse] = await Promise.all([
                    axiosConfig.get(`/events/${eventId}`),
                    getUserDetails()
                ]);

                console.log("events",eventResponse.data)
                setEvent(eventResponse.data);
                setEventDetails(eventResponse.data);

                if(eventResponse.data.eventArtifactFilePaths){
                    setPhotoList(eventResponse.data.eventArtifactFilePaths)
                }else{
                    setPhotoList([])
                }

                if (userResponse && eventResponse.data.createdBy.userId === userResponse.userId) {
                    setIsHost(true);
                }
            } catch (error) {
                console.error('Error fetching event details or user details:', error);
            }
        };

        loadEventDetails();
    }, [eventId]);

    useEffect(() => {
        axiosConfig.get(`/groups/${event?.groupId}`)
            .then(response => {
                console.log("profileImg:",response.data.profileImagePath)
                setGroupImg(response.data.profileImagePath);
            })
            .catch(error => {
                console.error('Error fetching event details:', error);
            });
    }, [event?.groupId]);

    if (!event) {
        return <div>Loading...</div>;
    }

    const handleAttendClick = async () => {
        const isConfirmed = window.confirm("Are you sure you want to attend this event?");
        if (isConfirmed) {
            try {
                await registerForEvent(Number(eventId));
                alert('Successfully registered for the event');

                const updatedEventDetails = await axiosConfig.get(`/events/${eventId}`);
                setEvent(updatedEventDetails.data);
                setEventDetails(updatedEventDetails.data);

                navigate(`/event/${eventId}`); // Redirect to a specific page
            } catch (error) {
                alert('Failed to register for the event. Please log in and try again.');
                console.error(error);
            }
        }
        // If canceled, do nothing and stay on the current page
    };

    const handlePostMediaClick = () => {
        navigate(`/postMedia/${eventId}`); // Redirect to PostMedia page with eventId
    };

    return(
        <>
            <Navbar/>
            <div className="EventDetail">
                <p className="fw-semibold  Event-title">{event.name}</p>
                <div className="title-container">
                    <img src={event.createdBy.profileImage} className="Host-photo" alt="User Photo"/>
                    <div className="text-container host-Text">
                        <p className="fs-4">Hosted By</p>
                        <p className="fw-bold fs-4">{event.createdBy.name}</p>
                    </div>

                </div>
                <div className="detail-container">
                    <div className="Event-Detail-Left">
                        <DetailLeft event={event} photoList={photoList}/>
                    </div>
                    <div className='detail-right'>
                        <DetailRight event={event} groupImg={groupImg} participants={eventDetails.eventParticipants.length} maxParticipant={event.maxParticipants}/>
                    </div>

                </div>
                {isHost && (
                    <button
                        className="post-media-button"
                        onClick={handlePostMediaClick}
                    >
                        Post Media
                    </button>
                )}
                <button
                    className="attend-button"
                    onClick={handleAttendClick}
                >
                    Attend
                </button>

            </div>

        </>
    );
}

export default EventDetail;
