import React, { useContext, useEffect, useState, useRef  } from 'react'
import {
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ButtonGroup,
  Grid,
  Chip,
  Box,
  Menu,
  ClickAwayListener,
  Typography,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider
} from '@mui/material'
import { ContentCopy, Delete, Link, ArrowDownwardIcon, ArrowUpwardIcon} from '@mui/icons-material'
import '../css/session.scss'
import { getDateString, getTimeString } from '../tool/Tools'
import { ProblemContext } from '../context/ProblemContext'
import AddSessionDialog from './AddSessionDialog'
import { addProblem, getAllProblems, deleteProblem, updateProblemInSession, setProblemEnableChat } from '../service/problemService'

const Session = () => {
    const { problem, setProblem, problems, setProblems, mode, setMode, feedback,setFeedback  } = useContext(ProblemContext)
    const [open, setOpen] = useState(false)
    const [openDup, setOpenDup] = useState(false)
    const inputFile = useRef(null) 
    
    
    useEffect(() => {
      const fetchData = async () => {
        
          let sessions = await getAllProblems()
          if(sessions.length>0){
            console.log(sessions.sort((a,b)=>a.problemId<b.problemId))
            console.log(sessions)
            setProblems(sessions)
          }
          
      }
  
      fetchData()
    }, [])
    
    const showFile = async (e) => {
        e.preventDefault()
        if(e.target.files != undefined){
            const reader = new FileReader()
            reader.onload = async (e) => { 
                const text = (e.target.result)
                console.log(text)
                let obj = JSON.parse(text);
                console.log(obj)
                setProblems(obj)
            };
            reader.readAsText(e.target.files[0])
        }
    }

    const downloadFile = () => {
        // create file in browser
        const fileName = "my-problems";
        const json = JSON.stringify(problems, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);
      
        // create "a" HTLM element with href to file
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();
      
        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    }
    const loadFile = () => {
        // create file in browser
        const fileName = "my-problems";
        const json = JSON.stringify(problems, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);
      
        // create "a" HTLM element with href to file
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();
      
        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    }

 
  const handleDeleteSession = async (index, session) => {
    if (window.confirm('Are you sure?')) {
        let updatedSessions = [...problems]
        updatedSessions.splice(index, 1)
        setProblems(updatedSessions)
        deleteProblem(session.problemId)
    }
  }

  const delay = (ms) => new Promise((res) => setTimeout(res, ms))

  const handleDuplicateSession = (newSession, oldSession) => {
        let newSess = newSession
        newSess.highlight = true
        setProblems([...problems, newSess])
        window.scrollTo(0, 0)
        delay(2000).then(()=>{
            delete newSess.highlight
            setProblems([...problems, newSess])
        })
        setOpenDup(false)
  }
  
  const handleAddSession = async (newSession) => {
    
    await addProblem(newSession)
    let sessions = await getAllProblems()
    console.log(sessions.sort((a,b)=>a.problemId<b.problemId))
    console.log(sessions)
    setProblems(sessions)
    setOpen(false)
  }

  const handleJoinSession = (session) => {
    setProblem(session)
    window.location.href = '/' 
  }

  
  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
    console.log(inputFile)
  };




  if (!problems) return null
  return (
    <div style={{padding:"50px"}}>
        <Typography variant='h3'>Problem List</Typography>
        <div
            className="flex-container"
            style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', marginBottom: '20px'}}>
            <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2, borderRadius: '5px'}}
            onClick={() => setOpen(true)}>
            Add Session
            </Button>
            <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2, borderRadius: '5px'}}
            onClick={() => downloadFile()}>
            Save Problems
            </Button>
            
            
            <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2, borderRadius: '5px'}}
            onClick={()=>inputFile.current.click()}>
            Load Problems
            <input style={{display:"none"}} ref={inputFile} type="file" onChange={(e) => showFile(e)} />
            </Button>
            <AddSessionDialog
            open={open}
            setOpen={setOpen}
            handleAddSession={handleAddSession}
            />
            <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
            </div>
        </div>
      
      <TableContainer>
        <Table >
          <TableBody >
            {problems.map((session, index) => (
              <>
                
                  <TableRow
                    key={index}
                    style={
                      session.highlight != null
                        ? { background: '#99d6a3', border: 'none' }
                        : { background: '#FFFFFF', border: 'none' }
                    }>
                    <TableCell sx={{textAlign:'right', width: '120px', borderColor:"ButtonHighlight", borderStyle:"solid solid solid solid",}}>
                        <div style ={{paddingTop:'10px'}}>
                            <Typography 
                            onClick={()=>{
                                setProblem(session)
                                setMode(0)
                            }}
                            sx={{marginBottom:"20px", display: "inline",cursor: "pointer", color: "#007bff", fontSize: "19px", fontWeight: 400,'&:hover': {color: "#0d3b79"}}} variant='h8'>{session.problemName}</Typography>
                            
                        </div>
                    
                    </TableCell>
                    
                    <TableCell className='no-right-border' sx={{ borderColor:"ButtonHighlight", borderStyle:"solid solid solid solid", }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Grid container spacing={2} direction="row">
                            <Grid item xs={10}>
                              <div className='subject' onClick={() => handleJoinSession(session)}>
                                {session.problemName}
                              </div>
                              <br />
                              {session.statement.split(" ").length > 30
                                ? session.statement.split(" ", 30).join(" ") + "..."
                                : session.statement}
                              <br />
                              <div style = {{fontWeight:"500"}}>
                                Answer: {session.answer}
                              </div>
                            </Grid>
                            <Grid item xs={2} sx={{ textAlign: 'right'}}>
                                  <Tooltip title="Delete Session">
                                    <IconButton
                                      color="error"
                                      onClick={() => handleDeleteSession(index,session)}>
                                      <Delete />
                                    </IconButton>
                                  </Tooltip>
                                  
                                  
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    
                    <br />
                    </TableCell>
                    
                  </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Session