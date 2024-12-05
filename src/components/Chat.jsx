import Messages from './Messages'
import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from 'react'
import { FormControl, InputLabel, MenuItem, Select, TextField, Fab, Button, Tab, Tabs } from '@mui/material'
import '../css/chat.scss'
import { MessageContext } from '../context/MessageContext'
import { filterProfanity } from '../tool/profanityFilter'
import { sendMessageToAI, sendMessage, getMessagesByProblemAndUser } from '../service/chatService'
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { ProblemContext } from '../context/ProblemContext'
import { AuthContext } from '../context/AuthContext'
import { PriorityHigh } from '@mui/icons-material'

const Chat = ({send}) => {
  const {messages, setMessages,listenTo} = useContext(MessageContext)
  const {currentUser, setCurrentUser} = useContext(AuthContext)
  const { problem, setProblem, problems, setProblems, mode, setMode  } = useContext(ProblemContext)
  const [ chatMessage, setChatMessage ] = useState("")
  
  useEffect(()=>{
    if(currentUser?.userId && problem?.problemId && currentUser.userRole==3){
      getMessagesByProblemAndUser(problem.problemId,currentUser.userId).then((messageList)=>{
        console.log(messageList)
        setMessages(messageList)
      })
    }

  },[problem,currentUser])


  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e.preventDefault()
      sendMessageFunc(e)
    }
  }

  const sendMessageFunc = async (e) => {
    if(e != undefined){
      e.preventDefault()
    }
    if(currentUser.userRole == 1){
      await sendMessage(problem.problemId,currentUser.userId,listenTo,chatMessage)
    }
    let newMessages = [...messages]
    newMessages.push(
      {"role": "user", "content": chatMessage, sender_id: currentUser.id, problemId:problem.problemId, receiver_id:1}
    )
    await sendMessage(problem.problemId,currentUser.userId,1,chatMessage)
    setChatMessage('')
    await sendMessageToAI(
        newMessages,
        filterProfanity(chatMessage),
        problem.image,
        problem.statement,
        problem.problemId,
        currentUser.userId
    )
    
  }


  return (
    <div className="chat">
      <div className="chat-history">
        <span key={messages}>
          <Messages key={messages}messages={messages} />
        </span>
      </div>
      
      {send && (listenTo!=null||currentUser.userRole==3) &&(
        <form className="message-form" onSubmit={sendMessageFunc}>
          <textarea
            className="message-input"
            value={chatMessage}
            onChange={(e) => {
              setChatMessage(e.target.value)
            }}
            
            placeholder={'Use Shift + Enter for new line'}
            onKeyDown={handleKeyPress}
          />
        </form>
      )}
      
    </div>
  )
}

export default Chat