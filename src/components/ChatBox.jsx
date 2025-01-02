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
      setChatMessage('')
    }
    else{
      let newMessages = [...messages,{problemId:problem.problemId,sender_id:currentUser.userId,receiver_id:1,content:filterProfanity(chatMessage)}]
    
      
      setChatMessage('')
      await sendMessageToAI(newMessages)
    }
    
    
  }



  return (
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
  )
}

export default Chat