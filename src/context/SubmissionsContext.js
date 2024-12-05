import React, { createContext, useState, useContext, useEffect } from 'react'
import { subscribeSubmissions } from '../service/submissionService'
import { ProblemContext } from './ProblemContext'

export const SubmissionsContext = createContext()

export const SubmissionsProvider = ({ children }) => {
  const [submissions, setSubmissions] = useState([])
  const { problem } = useContext(ProblemContext)


  useEffect(() => {
    if(problem.problemId!=null){
      return subscribeSubmissions(problem.problemId, setSubmissions)
    }
  }, [problem])


  return (
    <SubmissionsContext.Provider value={{ submissions, setSubmissions }}>
      {children}
    </SubmissionsContext.Provider>
  )
}
