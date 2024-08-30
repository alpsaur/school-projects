import Navbar from "./components/Navbar.tsx";
import CategoryList from "./components/CategoryList.tsx";
import { useParams } from 'react-router-dom';
import {useEffect, useState} from "react";
import axiosConfig from "./axiosConfig.tsx";
import './css/SearchPage.css'
import {EventDetail} from "./model/EventDetail.ts";
import {GroupDetailWithEvents} from "./model/GroupDetail.ts";
import EventHorizontalCard from "./components/EventHorizontalCard.tsx";
import EventsOrGroups from "./components/EventsOrGroups.tsx";
import GroupHorizontalCard from "./components/GroupHorizontalCard.tsx";
import SortButton from "./components/SortButton.tsx";

function CategoryPage(){
    const { categoryId } = useParams<{ categoryId: string }>();
    const [eventGrid, setEventGrid] = useState<EventDetail[]>([]);
    const [groupGrid, setGroupGrid] = useState<GroupDetailWithEvents[]>([]);
    const [visibleList,setVisibleList] = useState('eventGrid')
    const [filteredEventList, setFilteredEventList] = useState(eventGrid);
    const [filteredGroupList, setFilteredGroupList] = useState(groupGrid);

    useEffect(() => {
        axiosConfig.get(`/categories/${categoryId}/events`)
            .then(response => {
                setEventGrid(response.data);
                setFilteredEventList(response.data);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
        console.log("events:",eventGrid);

    }, [categoryId]);

    useEffect(() => {
        axiosConfig.get(`/categories/${categoryId}/groups`)
            .then(response => {
                setGroupGrid(response.data);
                setFilteredGroupList(response.data);
                console.log("groups:",response.data)
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });

    }, [categoryId]);

    const handleEventOrGroup=(checked:boolean)=>{
        //true is events, false is groups

        if(checked){
            setVisibleList("eventGrid")
        }else {
            setVisibleList('groupGrid')
        }
        console.log("visibleList:", visibleList);
    };

    const getStartOfWeek = (date: Date) => {
        const startOfWeek = new Date(date);
        const dayOfWeek = date.getDay();
        const distanceFromMonday = (dayOfWeek + 6) % 7; // Adjust for Monday as start of week
        startOfWeek.setDate(date.getDate() - distanceFromMonday);
        startOfWeek.setHours(0, 0, 0, 0); // Set time to midnight
        return startOfWeek;
    };

    const getEndOfWeek = (date: Date) => {
        const endOfWeek = new Date(date);
        const dayOfWeek = date.getDay();
        const distanceToSunday = 6 - dayOfWeek; // Adjust for Sunday as end of week
        endOfWeek.setDate(date.getDate() + distanceToSunday);
        endOfWeek.setHours(23, 59, 59, 999); // Set time to just before midnight
        return endOfWeek;
    };

    const handleFilterEventSelect=(selected: string, filterType: string)=>{
        let filtered = [...eventGrid];

        if (filterType === 'Max Participants') {
            if (selected === '1-10') {
                filtered = eventGrid.filter(event => event.maxParticipants >= 1 && event.maxParticipants <= 10);
            } else if (selected === '10-20') {
                filtered = eventGrid.filter(event => event.maxParticipants > 10 && event.maxParticipants <= 20);
            } else if (selected === 'more than 20') {
                filtered = eventGrid.filter(event => event.maxParticipants > 20);
            }
        } else if (filterType === 'Date') {
            const today = new Date();


            const startOfWeek = getStartOfWeek(today);
            const endOfWeek = getEndOfWeek(today);

            const startOfNextWeek = new Date(startOfWeek);
            startOfNextWeek.setDate(startOfWeek.getDate() + 7);

            const endOfNextWeek = new Date(endOfWeek);
            endOfNextWeek.setDate(endOfWeek.getDate() + 7);

            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

            if(selected === 'next week'){
                filtered = eventGrid.filter(event => {
                    const eventStartDate = new Date(event.start);
                    const startOfEvent = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate()); // Set time to 00:00:00

                    return startOfEvent.getTime() >= startOfNextWeek.getTime() && startOfEvent.getTime() <= endOfNextWeek.getTime();

                });
            }else if(selected === 'this month'){
                filtered = eventGrid.filter(event => {
                    const eventStartDate = new Date(event.start);
                    const startOfEvent = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate()); // Set time to 00:00:00

                    return startOfEvent.getTime() >= startOfMonth.getTime() && startOfEvent.getTime() <= endOfMonth.getTime();

                });
            }else if(selected === 'this week'){
                filtered = eventGrid.filter(event => {
                    const eventStartDate = new Date(event.start);
                    const startOfEvent = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate()); // Set time to 00:00:00
                    return startOfEvent.getTime() >= startOfWeek.getTime() && startOfEvent.getTime() <= endOfWeek.getTime();
                });
            }
        }

        setFilteredEventList(filtered);
    }

    const handleFilterGroupSelect = (selected: string, filterType: string) => {
        let filtered = [...groupGrid];

        if (filterType === 'No. Members') {
            if (selected === '1-5') {
                filtered = groupGrid.filter(group => group.members.length >= 1 && group.members.length <= 5);
            } else if (selected === '5-10') {
                filtered = groupGrid.filter(group => group.members.length > 5 && group.members.length <= 10);
            } else if (selected === 'more than 10') {
                filtered = groupGrid.filter(group => group.members.length > 10);
            }
        } else if (filterType === 'No. Events') {
            if (selected === '1-5') {
                filtered = groupGrid.filter(group => group.numberOfEvents >= 1 && group.numberOfEvents <= 5);
            } else if (selected === '5-10') {
                filtered = groupGrid.filter(group => group.numberOfEvents > 5 && group.numberOfEvents <= 10);
            } else if (selected === 'more than 10') {
                filtered = groupGrid.filter(group => group.numberOfEvents > 10);
            }
        }
        console.log("filtered",filtered)

        setFilteredGroupList(filtered);
    };

    return(
        <>
            <Navbar/>
            <CategoryList isShowSuggestion={false}/>
            <div className="all-events-container">
                {
                    visibleList === "eventGrid"? (<h3 className="mt-4 title">Upcoming Events</h3>): (
                        <h3 className="mt-4 title">Popular Groups</h3>)
                }

                <EventsOrGroups onEvent={handleEventOrGroup}/>
                <div className="nav-container">
                    {
                        visibleList === 'eventGrid' && (
                            <>
                                <SortButton onFilterSelect={(selected)=> handleFilterEventSelect(selected, 'Max Participants')} title='Max Participants' content={['1-10','10-20','more than 20','all']}/>
                                <SortButton onFilterSelect={(selected)=> handleFilterEventSelect(selected, 'Date')} title='Date' content={['all','this week','next week','this month']}/>
                            </>
                        )
                    }
                    {
                        visibleList === 'groupGrid' && (
                            <>
                                <SortButton onFilterSelect={(selected)=> handleFilterGroupSelect(selected, 'No. Members')} title='No. Members' content={['all','1-5','5-10','more than 10']}/>
                                <SortButton onFilterSelect={(selected)=> handleFilterGroupSelect(selected, 'No. Events')} title='No. Events' content={['all','1-5','5-10','more than 10']}/>
                            </>
                        )
                    }
                </div>

                <div className="event-list-container sele">
                    {visibleList === 'eventGrid' && (
                        <>
                            {filteredEventList.map((event: EventDetail) => (
                                <EventHorizontalCard
                                    key={event.id}
                                    title={event.name}
                                    img={event.profileImagePath}
                                    id={event.id}
                                    start={event.start}
                                    end={event.end}
                                    location={event.location}
                                    eventParticipants={event.eventParticipants.length}
                                    maxParticipants={event.maxParticipants}
                                />
                            ))}
                        </>
                    )}
                    {visibleList === 'groupGrid' && (
                        <>
                            {filteredGroupList.map((group: GroupDetailWithEvents) => (
                                <GroupHorizontalCard
                                    key={group.id}
                                    name={group.name}
                                    img={group.profileImagePath}
                                    hostName={group.host.name}
                                    description={group.description}
                                    memberSize={group.members.length}
                                    id={group.id}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default CategoryPage