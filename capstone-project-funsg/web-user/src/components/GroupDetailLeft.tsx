import {useState} from "react";
import Members from "./Members.tsx";
import {User} from "../model/User.ts";
import {EventDetail} from "../model/EventDetail.ts";
import {CommentDetail} from "../model/Comment.ts";
import NavTab from "./NavTab.tsx";
import EventSmall from "./EventSmall.tsx";
import {useNavigate} from "react-router-dom";
import Comment from "./Comment.tsx";
import CommentSend from "./CommentSend.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';

interface Props{
    group:any;
    eventList:EventDetail[];
    commentLis:CommentDetail[];
    photoList:string[];
}
function GroupDetailLeft(props:Props){
    const contentList=['Events','Members','Photos','Comments']
    const [selectedContent, setSelectedContent] = useState<string>(contentList[0]);
    const [commentList, setCommentList] = useState<CommentDetail[]>(props.commentLis);
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleContentChange = (selectedOption: string) => {
        setSelectedContent(selectedOption);
    };

    console.log("photo",props.photoList)
    const handleEventOnClick=(id:number)=>{
            navigate(`/event/${id}`);

    }

    const handleCommentSent = (newComment: CommentDetail) => {
        setCommentList(prevComments => [...prevComments, newComment]);
    };

    const handleImageClick = (imgSrc:string) => {
        setSelectedImage(imgSrc);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const renderContent = () => {
        switch (selectedContent) {
            case 'Events':
                return <>
                    <ul>
                        {props.eventList.map((event:EventDetail)=>
                            <div onClick={() => handleEventOnClick(event.id)}>
                                <EventSmall Img={event.profileImagePath} Start={event.start} Title={event.name}/>
                            </div>

                        )}
                    </ul>
                </>
            case 'Members':
                return (
                    <>
                        <ul>
                            {props.group.members.map((member:User)=>
                                    <Members img={member.profileImage} userName={member.name}/>
                            )}
                        </ul>
                    </>
                )
            case 'Photos':
                return (
                    <>
                        <div className='photoContainer'>
                            {props.photoList.map((imgSrc, index) => (
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
            case 'Comments':
                return (
                    <>
                        <div className="comment-container">
                            <ul className="comment-list">
                                {commentList.map((comment: CommentDetail) =>
                                    <Comment img={comment.user.profileImage}
                                             userName={comment.user.name}
                                             content={comment.content}
                                             postAt={comment.postAt}/>
                                )}
                            </ul>
                            <div className="sendComment">
                                <CommentSend groupId={props.group.id} onCommentSent={handleCommentSent} />
                            </div>
                        </div>
                    </>
                );
            default:
                return <div>Detail Content Here</div>;
        }
    };

    return (
        <>
            <img src={props.group.profileImagePath} className="eventDetail-photo" alt="Event Photo"/>
            <p className="detail fs-4"><span className="fw-semibold ">Detail:</span><br/><br/>{props.group.description}</p>
            <div className="subnav">
                <NavTab content={contentList} onContentChange={handleContentChange}/>
            </div>
            <div className="content">
                {renderContent()}
            </div>
        </>
    );
}
export default GroupDetailLeft;