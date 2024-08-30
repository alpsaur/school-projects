import React, { useState} from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar.tsx";
import CategoryList from "./components/CategoryList.tsx";
import EventsOrGroups from "./components/EventsOrGroups.tsx";
import {EventDetail} from "./model/EventDetail.ts";
import EventHorizontalCard from "./components/EventHorizontalCard.tsx";
import {GroupDetail} from "./model/GroupDetail.ts";
import GroupHorizontalCard from "./components/GroupHorizontalCard.tsx";

const SearchResultsPage: React.FC = () => {
    const location = useLocation();
    const { results = { events: [], groups: [] }, query = '' } = location.state || {};
    const eventGrid = results.events as EventDetail[];
    const groupGrid = results.groups as GroupDetail[];
    const [visibleList,setVisibleList] = useState('eventGrid')

    const handleEventOrGroup=(checked:boolean)=>{
        //true is events, false is groups

        if(checked){
            setVisibleList("eventGrid")
        }else {
            setVisibleList('groupGrid')
        }
        console.log("visibleList:", visibleList);
    };

    return (
        <>
            <Navbar/>
            <CategoryList isShowSuggestion={false}/>
            <div className="all-events-container">
                <h3 className="mt-4 title">Search Results for "{query}"</h3>
                <EventsOrGroups onEvent={handleEventOrGroup}/>
                <div className="nav-container">

                </div>
                <div className="event-list-container">
                    {visibleList === 'eventGrid' && (
                        <>
                            {eventGrid.map((event: EventDetail) => (
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
                            {groupGrid.map((group: GroupDetail) => (
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
};

export default SearchResultsPage;
