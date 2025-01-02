
import { getAvatar, getDateString, getTimeString } from '../tool/Tools'
import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from 'react'
import { filterProfanity } from '../tool/profanityFilter'
import MarkdownWithLatex from './MarkdownWithLatex'
import { AuthContext } from '../context/AuthContext'
import { getUserById } from '../service/userService'

const Message = ({message}) => {
    const {currentUser} = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const messageClass = 'message'

    useEffect(()=>{
        if(message.sender_id!=currentUser.userId && message.sender_id!=1){
            getUserById(message.sender_id).then((data)=>{
                //console.log(data)
                setUser(data)
            })
        }
        //console.log(message)
    },[message])


    if(message.role == "system"){
        return null
    }




    if (message?.role == "assistant" || message.sender_id==1) {
        const url = "https://cdn1.iconfinder.com/data/icons/data-science-flat-1/64/ai-customer-service-support-robot-artificial-intelligence-1024.png"
        const name = "AI assistant"
        return (
        <div
        className={messageClass}
        style={{ justifyContent: 'left' }}
        >
            <div className="messageInfo">
                <img src={getAvatar(url)} alt="" />
                <span className="info-user">{name}</span>
            </div>
            <div className="messageContentWrapper">
                <div className="messageContent">
                    <pre>
                        <MarkdownWithLatex markdownText={filterProfanity(message?.content)}/>
                    </pre>
                </div>
            </div>
        </div>
        )
    }
    else if (message.sender_id!=currentUser.userId) {   
        return (
        <div
        className={messageClass}
        style={{ justifyContent: 'left' }}
        >
            <div className="messageInfo">
                <img src={getAvatar(false)} alt="" />
                <span className="info-user">{user?.first_name}</span>
            </div>
            <div className="messageContentWrapper">
                <div className="messageContent">
                    <pre>
                        <MarkdownWithLatex markdownText={filterProfanity(message?.content)}/>
                    </pre>
                </div>
            </div>
        </div>
        )
    }
    return (
        <div
        className={messageClass}
        >
            <div className="messageContentWrapper">
                <div className="messageContentRight">
                    <pre>
                        <MarkdownWithLatex markdownText={filterProfanity(message?.content)}/>
                    </pre>
                </div>
            </div>
            <div className="messageInfo">
                <img src={getAvatar(false)} alt="" />
                <span className="info-user">Me</span>
            </div>
        </div>
    )
}

export default Message
