
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
import { getProblemById } from '../service/problemService';

const Stat = ({stat}) => {
    const [prob, setProb] = useState(null)

    useEffect(()=>{
        getProblemById(stat.problemId).then((data)=>{
            setProb(data)
            //console.log(data)
        })

    },[stat])

    

    


    return (
        <div  style={{ padding: "10px"}}>
            <Grid container columns={{ xs: 9,}} spacing={0} >
                <Grid item xs={4}>
                    <Typography variant="p3">User:</Typography>
                </Grid>
                <Grid item xs={5}>
                    <Typography variant="p3">{prob?.problemName}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="p3">Pass:</Typography>
                </Grid>
                <Grid item xs={5}>
                    <Typography variant="p3">{stat.pass}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="p3">Submissions:</Typography>
                </Grid>
                <Grid item xs={5}>
                    <Typography variant="p3">{stat.num_subs}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="p3">Messages:</Typography>
                </Grid>
                <Grid item xs={5}>
                    <Typography variant="p3">{stat?.num_messages==null?0:stat?.num_messages}</Typography>
                </Grid>
            </Grid>
            
        </div>
    )
}

export default Stat