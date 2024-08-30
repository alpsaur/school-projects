import '../css/Comment.css'

interface Props{
    img:string;
    userName:string;
    content:string;
    postAt:string
}

function Comment({img,userName,content,postAt}:Props){
    return (
        <div className="comment-card">
            <img src={img} alt="event-photo" className='comment-img'/>
            <div className="textBox">
                <div className="textContent">
                    <p className="comment-user">{userName}</p>
                    <span>{postAt.substring(0, 10)}</span>
                </div>
                <p className="comment-content">{content}</p>
                <div>
                </div>
            </div>
        </div>
    );
}

export default Comment;