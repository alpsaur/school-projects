import '../css/Members.css'

interface Props{
    img:string;
    userName:string;
}

function Members(props:Props){
    return(
        <div className='Members-display'>
            <img src={props.img} className="Host-photo Members-photo" alt="userPhoto"/>
            <p className="fs-5 fw-semibold">{props.userName}</p>
        </div>
    );
}
export  default Members;