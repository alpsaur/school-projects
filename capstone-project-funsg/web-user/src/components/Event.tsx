import '../css/Event.css'
import { useNavigate } from 'react-router-dom';

interface Props{
    title:string
    img:string | null
    id:number
    type:string
    isVisible:boolean
    content:string
    onCancel?: () => void;
}
function Event(props:Props){
    const navigate = useNavigate();
    const handleOnClick=()=>{
        if(props.type==='event'){
            navigate(`/event/${props.id}`);
        }else{
            navigate(`/group/${props.id}`)
        }

    }
    const handleUpdateOnClick=()=>{
        if(props.type==='event'){
            navigate(`/editEvent/${props.id}`);
        }else{
            navigate(`/editGroup/${props.id}`)
        }

    }

    const handleCancelOnClick = () => {
        if (props.type === 'event' && props.onCancel) {
            props.onCancel(); // Call the onCancel function if it exists
        }
    };

    return (
        <>
            <div className="card" >
                <img src={props.img || ''} className="card-img-top card-img-size" alt="itemImg" onClick={()=>handleOnClick()}/>
                <div className="card-body">
                    {
                        props.isVisible &&
                        <div className="button-container">
                            <a className="hover-button" href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                     color="#000000" fill="none">
                                    <path
                                        d="M13.5 4.5C13.5 3.67157 12.8284 3 12 3C11.1716 3 10.5 3.67157 10.5 4.5C10.5 5.32843 11.1716 6 12 6C12.8284 6 13.5 5.32843 13.5 4.5Z"
                                        stroke="currentColor" stroke-width="1.5"/>
                                    <path
                                        d="M13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5C12.8284 13.5 13.5 12.8284 13.5 12Z"
                                        stroke="currentColor" stroke-width="1.5"/>
                                    <path
                                        d="M13.5 19.5C13.5 18.6716 12.8284 18 12 18C11.1716 18 10.5 18.6716 10.5 19.5C10.5 20.3284 11.1716 21 12 21C12.8284 21 13.5 20.3284 13.5 19.5Z"
                                        stroke="currentColor" stroke-width="1.5"/>
                                </svg>
                            </a>
                            <div className="selection-menu">
                                {props.type === 'event' ? (
                                    <>
                                        <a onClick={handleCancelOnClick}>Cancel</a>
                                        <a onClick={handleUpdateOnClick}>Update</a>
                                    </>


                                ) : (
                                    <a onClick={handleUpdateOnClick}>Update</a>
                                )}
                            </div>
                        </div>
                    }

                    <p className="card-title">{props.title}<br/>
                        {props.type === 'event' ? (
                            <p className="card-title">start: {props.content} </p>
                        ) : (
                            <p className="card-title">members: {props.content}</p>
                        )}
                    </p>
                </div>
            </div>
        </>
    )

}

export default Event;