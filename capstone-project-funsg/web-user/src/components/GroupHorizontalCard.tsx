
import { useNavigate } from 'react-router-dom';
import '../css/GroupHorizontalCard.css';

interface GroupHorizontalCardProps {
    name: string;
    img: string | null;
    hostName: string;
    description: string;
    memberSize: number;
    id:number;
}

function GroupHorizontalCard(props: GroupHorizontalCardProps) {
    const navigate = useNavigate();

    const handleOnClick = () => {
        navigate(`/group/${props.id}`);
    };

    return (
        <div className="group-card-container" onClick={handleOnClick}>
            <div className="group-card-image-container">
                {props.img ? (
                    <img
                        src={props.img}
                        className="group-card-image"
                        alt={`${props.name} Logo`}
                    />
                ) : (
                    <div className="group-card-placeholder">No Image Available</div>
                )}
            </div>
            <div className="group-card-body">
                <p className="group-card-title">{props.name}</p>
                <p className="group-card-text"><strong>Host:</strong> {props.hostName}</p>
                <p className="group-card-text"><strong>Description:</strong> {props.description}</p>
                <p className="group-card-text"><strong>Members:</strong> {props.memberSize}</p>
            </div>
        </div>
    );
}

export default GroupHorizontalCard;
