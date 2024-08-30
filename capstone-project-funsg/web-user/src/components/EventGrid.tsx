import "../css/EventGrid.css";
import {EventDetail} from "../model/EventDetail.ts";
import EventCard from "./EventCard.tsx";
import {useNavigate} from "react-router-dom";

interface Props {
    list: EventDetail[];
    title: string;
}

function EventGrid(props: Props) {
    const navigate = useNavigate();
    const handleViewAll = () => {

        navigate(`/events`);

    };
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h4 className="fw-semibold title fw-bold ms-4 mt-4 text-start">{props.title}</h4>
                    </div>
                </div>
            </div>
            <div className="text-end mx-xl-5">
                <p
                    onClick={handleViewAll}
                    className="text-primary fw-bold"
                    style={{
                        cursor: 'pointer',
                    }}
                >
                    View all events
                </p>
            </div>
            <div className="event-grid-container">
                <div className="event-grid">
                    {props.list.slice(0, 8).map((event) => (
                        <div key={event.id} className="event-grid-item">
                            <EventCard
                                title={event.name}
                                img={event.profileImagePath}
                                id={event.id}
                                type={'event'}
                                start={event.start}
                                end={event.end}
                                location={event.location}
                                maxParticipants={event.eventParticipants.length}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default EventGrid;
