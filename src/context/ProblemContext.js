import React, { useContext, useEffect, useState } from "react";
import pic from "../icon/138.png"
import {getVariablesByProblemId, getAllProblems, subscribeProblem, subscribeProblems } from "../service/problemService"
import { AuthContext } from "./AuthContext";
const fs = require('fs');


export const ProblemContext = React.createContext();

export const ProblemProvider = ({ children}) => {
	const [problem, setProblem] = useState(null);
	const [problemId, setProblemId] = useState(0);
	const [problems, setProblems] = useState([])
    const {currentUser} = useContext(AuthContext)
	const [ mode, setMode ] = useState(0)
    const [feedback,setFeedback] = useState(false)
    const [variables, setVariables] = useState([])
    const [loading,setLoading] = useState(true)
    
    useEffect(()=>{
        if(currentUser!=null){
            setLoading(true)
            getAllProblems().then((probs)=>{
                console.log(probs)
                setProblems(probs)
                if(probs.length>0){
                    setProblem(probs[probs.length-1])
                }
                subscribeProblems(setProblems)
                setLoading(false)
            }) 
        }
    },[currentUser])

    useEffect(()=>{
        if(problem?.problemId!=null && problemId!=problem?.problemId){
            console.log(problem?.problemId)
            setProblemId(problem?.problemId)
            getVariablesByProblemId(problem.problemId).then((vars)=>{
                console.log(vars)
                setVariables(vars)
            })
            return subscribeProblem(problem?.problemId, setProblem)
        }

    },[problem])


	

	

	return (
		<ProblemContext.Provider value={{ problem, setProblem, problems, setProblems, mode, setMode, feedback, setFeedback, variables, setVariables, loading,setLoading }}>
			{children}
		</ProblemContext.Provider>
	);
};
