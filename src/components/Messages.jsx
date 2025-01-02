import React, { useContext, useEffect, useState, useRef } from 'react'
import Message from './Message'
import { MessageContext } from '../context/MessageContext'
import { AuthContext } from '../context/AuthContext'
import { ProblemContext } from '../context/ProblemContext'
import { getMessagesByProblemAndUser } from '../service/chatService'

const Messages = () => {
  const {messages, setMessages} = useContext(MessageContext)
  const {currentUser, setCurrentUser} = useContext(AuthContext)
  const { problem, setProblem, problems, setProblems, mode, setMode  } = useContext(ProblemContext)

  useEffect(()=>{
    if(currentUser?.userId && problem?.problemId && currentUser.userRole==3){
      getMessagesByProblemAndUser(problem.problemId,currentUser.userId).then((messageList)=>{
        console.log(messageList)
        setMessages(messageList)
      })
    }

  },[problem,currentUser])

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);
  

  return (
    <div className="messages">
      {messages.map((message, index) => {
        
        return (
          <Message
            key={message.messageId}
            message={message}
          />
        )
      })}
      {messages.length>0&&messages[messages.length-1].sender_id==currentUser.userId && currentUser.urserRole == 3 &&(
        <Message
        key={0}
        message={{"role":"assistant","content":"Loading..."}}
      />
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default Messages
