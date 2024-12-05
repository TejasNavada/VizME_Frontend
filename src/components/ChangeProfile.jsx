import React, { useContext, useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Slider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SvgIcon,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ProblemContext } from '../context/ProblemContext'
import { AuthContext } from '../context/AuthContext';
import { deleteUser, updateUser } from '../service/userService'
import { signOut } from '../service/authService';

const ChangeProfile = ({ open, setOpen }) => {
    

    const {currentUser, setCurrentUser} = useContext(AuthContext)
    const [newUser, setNewUser] = useState({
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        email: currentUser.email
    })
    useEffect(()=>{
        setNewUser({
            first_name: currentUser.first_name,
            last_name: currentUser.last_name,
            email: currentUser.email
        })
    },[currentUser])


    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value })
    }
    
    


    const handleCloseDialog = () => {
        setOpen(false)
        setNewUser({
            first_name: "",
            last_name: "",
            email: '',
        })
    }
    const handleSignOut = async () => {
        try {
          await signOut()
          // redirect to login page
          if(currentUser.role<3){
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
        <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Profile</DialogTitle>
        <DialogContent style={{ minHeight: '300px' }}>
            <TextField
            autoFocus
            margin="dense"
            name="first_name"
            label="First Name"
            type="text"
            fullWidth
            value={newUser.first_name}
            onChange={handleChange}
            />
            <TextField
            autoFocus
            margin="dense"
            name="last_name"
            label="Last Name"
            type="text"
            fullWidth
            value={newUser.last_name}
            onChange={handleChange}
            />
            <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Email"
            type="text"
            fullWidth
            value={newUser.email}
            onChange={handleChange}
            />
        </DialogContent>
        <DialogActions sx={{justifyContent:"space-between"}}>
            <Button variant="outlined"onClick={() => {
                deleteUser(currentUser.userId)
                handleSignOut()
                }} 
                color="primary">
                Delete Profile
            </Button>

            <div>
                <Button onClick={() => handleCloseDialog()} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => {
                    updateUser(currentUser.userId,newUser)
                    setOpen(false)
                }} color="primary">
                    Update
                </Button>
            </div>
            
        </DialogActions>
        </Dialog>
    )
}

export default ChangeProfile
