import { useEffect, useState } from "react";
import axiosConfig from "./axiosConfig.tsx";
import { EventDetail } from "./model/EventDetail.ts";
import EventHorizontalCard from "./components/EventHorizontalCard.tsx";
import Navbar from "./components/Navbar.tsx";
import './css/AllEventsPage.css';

import CategoryList from "./components/CategoryList.tsx";
import SortButton from "./components/SortButton.tsx";

const AllEventsPage = () => {

    const [eventGrid, setEventGrid] = useState<EventDetail[]>([]);
    const [filteredList, setFilteredList] = useState(eventGrid);

    useEffect(() => {
        axiosConfig.get('/events')
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
                }));
                setEventGrid(formattedData);
                setFilteredList(formattedData);
                console.log(new Date(response.data[1].start))
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    }, []);




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

    const handleFilterSelect = (selected: string, filterType: string) => {
        let filtered = [...eventGrid];

        if (filterType === 'Max Participate') {
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
        setFilteredList(filtered);
    };

    return (
        <>
            <Navbar />
            <CategoryList isShowSuggestion={false}/>
            <div className="all-events-container">
                <h3 className="mt-4 title">Upcoming Events</h3>
                <div className="nav-container">
                    <SortButton onFilterSelect={(selected)=> handleFilterSelect(selected, 'Max participate')} title='Max participate' content={['1-10','10-20','more than 20','all']}/>
                    <SortButton onFilterSelect={(selected)=> handleFilterSelect(selected, 'Date')} title='Date' content={['all','this week','next week','this month']}/>
                </div>

                <div className="event-list-container">
                    {filteredList.map((event: EventDetail) => (
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
                </div>
            </div>
        </>
    );
};

export default AllEventsPage;
