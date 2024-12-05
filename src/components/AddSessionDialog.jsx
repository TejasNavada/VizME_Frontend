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

const AddSessionDialog = ({ open, setOpen, handleAddSession }) => {
  const { problem, setProblem, problems, setProblems, mode, setMode  } = useContext(ProblemContext)
  const [newSession, setNewSession] = useState({
    problemName: "",
    image: "",
    statement: '',
    answer: 0,
    feedback:"",
    variables:[],
  })


  const handleChange = (e) => {
    setNewSession({ ...newSession, [e.target.name]: e.target.value })
  }
  
  const handleVariableChange = (e,i) => {
    console.log(e)
    let newVars = [...newSession.variables]
    newVars[i] = {...newSession.variables[i], [e.target.name]: e.target.value}
    setNewSession({ ...newSession, ["variables"]: newVars })
  }
  const addVar = () => {
    let newVars = [...newSession.variables]
    newVars.push({var_name:"var"+newVars.length})
    setNewSession({ ...newSession, ["variables"]: newVars })
  }
  const removeVar = (i) => {
    let newVars = [...newSession.variables]
    newVars.splice(i,1)
    setNewSession({ ...newSession, ["variables"]: newVars })
  }


  const handleCloseDialog = () => {
    setOpen(false)
    setNewSession({
      problemName: "",
      image: "",
      statement: '',
      answer: 0,
      feedback:"",
      variables:[],
    })
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Add New Problem</DialogTitle>
      <DialogContent style={{ minHeight: '300px' }}>
        <TextField
          autoFocus
          margin="dense"
          name="problemName"
          label="Name"
          type="text"
          fullWidth
          value={newSession.name}
          onChange={handleChange}
        />
        <TextField
          autoFocus
          margin="dense"
          name="image"
          label="Image Link"
          type="text"
          fullWidth
          value={newSession.image}
          onChange={handleChange}
        />
        <TextField
          autoFocus
          margin="dense"
          name="statement"
          label="Task"
          type="text"
          fullWidth
          multiline
          rows={6}
          value={newSession.statement}
          onChange={handleChange}
        />
        <Button
        onClick={addVar}
        endIcon={<AddIcon />}
        >Add Variable</Button>
        <div>
          {newSession.variables.map((variable,i)=>(
            <div style={{display:"flex"}}>
              
              <TextField
                autoFocus
                margin="dense"
                name="var_name"
                label="Variable Name"
                type="text"
                value={variable.var_name}
                onChange={(e)=>handleVariableChange(e,i)}
              />
              {variable.type == null && (
                <FormControl margin="dense" fullWidth variant="outlined" className="form-control">
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                
                  className="type-select"
                  labelId="type-label"
                  value={variable.type}
                  onChange={(e)=>handleVariableChange(e,i)}
                  name="type"
                  label="Type">
                  <MenuItem value={'Constant'}>Constant</MenuItem>
                  <MenuItem value={'Random'}>Random</MenuItem>
                  <MenuItem value={'Equation'}>Equation</MenuItem>
                  {/* 
                  <MenuItem value={'Peer Instruction'}>Peer Instruction</MenuItem> */}
                </Select>
              </FormControl>
              )}
              {variable.type == "Constant" && (
                <TextField
                sx={{maxWidth:"75px"}}
                autoFocus
                margin="dense"
                name="constant"
                label="Value"
                type="number"
                value={variable.min}
                onChange={(e)=>handleVariableChange(e,i)}
              />
              )}
              {variable.type == "Random" && (
                <>
                  <TextField
                    autoFocus
                    margin="dense"
                    name="min"
                    label="Min"
                    type="number"
                    value={variable.min}
                    onChange={(e)=>handleVariableChange(e,i)}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    name="max"
                    label="Max"
                    type="number"
                    value={variable.max}
                    onChange={(e)=>handleVariableChange(e,i)}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    name="step"
                    label="Step"
                    type="number"
                    value={variable.step}
                    onChange={(e)=>handleVariableChange(e,i)}
                  />
                </>
              )}
              {variable.type == "Equation" && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg"  width="1em" height="4.5em" viewBox="0 0 24 24"><path fill="black" d="M19 10H5V8h14zm0 6H5v-2h14z"/></svg>
                  <TextField
                    fullWidth
                    autoFocus
                    margin="dense"
                    name="equation"
                    label="Equation"
                    type="text"
                    value={variable.equation}
                    onChange={(e)=>handleVariableChange(e,i)}
                  />
                </>
                
              )}
              <RemoveIcon
              sx={{marginY:"auto",marginX:"10px"}}
              color="error"
              onClick={()=>removeVar(i)}
              />
            </div>
            
          
          ))}
        </div>
        
        <TextField
          autoFocus
          margin="dense"
          name="answer"
          label="Answer"
          type="text"
          fullWidth
          value={newSession.answer}
          onChange={handleChange}
        />
        <TextField
          autoFocus
          margin="dense"
          name="feedback"
          label="Custom Feedback"
          type="text"
          fullWidth
          multiline
          rows={6}
          value={newSession.feedback}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleCloseDialog()} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleAddSession(newSession)} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddSessionDialog
