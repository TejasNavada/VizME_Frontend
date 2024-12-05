import axios from "axios"
import { socket } from "../tool/socketIO"
const submissionUrl = process.env.REACT_APP_HOST_API + "/submissions"
const problemUrl = process.env.REACT_APP_HOST_API + "/problems"

export const getSubmissionById = async (submissionId) => {
  if (!submissionId || submissionId === "") return null

  try {
    let response = await axios.get(submissionUrl + "/" + submissionId)
    console.log(response.data.submission)
    return response.data.submission
    
  } catch (error) {
    console.error(error)
    return null
  }
  
}


export const getUserSubmissions = async (problemId,userId) => {
  if (!problemId || problemId === "") return null

  let submissions = []
  await axios.get(submissionUrl + '/' + problemId + '/'+userId).then(response => {
    submissions = response.data.submissions
  }).catch(error => {
    console.error(error)
    return []
  })
  return submissions
}
export const getUserEquationsBySubId = async (submissionId) => {
  if (!submissionId || submissionId === "") return null

  let submissions = []
  await axios.get(submissionUrl + '/equation/' + submissionId).then(response => {
    submissions = response.data.submissions
  }).catch(error => {
    console.error(error)
    return []
  })
  return submissions
}

//gets all submissions in a session
export const getSessionSubmissions = async (problemId) => {
  if (!problemId || problemId === "") return null

  let submissions = []
  await axios.get(submissionUrl + '/problem/' + problemId).then(response => {
    submissions = response.data.submissions
  }).catch(error => {
    console.error(error)
    return []
  })
  return submissions
}

export const updateSubmission = async (submission) => {
  //console.log(submission)
  axios.post(submissionUrl, {
    submission: submission
  }).then(response => {
    return response.data
  }).catch(error => {
    console.error(error)
    return null
  })
}

export const createSubmission = async (problemId, userId, pass, error, equations) => {
    let sub = {
        problemId:problemId,
        userId:userId,
        pass:pass,
    }

    let submission = await axios.post(submissionUrl, {
        submission: sub,
        error:error,
        equations:equations
    })
    return submission.data.submission
}

export const createErr = (error) => {
  if (!error || error === "") return null
  const errorObject = {
    message: error.message,
    name: error.name,
    stack: error.stack,
  }
  return errorObject
}

//gets the most recent submission for each student in the session.
export const getSubmissionsByProblemId = async (problemId) => {
  if (!problemId || problemId === "") return null

  try {
    let submissions = []
    let response = await axios.get(problemUrl + '/' + problemId + '/submissions')
    console.log(response)
    submissions = response.data.submissions
    return submissions
    
  } catch (error) {
    console.log(error)
    return null
  }
  
}

export const subscribeSubmissions = (problemId, updateSubmissions) => {
  getSubmissionsByProblemId(problemId).then(submissions => {
    console.log(submissions)
    updateSubmissions(submissions)
  })

  socket.emit('subscribe submissions', problemId)

  const updateSubmissionHandler = (submission) => {
    console.log(submission)
    updateSubmissions((prevSubmissions) => {
      const submissionIndex = prevSubmissions.findIndex(s => s.userId === submission.userId)
      if (submissionIndex === -1) {
        if(prevSubmissions==null){
          return [submission]
        }
        return [...prevSubmissions, submission]
      } else {
        let newSubmissions = [...prevSubmissions]
        newSubmissions[submissionIndex] = submission
        //console.log(newSubmissions)
        return newSubmissions
      }
    })
  }

  socket.on('update submission', updateSubmissionHandler)

  return () => {
    socket.off('update submission', updateSubmissionHandler)
    socket.emit('unsubscribe submissions', problemId)
  }
}