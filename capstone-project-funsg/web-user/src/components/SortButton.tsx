
import '../css/SortButton.css'

interface Props{
    content:string[]
    title:string
    onFilterSelect: (selected: string) => void
}

function SortButton({content,title,onFilterSelect}:Props){
    return(
        <>

            <div className="paste-button">
                <button className="sort-button">{title} &nbsp; ▼</button>
                <div className="dropdown-content">
                    {
                        content.map((str, index) => (
                            <a key={index} id={index.toString()} href="#" onClick={() => onFilterSelect(str)}>{str}</a>
                        ))
                    }

                </div>
            </div>


        </>
    );
}

export default SortButton