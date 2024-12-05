
import React, { useState, useEffect, useContext, useRef } from 'react'
import { ProblemContext } from '../context/ProblemContext'
import { Typography, Button, Dialog, DialogTitle, DialogContent, Tab, Tabs, List, ListItem, ListItemButton, ListItemText, Paper, Stack, Divider} from '@mui/material'
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { MessageContext } from '../context/MessageContext'
import { filterProfanity } from '../tool/profanityFilter'
import { AuthContext } from '../context/AuthContext';
import { SubmissionsContext } from '../context/SubmissionsContext';
import { PieChart, BarChart } from '@mui/x-charts';
import Submission from './Submission';
import Stat from './Stat';
import { replaceTaskWithVar } from '../tool/Tools';
import { getMessagesByProblemAndUser } from '../service/chatService';
import { getUserEquationsBySubId } from '../service/submissionService';
import { getUserById } from '../service/userService';
const nerdamer = require("nerdamer/all.min")
var gen = require('random-seed');


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

const Report = () => {
    const { problem, setProblem,feedback,setFeedback,history, SetHistory, variables } = useContext(ProblemContext)
    const { currentUser, setCurrentUser} = useContext(AuthContext)
    const { listenTo, stats} = useContext(MessageContext)
    const { submissions} = useContext(SubmissionsContext)
    const [ passResults, setPassResults ] = useState([0,0])
    const [ messageResults, setMessageResults ] = useState([])
    const [ submissionResults, setSubmissionResults ] = useState([])
    const [ selectedSubmissions, setSelectedSubmissions] = useState([])
    const [value, setValue] = useState(0);
    const [correctSolution, setCorrectSolution] = useState("");
    const [studentSolution, setStudentSolution] = useState("");
    const [filter, setFilter] = useState({type:"none"})
    const [ user, setUser ] = useState(null);
    const [ avgSubs, setAvgSubs ] = useState(0);
    const [ avgMessages, setAvgMessages ] = useState(0);
    const [ passrate, setPassrate ] = useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    useEffect(()=>{
        if(listenTo!=null){
            getUserById(listenTo).then((data)=>{
                //console.log(data)
                setUser(data)
            })
        }
        //console.log(message)
    },[listenTo])
    useEffect(()=>{
        if(!stats || stats.length==0){
            return;
        }
        let total_subs = 0
        let total_messages = 0
        let total_pass = 0
        
        console.log(total_pass)
        for(let i = 0; i < stats.length; i++){
            total_subs += Number(stats[i]?.num_subs)
            total_messages += Number(stats[i]?.num_messages)

            total_pass += stats[i]?.pass
        }
        console.log(stats)
        console.log(total_messages)
        console.log(total_subs)
        console.log(total_pass)
        console.log(stats.length)
        setAvgSubs(Math.round((100*total_subs/stats.length))/100)
        setAvgMessages(Math.round(100*total_messages/stats.length)/100)
        setPassrate(Math.round(100*total_pass/stats.length)/100)

    },[stats])

    useEffect(()=>{
        if(submissions==null){
            return
        }
        let pass = 0;
        let fail = 0;
        submissions.forEach(element => {
            if(element.pass==100){
                pass+=1
            }
            else{
                fail+=1
            }
        });
        setPassResults([pass,fail])
        let dict = {}
        for(let i = 0; i< submissions.length; i++){
            if(submissions[i].num_messages == null){
                if(dict[0]==undefined){
                    dict[0]={pass:0,fail:0,passIds:[], failIds:[]}
                }
                if(submissions[i].pass==100){
                    dict[0].pass+=1
                    dict[0].passIds.push(submissions[i].submissionId)
                }
                else{
                    dict[0].fail+=1
                    dict[0].failIds.push(submissions[i].submissionId)
                }
            }
            else{
                if(dict[submissions[i].num_messages]==undefined){
                    dict[submissions[i].num_messages]={pass:0,fail:0,passIds:[], failIds:[]}
                }
                if(submissions[i].pass==100){
                    dict[submissions[i].num_messages].pass+=1
                    dict[submissions[i].num_messages].passIds.push(submissions[i].submissionId)
                }
                else{
                    dict[submissions[i].num_messages].fail+=1
                    dict[submissions[i].num_messages].failIds.push(submissions[i].submissionId)
                }

            }
            
        }
            
        
        console.log(dict)
        let message=[]
        for (const [key, val] of Object.entries(dict)) {
            message.push({numMessages:key,...val})
        }
        setMessageResults(message)

        let subs = {}
        for(let i = 0; i< submissions.length; i++){
            if(subs[submissions[i].num_subs]==undefined){
                subs[submissions[i].num_subs]={pass:0,fail:0,passIds:[], failIds:[]}
            }
            if(submissions[i].pass==100){
                subs[submissions[i].num_subs].pass+=1
                subs[submissions[i].num_subs].passIds.push(submissions[i].submissionId)
            }
            else{
                subs[submissions[i].num_subs].fail+=1
                subs[submissions[i].num_subs].failIds.push(submissions[i].submissionId)
            }
        }
            
        
        console.log(subs)
        let numberSubs=[]
        for (const [key, val] of Object.entries(subs)) {
            numberSubs.push({num_subs:key,...val})
        }
        setSubmissionResults(numberSubs)
        console.log(numberSubs)
        
        
    },[submissions])

    useEffect(()=>{
        if(submissions==null || submissions.length==0){
            setSelectedSubmissions([])
        }
        else if( selectedSubmissions[0]?.problemId!=submissions[0]?.problemId || filter?.type=="none"){
            setSelectedSubmissions(submissions)
        }
        else{
            if(filter.type="pf"){
                let selected = []
                submissions.forEach(element => {
                    if((element.pass==100 && filter.dataIndex==0) || (element.pass!=100 && filter.dataIndex!=0)){
                        selected.push(element)
                    }
                });
                setSelectedSubmissions(selected)
            }
            if(filter.type="message"){
                let selected
                if(filter.part = 0){
                    selected = [...messageResults[filter.dataIndex]?.passIds]
                }
                else if (filter.part=1){
                    selected = [...messageResults[filter.dataIndex]?.failIds]
                }
                else{
                    selected = [...messageResults[filter.dataIndex]?.passIds , ...messageResults[filter.dataIndex]?.failIds]
                }
                let subs = submissions.filter((sub)=>selected.indexOf(sub.submissionId)!=-1)
                console.log(subs)
                setSelectedSubmissions(subs)
            }
            if(filter.type="submission"){
                let selected
                if(filter.part = 0){
                    selected = [...submissionResults[filter.dataIndex]?.passIds]
                }
                else if (filter.part=1){
                    selected = [...submissionResults[filter.dataIndex]?.failIds]
                }
                else{
                    selected = [...submissionResults[filter.dataIndex]?.passIds , ...submissionResults[filter.dataIndex]?.failIds]
                }
                let subs = submissions.filter((sub)=>selected.indexOf(sub.submissionId)!=-1)
                console.log(subs)
                setSelectedSubmissions(subs)
            }
        }
    },[submissions])
    useEffect(()=>{
        console.log(stats)
    },[stats])

    const handlePassFailClick = (event, d) => {
        if(submissions==null){
            return
        }
        setFilter({type:"pf",dataIndex:d.dataIndex})
        console.log(event)
        console.log(d)
        let pass = d.dataIndex==0
        let selected = []
        submissions.forEach(element => {
            if((element.pass==100 && d.dataIndex==0) || (element.pass!=100 && d.dataIndex!=0)){
                selected.push(element)
            }
        });
        setSelectedSubmissions(selected)
    }
    const handleMessageHistogramClick = (event, d) => {
        if(submissions==null){
            return
        }
        console.log(d)
        if(d?.type=="bar"){
            let selected
            if(d.seriesId == "pass"){
                setFilter({type:"message",dataIndex:d.dataIndex,part:0})
                selected = [...messageResults[d.dataIndex].passIds]
            }
            else{
                setFilter({type:"message",dataIndex:d.dataIndex,part:1})
                selected = [...messageResults[d.dataIndex].failIds]
            }
            let subs = submissions.filter((sub)=>selected.indexOf(sub.submissionId)!=-1)
            console.log(subs)
            setSelectedSubmissions(subs)
        }
        else{
            console.log(messageResults[d.dataIndex])
            setFilter({type:"message",dataIndex:d.dataIndex,part:2})
            let selected = [...messageResults[d.dataIndex].passIds , ...messageResults[d.dataIndex].failIds]
            console.log(selected)
            let subs = submissions.filter((sub)=>selected.indexOf(sub.submissionId)!=-1)
            console.log(subs)
            setSelectedSubmissions(subs)
        }
    }

    const handleSubmissionsHistogramClick = (event, d) => {
        if(submissions==null){
            return
        }
        console.log(d)
        if(d?.type=="bar"){
            let selected
            if(d.seriesId == "pass"){
                setFilter({type:"submission",dataIndex:d.dataIndex,part:0})
                selected = [...submissionResults[d.dataIndex].passIds]
            }
            else{
                setFilter({type:"submission",dataIndex:d.dataIndex,part:1})
                selected = [...submissionResults[d.dataIndex].failIds]
            }
            let subs = submissions.filter((sub)=>selected.indexOf(sub.submissionId)!=-1)
            console.log(subs)
            setSelectedSubmissions(subs)
        }
        else{
            console.log(submissionResults[d.dataIndex])
            setFilter({type:"submission",dataIndex:d.dataIndex,part:2})
            let selected = [...submissionResults[d.dataIndex].passIds , ...submissionResults[d.dataIndex].failIds]
            console.log(selected)
            let subs = submissions.filter((sub)=>selected.indexOf(sub.submissionId)!=-1)
            console.log(subs)
            setSelectedSubmissions(subs)
        }
    }
    useEffect(()=>{
        if(listenTo==null){
            return
        }
        try {
            let equations = ["Solution="+problem?.answer]
            var rand = gen(listenTo);
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
            setCorrectSolution(computedAnswer)
            let sub = submissions.find((submission)=>submission.userId==listenTo)
            getUserEquationsBySubId(sub.submissionId).then((studentEquations)=>{
                setStudentSolution(studentEquations[0].equation.substring(9))
            })
            
        } catch (error) {
            
        }
        

    },[listenTo, problem, variables])
    useEffect(()=>{
        setFilter({type:"none"})

    },[problem?.problemId])


    return (
        <div className="problem" style={{  marginLeft:"10px", marginRight:"10px",overflowY:"auto",maxHeight:"100vh"}}>
            <div>
                <div style={{border: "none", height: "100%", backgroundColor: "#ffffff", border: "1px solid #e1e1e1", boxSizing: "border-box", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", borderRadius: "15px", display: "flex", flexDirection: "column", overflowY: "auto", padding: "10px"}}>
                    <Typography variant="h3"component="span" onClick={()=>{setSelectedSubmissions(submissions);setFilter({type:"none"})}}>{problem.problemName}</Typography>
                    <Typography variant="h6">Problem Image</Typography>
                    <img src={problem?.image} style={{maxHeight:"100%",maxWidth:"100%"}} ></img>
                    <Typography variant="h6">Problem Statement</Typography>
                    <Typography style={{whiteSpace: 'pre-line'}} variant="h7" display="block" paragraph={true}>{replaceTaskWithVar(problem?.statement,variables,listenTo)}</Typography>
                    {listenTo!=null && (
                        <div>
                            <Typography>Correct Answer: {correctSolution}</Typography>
                            <div>
                            <Typography>Students Answer: {studentSolution}</Typography>
                            </div>

                        </div>
                    )}
                </div>

                
                
                <div style={{ }}>
                    <div style={{border: "none", height: "100%", backgroundColor: "#ffffff", border: "1px solid #e1e1e1", boxSizing: "border-box", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", borderRadius: "15px", display: "flex", flexDirection: "column", overflowY: "auto", padding: "10px"}}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Pass/Fail" />
                            <Tab label="Message Histogram" />
                            <Tab label="Submission Histogram" />
                        </Tabs>
                        {value==0 && (
                            <PieChart
                            series={[
                                {
                                data: [
                                    { id: 0, value: passResults[0], label: 'Pass',color:"green" },
                                    { id: 1, value: passResults[1], label: 'Fail',color:"red" },
                                ],
                                },
                            ]}
                            onItemClick={handlePassFailClick}
                            width={400}
                            height={200}
                            />
                        )}
                        {value==1 && (
                            <BarChart
                            dataset={messageResults}
                            series={[{dataKey:"pass",stack:"pass/fail",id:"pass",label:"Pass",color:"green"},{dataKey:"fail",id:"fail",stack:"pass/fail",label:"Fail",color:"red"}]}
                            xAxis={[{ scaleType: 'band', dataKey: 'numMessages' }]}
                            slotProps={{ legend: { hidden: true } }}
                            onItemClick={handleMessageHistogramClick}
                            onAxisClick={handleMessageHistogramClick}
                            width={600}
                            height={350}
                        />
                        )}
                        {value==2 && (
                            <BarChart
                            dataset={submissionResults}
                            series={[{dataKey:"pass",stack:"pass/fail",id:"pass",label:"Pass",color:"green"},{dataKey:"fail",id:"fail",stack:"pass/fail",label:"Fail",color:"red"}]}
                            xAxis={[{ scaleType: 'band', dataKey: 'num_subs' }]}
                            slotProps={{ legend: { hidden: true } }}
                            onItemClick={handleSubmissionsHistogramClick}
                            onAxisClick={handleSubmissionsHistogramClick}
                            width={600}
                            height={350}
                        />
                        )}
                    </div>
                    <div style={{display: "flex",border: "none", height: "100%", backgroundColor: "#ffffff", border: "1px solid #e1e1e1", boxSizing: "border-box", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", borderRadius: "15px", display: "flex",  overflowY: "auto", padding: "10px"}}>
                        <List>
                            <ListItemText>Selected Submissions</ListItemText>
                            {selectedSubmissions.map((sub)=>(
                                <ListItem disablePadding sx={{maxWidth:"16em"}}>
                                    <ListItemButton divider disableGutters>
                                        <ListItemText>
                                            <Submission
                                            submission={sub}
                                            />
                                        </ListItemText>
                                        
                                    </ListItemButton>
                                    
                                </ListItem>
                                
                            ))}
                        </List>
                        <Divider sx={{padding:"10px"}} flexItem  orientation="vertical" />
                        {listenTo!=null &&(
                            <div>
                                <Typography sx={{padding: "10px"}}>{user?.first_name}'s Stats Across All Problems</Typography>
                                <Typography sx={{paddingLeft: "20px"}}>Passrate: {passrate}%</Typography>
                                <Typography sx={{paddingLeft: "20px"}}>Avg # of Submissions: {avgSubs}</Typography>
                                <Typography sx={{paddingLeft: "20px"}}>Avg # of Messages: {avgMessages}</Typography>
                                <Stack sx={{padding:"20px"}}>
                                    {stats.map((stat)=>(
                                        <Item key={stat.problemId} elevation={10}>
                                            <Stat stat={stat}/>
                                        </Item>
                                    ))}
                                </Stack>
                            </div>
                        )}
                        
                    </div>
                    
                </div>
                
                

            </div>
        
        </div>
    )
}

export default Report