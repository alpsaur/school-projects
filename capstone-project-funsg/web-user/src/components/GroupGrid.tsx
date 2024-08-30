
import "../css/EventGrid.css";
import { GroupDetail } from "../model/GroupDetail.ts";
import GroupCard from "./GroupCard.tsx";
import {useNavigate} from "react-router-dom";

interface Props {
    list: GroupDetail[];
    title: string;
}

function GroupGrid(props: Props) {
    const navigate = useNavigate();
    const handleViewAll = () => {

        navigate(`/groups`);

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
                    View all groups
                </p>
            </div>

            <div className="event-grid-container">
                <div className="event-grid">
                    {props.list.slice(0, 8).map((group) => (
                        <div key={group.id} className="event-grid-item">
                            <GroupCard
                                id={group.id}
                                name={group.name}
                                img={group.profileImagePath}
                                hostName={group.host.name}
                                memberCount={group.members.length}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default GroupGrid;
