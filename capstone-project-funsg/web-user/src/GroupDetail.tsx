import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import './css/Detail.css';
import { GroupDetail as GroupDetailType } from './model/GroupDetail.ts';
import { EventDetail as EventDetailType } from './model/EventDetail.ts';
import { CommentDetail as CommentType } from './model/Comment.ts';
import GroupDetailLeft from './components/GroupDetailLeft.tsx';
import GroupDetailRight from './components/GroupDetailRight.tsx';
import axiosConfig from './axiosConfig.tsx';
import {User} from "./model/User.ts";

// API Call: Join group
const JoinGroup = async (groupId: number) => {
    try {
        await axiosConfig.post(`/groups/${groupId}/join`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${document.cookie.split('jwt=')[1]}`,
            },
        });
    } catch (error) {
        throw new Error('Failed to join this group');
    }
};

// API Call: Leave group
const UnJoinGroup = async (groupId: number) => {
    try {
        await axiosConfig.delete(`/groups/${groupId}/exit`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${document.cookie.split('jwt=')[1]}`
            },
        });
    } catch (error) {
        throw new Error('Failed to exit this group');
    }
};

// API Call: Get list of groups user has joined
const getUserJoinedGroups = async (): Promise<number[]> => {
    try {
        const response = await axiosConfig.get('/users/groups', {
            headers: {
                'Authorization': `Bearer ${document.cookie.split('jwt=')[1]}`
            }
        });
        return response.data.map((group: { id: number }) => group.id);
    } catch (error) {
        console.error('Failed to retrieve user joined groups:', error);
        return [];
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

function GroupDetail() {
    const { groupId } = useParams<{ groupId: string }>();
    const [group, setGroup] = useState<GroupDetailType | null>(null);
    const [eventList, setEventList] = useState<EventDetailType[]>([]);
    const [isMember, setIsMember] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const navigate = useNavigate();
    const [commentList,setCommentList]=useState<CommentType[]>([])
    const [photoList,setPhotoList]=useState<string[]>([])

    useEffect(() => {
        const loadGroupDetails = async () => {
            try {
                const [groupResponse, userJoinedGroups,userResponse ] = await Promise.all([
                    axiosConfig.get(`/groups/${groupId}`),
                    getUserJoinedGroups(),
                    getUserDetails()
                ]);

                setGroup(groupResponse.data);
                setIsMember(userJoinedGroups.includes(Number(groupId)));

                if (userResponse && groupResponse.data.host.userId === userResponse.userId) {
                    setIsHost(true);
                }
            } catch (error) {
                console.error('Error fetching group details or user membership:', error);
            }
        };

        loadGroupDetails();
    }, [groupId]);

    useEffect(() => {
        axiosConfig.get(`/events/${groupId}/events`)
            .then(response => {
                setEventList(response.data);
            })
            .catch(error => {
                console.error('Error fetching event details:', error);
            });
    }, [groupId]);

    useEffect(() => {
        axiosConfig.get(`/comments/group/${groupId}`)
            .then(response => {
                const formattedData = response.data.map((comment: any) => ({
                    content:comment.content,
                    postAt:comment.postedAt,
                    user:comment.user as User

                }))
                setCommentList(formattedData);
                console.log("comments",response.data)
                console.log("Is Array:", Array.isArray(response.data));
            })
            .catch(error => {
                console.error('Error fetching event comment:', error);
            });
    }, [groupId]);

    useEffect(() => {
        axiosConfig.get(`/events/${groupId}/events/Image`)
            .then(response => {
                setPhotoList(response.data)
                console.log("Images",response.data)
            })
            .catch(error => {
                console.error('Error fetching event Img:', error);
            });
    }, [groupId]);

    const handleSignUpClick = () => {
        navigate(`/newEvent/${groupId}`);
    };

    const handleJoinClick = async () => {
        const isConfirmed = window.confirm("Are you sure you want to join this group?");
        if (isConfirmed) {
            try {
                await JoinGroup(Number(groupId));
                alert('Successfully joined this group');
                const updatedGroupDetails = await axiosConfig.get(`/groups/${groupId}`);
                setGroup(updatedGroupDetails.data);
                setIsMember(true);

                navigate(`/group/${groupId}`)
            } catch (error) {
                alert('Failed to join this group');
                console.error(error);
            }
        }
    };

    const handleUnJoinClick = async () => {
        const isConfirmed = window.confirm("Are you sure you want to exit this group?");
        if (isConfirmed) {
            try {
                await UnJoinGroup(Number(groupId));
                alert('Successfully exited this group');
                const updatedGroupDetails = await axiosConfig.get(`/groups/${groupId}`);
                setGroup(updatedGroupDetails.data);
                setIsMember(false);
            } catch (error) {
                alert('Failed to exit this group');
                console.error(error);
            }
        }
    };

    if (!group) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar/>
            <div className="detail-container">
                <div className="detail-left">
                    <GroupDetailLeft group={group} eventList={eventList} commentLis={commentList} photoList={photoList}/>
                </div>
                <div className='detail-right'>
                    <GroupDetailRight group={group} noEvents={eventList.length}/>
                </div>
            </div>

            {!isHost && (
                <button className="join-button" onClick={isMember ? handleUnJoinClick : handleJoinClick}>
                    {isMember ? 'Unjoin' : 'Join'}
                </button>
            )}

            {isHost && (
                <button className="sign-up-button" onClick={handleSignUpClick}>
                    Create New Event
                </button>
            )}
        </>
    );
}

export default GroupDetail;
