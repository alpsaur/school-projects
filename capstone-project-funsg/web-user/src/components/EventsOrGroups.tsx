import '../css/EventsOrGroups.css'

interface Props{
    onEvent?:(checked:boolean)=>void;
}

function EventsOrGroups({onEvent}:Props){
    const handleEventChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onEvent) {
            onEvent(event.target.id === 'tab1'); // true for "Events", false for "Groups"
        }
    };
    return(
        <>
            <div className="tab-container">
                <input type="radio" name="tab" id="tab1" className="tab tab--1" onChange={handleEventChange}/>
                <label className="tab_label" htmlFor="tab1">Events</label>

                <input type="radio" name="tab" id="tab2" className="tab tab--2" onChange={handleEventChange}/>
                <label className="tab_label" htmlFor="tab2">Groups</label>

                <div className="indicator"></div>
            </div>
        </>
    );
}

export default EventsOrGroups