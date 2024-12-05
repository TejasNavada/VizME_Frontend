
import React, { useState, useEffect, useContext, useRef } from 'react'
import { ProblemContext } from '../context/ProblemContext'
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid} from '@mui/material'
import TextField from '@mui/material/TextField';
import { MessageContext } from '../context/MessageContext'
import { filterProfanity } from '../tool/profanityFilter'
import { AuthContext } from '../context/AuthContext';
import { SubmissionsContext } from '../context/SubmissionsContext';
import { PieChart } from '@mui/x-charts/PieChart';
import { getUserById } from '../service/userService'
import { getMessagesByProblemAndUser } from '../service/chatService';

const Submission = ({submission}) => {
    const { problem, setProblem,feedback,setFeedback,history, SetHistory, variables } = useContext(ProblemContext)
    const { currentUser, setCurrentUser} = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const {messages, setMessages,setListenTo} = useContext(MessageContext)

    useEffect(()=>{
        getUserById(submission.userId).then((data)=>{
            setUser(data)
            //console.log(data)
        })

    },[submission])

    

    


    return (
        <div onClick={()=>setListenTo(submission.userId)} style={{border: '1px solid grey', borderRadius: '8px', padding: "10px", backgroundColor: "rgba(173, 216, 230, 0.5)" }}>
            <Grid container columns={{ xs: 9,}} spacing={0} >
                <Grid item xs={4}>
                    <Typography variant="p3">User:</Typography>
                </Grid>
                <Grid item xs={5}>
                    <Typography variant="p3">{user?.first_name}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="p3">Pass:</Typography>
                </Grid>
                <Grid item xs={5}>
                    <Typography variant="p3">{submission.pass}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="p3">Submissions:</Typography>
                </Grid>
                <Grid item xs={5}>
                    <Typography variant="p3">{submission.num_subs}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="p3">Messages:</Typography>
                </Grid>
                <Grid item xs={5}>
                    <Typography variant="p3">{submission?.num_messages==null?0:submission?.num_messages}</Typography>
                </Grid>
            </Grid>
            
        </div>
    )
}

export default Submission