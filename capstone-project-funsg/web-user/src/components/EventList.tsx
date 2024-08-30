import Event from "./Event.tsx";
import "../css/EventList.css"
import {EventItem} from "../model/EventItem.ts";
import SeeMoreBtn from "./SeeMoreBtn.tsx";
import {useState, useRef, } from "react";
import axiosConfig from "../axiosConfig.tsx";

interface Props{
    list:EventItem[]
    isHost:boolean
    onEventCancel?:(eventId: number) => void;
}

function EventList(props:Props){

    const [currentIndex, setCurrentIndex] = useState(0);
    const listRef =useRef<HTMLDivElement | null>(null);
    const itemsPerPage=3;

    const handleCancelOnclick = (eventId: number) => {
        const confirmDelete = window.confirm("Are you sure you want to cancel this event?");
        if (confirmDelete) {
            axiosConfig.delete(`/events/${eventId}`)
                .then(() => {
                    if (props.onEventCancel) {
                        props.onEventCancel(eventId); // Call the function if it is defined
                    }// Notify parent component to update event list
                })
                .catch(error => {
                    console.error('No response received. Please try again.',error)
                });
        }
    };

    const handleSeeMore = () => {
        if (listRef.current) { // Check if listRef.current is not null
            if (currentIndex + 3 < props.list.length) {
                setCurrentIndex(currentIndex + 3);
            } else {
                setCurrentIndex(0); // Reset to the start if at the end
            }

            // Calculate the new transform value based on the index
            const newTransformValue = -currentIndex * (listRef.current.clientWidth / itemsPerPage);
            listRef.current.style.transform = `translateX(${newTransformValue}px)`;
        }
    };

    return(
        <div className='seeMoreBtn-display'>
            <div className="event-container">
                <div className="event-list" ref={listRef}>
                    {props.list.map((item, index) => (
                        <div className="event-item" key={index}>
                            <Event onCancel={props.onEventCancel ? () => handleCancelOnclick(item.id) : undefined} content={item.content} isVisible={props.isHost} title={item.name} img={item.image} id={item.id} type={item.type} />
                        </div>
                    ))}
                </div>
            </div>
            <SeeMoreBtn onClick={handleSeeMore}/>
        </div>
    )
}

export default EventList;