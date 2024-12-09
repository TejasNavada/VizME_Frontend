import React, { useContext, useEffect, useState, useRef } from 'react'
import Message from './Message'
import { MessageContext } from '../context/MessageContext'
import { AuthContext } from '../context/AuthContext'

const Messages = ({ messagesProp }) => {
  const {messages, setMessages} = useContext(MessageContext)
  const {currentUser, setCurrentUser} = useContext(AuthContext)



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
            key={index}
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
