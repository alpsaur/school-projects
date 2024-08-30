import '../css/EventHorizontalCard.css';
import {useNavigate} from 'react-router-dom';

interface Props {
    title: string;
    img: string;
    id: number;
    start: string;
    end: string;
    location: string;
    maxParticipants: number;
    eventParticipants:number;
}

function EventHorizontalCard(props: Props) {
    const navigate = useNavigate();

    const handleOnClick = () => {
        navigate(`/event/${props.id}`);

    };

    return (
        <div className="event-horizontal-card-container" onClick={handleOnClick}>
            <div className="event-horizontal-card-image-container">
                <img
                    src={props.img}
                    className="event-horizontal-card-image"
                    alt="Event Photo"
                />
            </div>
            <div className="event-horizontal-card-body">
                <div>
                    <p className="event-horizontal-card-title">{props.title}</p>
                    <div className="event-horizontal-card-datetime">
                        <p className="event-horizontal-card-text">
                            <strong>Start:</strong> {new Date(props.start).toLocaleDateString()} {new Date(props.start).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                        <p className="event-horizontal-card-text">
                            <strong>End:</strong> {new Date(props.end).toLocaleDateString()} {new Date(props.end).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                    </div>
                </div>
                <div>
                    <p className="event-horizontal-card-text event-horizontal-card-location">
                        <strong>Location:</strong> {props.location}</p>
                    <div className="event-horizontal-card-participants">
                        <p className="event-horizontal-card-text"><strong>Participants:</strong> {props.eventParticipants}/{props.maxParticipants}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventHorizontalCard;
