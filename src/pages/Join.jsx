import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Home from './Home'
import "../css/login.scss"
import { generateName } from '../tool/nameGenerator'
import { registerStudent } from '../service/userService'
import Cookies from 'js-cookie'
import { Button } from "@mui/material"
import { getUserByEmail } from "../service/userService"
import { signInWithEmailAndPassword, validateToken } from '../service/authService'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ProblemContext } from '../context/ProblemContext'
import CircularProgress from '@mui/material/CircularProgress';

const Join = () => {
  const { id } = useParams()
  const [err, setErr] = useState(false)
  const {currentUser, setCurrentUser } = useContext(AuthContext)
  const { loading } = useContext(ProblemContext)
  const [mode, setMode] = useState(0)
  const [visible, setVisible] = useState(true)

  

  useEffect(()=>{
    validateToken("").then((user)=>{
      console.log(user)
      if (user) {
        setCurrentUser(user)
        if(id==null){
          //window.location.href = '/'
        }
        //window.location.href = '/problem/' + id
      }
    })
      
  },[])

  

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target[0].value
    const password = e.target[1].value
    console.log(email)
    try {
      let token = await signInWithEmailAndPassword(email, password)
      console.log(token)
      let user = await validateToken(token)
      console.log(user)
      if (user) {
        setCurrentUser(user)
        if(id==null){
          //window.location.href = '/'
        }
        //window.location.href = '/problem/' + id
      }
        
    } catch (err) {
      let stu = await getUserByEmail(email)
      if(stu != null){
        setErr("Incorrect Password")
      }
      else{
        setErr("Account with this email does not exist")
      }
      console.log(err)
      if (err.response?.status === 500) {
        console.log(err.response)
      } else {
      }
      console.error(err)
    }
    
    
  }


  const handleRegister = async (e) => {
    e.preventDefault()
    const email = e.target[0].value
    const password = e.target[1].value
    const password2 = e.target[2].value
    console.log(email)
    console.log(password)
    console.log(password2)
    if(password === password2){
      if(password.length<6){
        setErr("Password should be at least 6 characters")
        return
      }
      try {
        const fakeName = generateName()
          let user = {
            first_name: fakeName,
            last_name: '',
            email: email,
            password: password,
            userRole:3
          }
          const newUser = await registerStudent(user)
          console.log(newUser)
          if (newUser != null && newUser != "Account with this email already exists") {
            let token = await signInWithEmailAndPassword(email, password)
            console.log(token)
            let user = await validateToken(token)
            //setCurrentUser(newUser)
            console.log(id)
            if (user) {
              setCurrentUser(user)
              if(id==null){
                //window.location.href = '/'
              }
              //window.location.href = '/problem/' + id
            }
            //window.location.href = '/problem/' + id
          } else {
            setErr(newUser)
            //showToast('Fail to join session', 'error')
          }
          
      } catch (err) {
        console.log(err)
        if (err.response?.status === 500) {
          console.log(err.response)
        } else {
        }
        console.error(err)
      }
    }
    else{
      setErr("Passwords don't match")
    }
    
  }
  const handleRegisterChange = async (e) => {
    e.preventDefault()
    console.log(e)
    e.target = e.target.form
    const email = e.target[0].value
    const password = e.target[1].value
    const password2 = e.target[2].value
    console.log(email)
    console.log(password)
    console.log(password2)
    if(password === password2){
      if(password.length<6){
        setErr("Password should be at least 6 characters")
        return
      }
      else if(!email.includes("@")){
        setErr("Please include an '@' in the email address.")
      }
      else if( err == "Passwords don't match" || err == "Password should be at least 6 characters" || err == "Please include an '@' in the email address."){
        setErr("")
      }
      
    }
    else{
      setErr("Passwords don't match")
    }
    
  }

  const handleRegisterBlur = async (e) => {
    e.preventDefault()
    console.log(e)
    e.target = e.target.form
    const email = e.target[0].value
    const password = e.target[1].value
    const password2 = e.target[2].value
    console.log(email)
    console.log(password)
    console.log(password2)
    let stu = await getUserByEmail(email)
    console.log(stu)
    if(stu != null){
      
      setErr("Account with this email already exist")
    }
    else if( err == "Account with this email already exist"){
      setErr("")
    }
    
  }

  const handleSubmitChange = async (e) => {
    e.preventDefault()
    e.target = e.target.form
    console.log(e)
    const email = e.target[0].value
    const password = e.target[1].value
    console.log(email.includes("@"))
    if(!email.includes("@")){
      console.log("hello")
      setErr("Please include an '@' in the email address. '")
    }
    else if (err !="Account with this email does not exist"){
      setErr("")
    }
    
    
  }
  const handleSubmitBlur = async (e) => {
    e.preventDefault()
    e.target = e.target.form
    console.log(e)
    const email = e.target[0].value
    const password = e.target[1].value
    console.log(email.includes("@"))
    
    let stu = await getUserByEmail(email)
    console.log(stu)
    if(stu != null){
      setErr("")
    }
    else{
      setErr("Account with this email does not exist")
    }
    
    
  }

  return currentUser&&!loading? <Home /> : (
    <div>
      { mode === 0 && (
        <div className="formContainer">
          <div className="formWrapper">
            <span className="logo">VizME</span>
            <form className='loginForm'>
              <div style={{display:"block"}} className='loginButton'>
              <Button 
              onClick={()=>setMode(1)}
              >Create Account</Button>
              

            </div>
            <Button 
            onClick={()=>setMode(2)}
            >Sign In</Button>
            
            </form>
          </div>
        </div>
      )}
      {mode === 1 && (
        <div className="formContainer">
        <div className="formWrapper">
          <span className="logo">VizME</span>
          <form onSubmit={handleRegister} onChange={handleRegisterChange} onBlur={handleRegisterBlur} >
            <input type="email" placeholder="email" required />
            <div style={{display:"flex",alignItems:"center"}}>
              <input type={visible?"password":"text"} placeholder="password" required />
              {visible && (
                <VisibilityIcon 
                sx={{paddingBottom:".75em",paddingLeft:".5em"}}
                onClick={()=>setVisible(false)}
                />
              )}
              {!visible && (
                <VisibilityOffIcon 
                sx={{paddingBottom:".75em",paddingLeft:".5em"}}
                onClick={()=>setVisible(true)}
                />
              )}
            </div>
            <div style={{display:"flex",alignItems:"center"}}>
              <input type={visible?"password":"text"} placeholder="re-type password" required />
              {visible && (
                <VisibilityIcon 
                sx={{paddingBottom:".75em",paddingLeft:".5em"}}
                onClick={()=>setVisible(false)}
                />
              )}
              {!visible && (
                <VisibilityOffIcon 
                sx={{paddingBottom:".75em",paddingLeft:".5em"}}
                onClick={()=>setVisible(true)}
                />
              )}
            </div>
            <button type="submit">
              Create Account
            </button>
            <button 
              type="button" 
              onClick={() => setMode(0)}>
              Back
            </button>
            {err && <span>{err}</span>}
          </form>

        </div>
      </div>
      )} 
      {mode === 2 && (
        <div className="formContainer">
        <div className="formWrapper">
          <span className="logo">VizME</span>
          <form onSubmit={handleSubmit} onChange={handleSubmitChange} onBlur={handleSubmitBlur}>
            <input type="email" placeholder="email" />
            <div style={{display:"flex",alignItems:"center"}}>
              <input type={visible?"password":"text"} placeholder="password" required />
              {visible && (
                <VisibilityIcon 
                sx={{paddingBottom:".75em",paddingLeft:".5em"}}
                onClick={()=>setVisible(false)}
                />
              )}
              {!visible && (
                <VisibilityOffIcon 
                sx={{paddingBottom:".75em",paddingLeft:".5em"}}
                onClick={()=>setVisible(true)}
                />
              )}
            </div>
            <button type="submit" >Sign In</button>
            <button 
              type="button" 
              onClick={() => setMode(0)}>
              Back
            </button>
            {err && <span>{err}</span>}
          </form>
        </div>
      </div>
      )}
      
    </div>
    
    
  )
}

export default Join
