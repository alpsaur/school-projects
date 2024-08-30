import '../css/EventCard.css';
import {useNavigate} from 'react-router-dom';

interface Props {
    title: string;
    img: string;
    id: number;
    type: string;
    start: string;
    end: string;
    location: string;
    maxParticipants: number;
}

function EventCard(props: Props) {
    const navigate = useNavigate();

    const handleOnClick = () => {
        if (props.type === 'event') {
            navigate(`/event/${props.id}`);
        } else {
            navigate(`/group/${props.id}`);
        }
    };

    return (
        <div className="event-card-container" onClick={handleOnClick}>
            <div>
                <img src={props.img} className="event-card-image"  alt="Event Photo"/>
            </div>
            <div className="event-card-body">
                <p className="event-card-title">{props.title}</p>
                <p className="event-card-text"><strong>Start Date:</strong> {new Date(props.start).toLocaleDateString()}
                </p>
                <p className="event-card-text"><strong>Start
                    Time:</strong> {new Date(props.start).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                </p>

                {/*<p className="event-card-text"><strong>End:</strong> {new Date(props.end).toLocaleString()}</p>*/}
                <p className="event-card-text"  style={{
                    margin: '0.25rem 0',
                    height: '4.5em', // Fixed height (assuming 1.5em line height and 3 lines)
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: '1.5em', // Adjust based on your font size
                    whiteSpace: 'normal', // Ensures text wraps within the container
                }}><strong>Location:</strong> {props.location}</p>
                <p className="event-card-text mt-2"><strong>Participants:</strong> {props.maxParticipants}</p>
            </div>
        </div>

    );
}

export default EventCard;
