import "../css/DetailLeft.css"
import {useState} from "react";
import {User} from "../model/User.ts";
import Members from "./Members.tsx";
import NavTab from "./NavTab.tsx";

interface Props{
    event:any
    photoList:string[]
}

function DetailLeft(props:Props){
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const contentList=['Attendees','Photos']
    const [selectedContent, setSelectedContent] = useState<string>(contentList[0]);

    console.log("photo",props.photoList)

    const handleContentChange = (selectedOption: string) => {
        setSelectedContent(selectedOption);
        console.log("select", selectedOption)
    };

    const handleImageClick = (imgSrc:string) => {
        setSelectedImage(imgSrc);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const renderContent = () => {
        switch (selectedContent) {
            case 'Attendees':
                return (
                    <div>
                        <ul>
                            {props.event.eventParticipants.map((member:User)=>
                                <Members img={member.profileImage} userName={member.name}/>
                            )}
                        </ul>
                    </div>
                );
            case 'Photos':
                return (
                    <>
                        <div className='photoContainer'>
                            {props.photoList.map((imgSrc:string, index:number) => (
                                <img key={index} src={imgSrc} alt={`image-${index}`} className="img-item"
                                     onClick={() => handleImageClick(imgSrc)}/>
                            ))}

                        </div>
                        {selectedImage && (
                            <div className="modal show d-block" tabIndex={-1} onClick={closeModal}>
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <img src={selectedImage} alt="Selected" className="img-fluid" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                );
            default:
                return <div>Detail Content Here</div>;
        }
    };

    return(
        <>
            <img src={props.event.profileImagePath} className="eventDetail-photo" alt="Event Photo"/>
            <p className="detail fs-4"><span className="fw-semibold ">Detail:</span><br/><br/>{props.event.description}</p>
            <div className="subnav">
                <NavTab content={contentList} onContentChange={handleContentChange}/>
            </div>
            <div className="content">
                {renderContent()}
            </div>
        </>
    );
}

export default DetailLeft