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
import ChatBox from './ChatBox'

const Chat = ({send}) => {
  const {messages, setMessages,listenTo} = useContext(MessageContext)
  const {currentUser, setCurrentUser} = useContext(AuthContext)
 




  return (
    <div className="chat">
      <div className="chat-history">
        <span >
          <Messages />
        </span>
      </div>
      
      {send && (listenTo!=null||currentUser.userRole==3) &&(
        <ChatBox/>
      )}
      
    </div>
  )
}

export default Chat