import '../css/DetailRight.css'
import {useNavigate} from "react-router-dom";
import MapComponent from './MapComponent.tsx';
import { getLatLngFromAddress } from '../services/Geocoding';
import {useEffect, useState} from "react";

interface Props{
    event:any
    groupImg:string
    maxParticipant:number
    participants:number
}

function DetailRight(props:Props){
    const navigate = useNavigate()
    const splitArray = props.event.location.split(",");
    const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);

    const handleOnClick=(id:number)=>{
        navigate(`/group/${id}`);
    }

    useEffect(() => {
        const fetchLatLng = async () => {
            const coordinates = await getLatLngFromAddress(props.event.location);
            if (coordinates) {
                setLatLng(coordinates);
            }
        };

        fetchLatLng();
    }, [props.event.location]);

    return(
        <>
            <div className='group-Container' onClick={() => handleOnClick(props.event.groupId)}>
                <img src={props.groupImg} className="hostGroup-photo" alt="group Photo"/>
                <p className="Event-title">{props.event.groupName}</p>
            </div>
            <div className='event-info-Container'>
                <div className="icon-container">
                    <img src="https://secure.meetupstatic.com/next/images/design-system-icons/time-outline.svg"
                         alt="Icon"
                         className="icon-container"/>
                </div>
                <div className='text-container'>
                    <p className="fs-4">Start: {props.event.start.substring(0, 10)} {props.event.start.substring(11, 20)}</p>
                    <p className="fs-4">End: {props.event.end.substring(0, 10)} {props.event.end.substring(11, 20)}</p>
                </div>

            </div>
            <div className='event-info-Container'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     className="bi bi-person-check icon-container" viewBox="0 0 16 16">
                    <path
                        d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                    <path
                        d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                </svg>
                <p className='fs-4'>Participants: {props.participants}/{props.maxParticipant} </p>
            </div>
            <div className='event-info-Container'>
                <div className="icon-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="icon-container"
                         color="#000000"
                         fill="none">
                        <path
                            d="M13.6177 21.367C13.1841 21.773 12.6044 22 12.0011 22C11.3978 22 10.8182 21.773 10.3845 21.367C6.41302 17.626 1.09076 13.4469 3.68627 7.37966C5.08963 4.09916 8.45834 2 12.0011 2C15.5439 2 18.9126 4.09916 20.316 7.37966C22.9082 13.4393 17.599 17.6389 13.6177 21.367Z"
                            stroke="currentColor" stroke-width="1.5"/>
                        <path
                            d="M15.5 11C15.5 12.933 13.933 14.5 12 14.5C10.067 14.5 8.5 12.933 8.5 11C8.5 9.067 10.067 7.5 12 7.5C13.933 7.5 15.5 9.067 15.5 11Z"
                            stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                </div>
                <div className='text-container'>
                    <p className="fs-4">{splitArray[0]},<br/> {splitArray[1]},<br/>{splitArray[2]}</p>
                </div>
            </div>

            <div className="map">
                {latLng ? (
                    <MapComponent latitude={latLng.lat} longitude={latLng.lng} zoom={15}/>
                ) : (
                    <p>正在加载地图...</p>
                )}
            </div>
        </>
    );
}

export default DetailRight