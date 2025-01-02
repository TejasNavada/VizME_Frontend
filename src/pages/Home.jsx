import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Session from "../components/Session"
import Chat from '../components/Chat'
import Problem from '../components/Problem'
import {AuthContext} from '../context/AuthContext'
import { Typography, Button, ButtonGroup, Tooltip, Switch } from '@mui/material'
import { ProblemContext } from '../context/ProblemContext'
import Cookies from 'js-cookie'
import { validateToken, signOut } from '../service/authService'
import { setProblemEnableChat } from '../service/problemService'
import { getUserById } from '../service/userService'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ChangeProfile from '../components/ChangeProfile'
import { SubmissionsProvider } from '../context/SubmissionsContext'
import Report from "../components/Report"

const Home = React.memo(() => {
    const { currentUser, setCurrentUser } = useContext(AuthContext)
    const [open, setOpen] = useState(false)
    const { problem, setProblem, problems, setProblems, mode, setMode } = useContext(ProblemContext)
    const navigate = useNavigate()

    
  
    useEffect(() => {
      console.log(currentUser)
      if (currentUser !== null) return
      if (Cookies.get('VizME_token')) {
        const token = Cookies.get('VizME_token')
        console.log(token)
        validateToken(token)
          .then((user) => {
            if (user) {
              setCurrentUser(user)
            }
            else{
              navigate('/login')
            }
          })
          .catch((err) => {
            console.error(err)
            navigate('/login')
          })
      } else {
        
        let userId = Cookies.get('VizME_userId')
        console.log(userId)
        if (userId){
          getUserById(userId).then(async (res) => {
            console.log(res)
            if (res) {
              setCurrentUser(res)
            }
            else{
              navigate('/login')
            }
          })
        }
        else{
          navigate('/login')
        }
      }
    }, [])

    const handleSignOut = async () => {
      try {
        await signOut()
        // redirect to login page
        if(currentUser.userRole<3){
          window.location.href = '/login'
        }
        else{
          window.location.href = window.location.href
        }
      } catch (err) {
        console.error('Failed to sign out:', err)
      }
    }


  return (
        <div>
          {problem!=null?(
              <div  style={{display:"flex"}}>
                <div style={{overflowY:"auto", height:"100vh",display:"flex",flexDirection:"column",scrollbarWidth:"none", flex:1,backgroundColor:"ButtonShadow",borderRightWidth:"1px",borderColor:"ButtonHighlight", borderStyle:"none solid none none",paddingLeft: "20px", paddingRight: "20px"  }}>
                  <div >
                    <Typography onClick={()=>{
                      if(currentUser.userRole<3){
                        setProblem(null)
                      }
                    }} sx={{marginBottom:"20px"}} variant='h6'>Problem Exercises</Typography>
                    <ButtonGroup fullWidth variant="text" orientation="vertical" aria-label="Vertical button group">
                        {problems.toReversed().map((value)=>(
                          <Button color="inherit" onClick={() => setProblem(value)}>
                              <Typography sx={{color:value.problemId==problem.problemId?"blue":"black"}} >{value?.problemName}</Typography>
                          </Button>
                        ))}
                    </ButtonGroup>
                  </div>
                  <div style={{marginTop:"auto"}}>
                    <div >
                      {currentUser.userRole<3 &&(
                        <Tooltip sx={{display:"flex"}} title="Enable Chat">
                          <div style={{display:"flex"}}>
                            <Typography sx={{marginY:"auto"}}>Enable Chat</Typography>
                            <Switch
                            sx={{marginY:"auto"}}
                            checked={problem.enable_chat}
                            onChange={() => setProblemEnableChat(problem.problemId,!problem.enable_chat)}
                            name="loading"
                            color="primary"
                            />
                          </div>
                        </Tooltip>
                      )}
                      
                    </div>
                    <div style={{display:"flex"}}>
                      <Button color="inherit" onClick={handleSignOut}>
                        <Typography >Sign Out</Typography>
                      </Button>
                      <Tooltip sx={{display:"flex", marginY:"auto"}} title="Profile Settings">
                        <AccountBoxIcon onClick={()=>setOpen(true)}/>
                      </Tooltip>
                      <ChangeProfile
                      open={open}
                      setOpen={setOpen}
                      ></ChangeProfile>
                    </div>
                  </div>
                </div>
                {currentUser.userRole<3 && (
                  <>
                    <div style={{flex:4}}>
                      <SubmissionsProvider>
                        <Report/>
                      </SubmissionsProvider>
                    </div>
                    <div style={{flex:3}}>
                      <Chat
                      send={true}
                      />
                  </div>
                  </>
                  
                )}
                {currentUser.userRole==3 && (
                  <>
                    <div style={{flex:problem.enable_chat?4:7}}>
                      <Problem/>
                    </div>
                    {problem.enable_chat && (
                      <div style={{flex:3}}>
                        <Chat
                        send={true}
                        />
                      </div>
                    )}
                  </> 
                )}
                
              </div>
          ):(
              <Session/>
          )}
      
                      
        </div>
    
    
  )
})

export default Home
