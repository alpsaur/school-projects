import {ChangeEvent, useEffect, useState} from "react";
import '../css/CommentSend.css'
import axiosConfig from "../axiosConfig.tsx";
import {CommentDetail} from "../model/Comment.ts";

interface MessageInputProps {
    groupId:number;
    onCommentSent?: (newComment: CommentDetail) => void;
}

function CommentSend({groupId,onCommentSent}:MessageInputProps){
    const [message, setMessage] = useState<string>('');
    const [isLogin,setIsLogin]=useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newMessage = e.target.value;
        setMessage(newMessage);
    };

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axiosConfig.get('/users/status');
                if (response.status === 200) {
                    setIsLogin(true);
                } else {
                    setIsLogin(false)
                }
            } catch (error) {
                console.error('Error checking login status:', error);
                setIsLogin(false);
            }
        };

        checkLoginStatus();
    }, []);

    const handleSendMessage = async () => {
        if (!message.trim()) {
            return; // Do not send if the message is empty
        }
        if(!isLogin){
            alert("Please login");
        }

        try {
            const response = await axiosConfig.post(`comments/group/${groupId}`, {
                content: message,
            });

            const newComment = {
                content: message,
                postAt: response.data.postedAt, // Adjust based on your response structure
                user: response.data.user, // Adjust based on your response structure
            };

            if (onCommentSent) {
                onCommentSent(newComment);
            }

            console.log('Message sent:', response.data);
            setMessage(''); // Clear the input after sending
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return(
      <>
          <div className="messageBox">
              <input required
                     placeholder="Message..."
                     type="text" id="messageInput"
                     value={message}
                     onChange={handleChange}/>
              <button id="sendButton" onClick={handleSendMessage}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
                      <path
                          fill="none"
                          d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                      ></path>
                      <path
                          stroke-linejoin="round"
                          stroke-linecap="round"
                          stroke-width="33.67"
                          stroke="#6c6c6c"
                          d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                      ></path>
                  </svg>
              </button>
          </div>
      </>
    );
}
export default CommentSend