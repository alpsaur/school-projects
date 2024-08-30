
import "../css/EventCard.css";
import {useNavigate} from "react-router-dom";

interface Props {
    id: number;
    name: string;
    img: string | null;
    hostName: string;
    memberCount: number;
}

function GroupCard(props: Props) {

    const navigate = useNavigate();

    const handleOnClick = () => {
            navigate(`/group/${props.id}`);

    };
    return (
        <div className="container" onClick={handleOnClick}>
            <div
                className="card_box"
                style={{
                    width: '100%',
                    height: '150px',
                    borderRadius: '0.375rem',
                    backgroundImage: `url(${props.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                }}
            >
                {/* You can add overlay or additional styling here if needed */}
            </div>
            <div className="event-card-body">
                <p className="event-card-title">{props.name}</p>
                <p className="event-card-text"><strong>Host:</strong> {props.hostName}</p>
                <p className="event-card-text"><strong>Members:</strong> {props.memberCount}</p>
            </div>
        </div>
    );
}

export default GroupCard;
