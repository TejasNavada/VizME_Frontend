
import React, { useState, useEffect, useContext, useRef } from 'react'
import { ProblemContext } from '../context/ProblemContext'
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material'
import TextField from '@mui/material/TextField';
import { MessageContext } from '../context/MessageContext'
import { filterProfanity } from '../tool/profanityFilter'
import { sendMessageToAI, sendMessage } from '../service/chatService'
import { AuthContext } from '../context/AuthContext';
import { replaceTaskWithVar } from '../tool/Tools';
import { createSubmission } from '../service/submissionService';
const nerdamer = require("nerdamer/all.min")
var gen = require('random-seed');


const Problem = () => {
    const { problem, setProblem,feedback,setFeedback, variables } = useContext(ProblemContext)
    const { messages, setMessages} = useContext(MessageContext)
    const { currentUser, setCurrentUser} = useContext(AuthContext)
    const [answer, setAnswer] = useState(0)
    const [calculatedAnswer, setCalculatedAnswer] = useState(0)
    const [open, setOpen] = useState(false)
    const [correct, setCorrect] = useState(false)
    

    useEffect(()=>{
        try {
            let equations = ["Solution="+problem?.answer]
            var rand = gen(currentUser.userId);
            for(let i = 0; i < variables.length; i++){
                let value =""
                if(variables[i].constant!=null){
                    value = variables[i].constant
                }
                else if(variables[i].min!=null){
                    value = Math.round(rand.floatBetween(variables[i].min, variables[i].max) / variables[i].step) * variables[i].step
                }
                else if(variables[i].equation!=null){
                    value = variables[i].equation
                }
                equations.push(variables[i].var_name+"="+value)
            }
            console.log(equations)
            nerdamer.set('SOLUTIONS_AS_OBJECT', true)
            var sol = nerdamer.solveEquations(equations);
            console.log(sol);
            let computedAnswer = sol["Solution"]
            setCalculatedAnswer(computedAnswer)
            
        } catch (error) {
            console.log(error)
        }
        
    },[currentUser,problem,variables])

    const handleSubmit = () => {
        const getFeedback = async () => {
            let newMessages = [...messages]
            newMessages.push(
                {"role": "user", "content": "I got "+answer+". But this is incorrect. Can you explain how to solve a problem like this?", sender_id: currentUser.id, problemId:problem.problemId, receiver_id:1}
              )
            if(problem?.enable_chat){
                await sendMessage(problem.problemId,currentUser.userId,1,"I got "+answer+". But this is incorrect. Can you explain how to solve a problem like this?")
            }
            if(problem?.enable_chat){
                let sentMessage = await sendMessageToAI(
                    newMessages,
                    filterProfanity("I got "+answer+". But this is incorrect. Can you explain how to solve a problem like this?"),
                    problem.image,
                    problem.statement,
                    problem.problemId,
                    currentUser.userId
                )
            }
            
        }
        
        let equations = ["Solution="+problem?.answer]
        var rand = gen(currentUser.userId);
        for(let i = 0; i < variables.length; i++){
            let value =""
            if(variables[i].constant!=null){
                value = variables[i].constant
            }
            else if(variables[i].min!=null){
                value = Math.round(rand.floatBetween(variables[i].min, variables[i].max) / variables[i].step) * variables[i].step
            }
            else if(variables[i].equation!=null){
                value = variables[i].equation
            }
            equations.push(variables[i].var_name+"="+value)
        }
        console.log(equations)
        nerdamer.set('SOLUTIONS_AS_OBJECT', true)
        var sol = nerdamer.solveEquations(equations);
        console.log(sol);
        let computedAnswer = sol["Solution"]
        console.log(roundToDecimals(computedAnswer,2))
        console.log(roundToDecimals(answer,2))
        if(roundToDecimals(answer,2)!==roundToDecimals(computedAnswer,2)){
            createSubmission(problem.problemId,currentUser.userId,0,false,["Solution="+answer])
            setCorrect(false)
            if(!feedback){
                getFeedback()
            }
        }
        else{
            setCorrect(true)
            createSubmission(problem.problemId,currentUser.userId,100,false,["Solution="+answer])
        }
        setOpen(true)
    }

    const roundToDecimals = function (number, decimals) {
        const num = Math.pow(10, decimals);  
        return Math.round(number * num) / num;
    }



    

    return (
        <div className="problem" style={{marginLeft:"10px", marginRight:"10px",overflowY:"auto",maxHeight:"100vh",border: "none", height: "100%", backgroundColor: "#ffffff", border: "1px solid #e1e1e1", boxSizing: "border-box", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", borderRadius: "15px", display: "flex", flexDirection: "column", overflowY: "auto", padding: "10px"}}>
            <Typography variant="h3">{problem.problemName}</Typography>
            <img src={problem?.image} style={{maxHeight:"100vh", maxHeight:"50vh", height:"100%", width:"100%", objectFit:"contain"}} ></img>
            <Typography variant="h6">Problem Statement</Typography>
            <Typography style={{whiteSpace: 'pre-line'}} variant="h7" display="block" paragraph={true}>{replaceTaskWithVar(problem?.statement,variables,currentUser?.userId)}</Typography>
            <TextField 
            type="number" 
            id="outlined-basic" 
            label="Answer" 
            variant="outlined"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)} />
            <div>
                <Button sx={{paddingY:"15px", marginTop:"10px"}} size="large" color="primary" variant="contained" onClick={handleSubmit}>Submit Answer</Button>
            </div>
            {/* <div>
                <Typography>
                    {calculatedAnswer}
                </Typography>
            </div> */}
            <Dialog
                open={open}
                onClose={() =>setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{'Feedback'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {correct ? (
                            <Typography variant="h6">Your Answer of {answer} is Correct</Typography>
                        ):(
                            <Typography style={{whiteSpace: 'pre-line'}} variant="h6">Your Answer of {answer} is Incorrect.{"\n"}{!problem.enable_chat?problem.feedback:"Chat with the AI assistant to help find the right answer"} </Typography>
                        )}
                    
                    
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() =>setOpen(false)}>Dismiss</Button>
                    
                </DialogActions>
            </Dialog>

        
        </div>
    )
}

export default Problem