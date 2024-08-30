interface Props{
    group:any
    noEvents:number
}

function GroupDetailRight(props:Props){

    return(
        <>
            <div className='group-Container-group'>
                <p className="title-text ">{props.group.name}</p>
                <div className="title-container">
                    <img src={props.group.host.profileImage} className="Host-photo" alt="User Photo"/>
                    <div className="text-container">
                        <p className="fs-4">Hosted By</p>
                        <p className="fw-bold fs-4">{props.group.host.name}</p>
                    </div>
                </div>
            </div>
            <div className='hr-line'><hr/></div>
            <div className='info-Container'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     className="bi bi-person-check icon-container" viewBox="0 0 16 16">
                    <path
                        d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                    <path
                        d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                </svg>
                <p className='fs-4'>Number of Members: {props.group.members.length}</p>
            </div>
            <div className='info-Container'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     className="bi bi-activity icon-container" viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                          d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2"/>
                </svg>
                <p className='fs-4'>Number of Events: {props.noEvents}</p>
            </div>
        </>
    );
}

export default GroupDetailRight