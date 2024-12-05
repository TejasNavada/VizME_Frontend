import axios from "axios"
import { socket } from "../tool/socketIO"


const problemUrl = process.env.REACT_APP_HOST_API + "/problems"




export const getAllProblems = async () => {
	let problems
	await axios
		.get(problemUrl + "/")
		.then((response) => {
			problems = response.data.problems
		})
		.catch((error) => {
			throw error
		})
	return problems
}

export const getProblemById = async (id) => {
	if (!id) return null
	let problem
	await axios
		.get(problemUrl + "/" + id)
		.then((response) => {
			problem = response.data.problem
		})
		.catch((error) => {
			throw error
		})
	return problem
}

export const getVariablesByProblemId = async (id) => {
	if (!id) return null
	let problem
	await axios
		.get(problemUrl + "/variables/" + id)
		.then((response) => {
			problem = response.data.variables
		})
		.catch((error) => {
			throw error
		})
	return problem
}

export const updateProblemInSession = async (problemId, problem) => {
	if (!problemId || !problem) {
		return false
	}
	try {
		return await axios
			.put(problemUrl + "/" + problemId, {
				problem: problem,
			})
	}
	catch (error) {
		console.error(error)
		return false
	}
}



export const addProblem = async (newProblem) => {
	newProblem.problemType = "scalar"
    newProblem.enable_chat=true


	let problem = null
	await axios
		.post(problemUrl, {
			problem: newProblem,
		})
		.then((response) => {
			problem = response.data.problem
		})
		.catch((error) => {
			console.error(error)
		})

	return problem
}

export const deleteProblem = async (problemId) => {
	if (!problemId) return null
	try {
		let res = await axios.delete(problemUrl+"/"+problemId)
		console.log(res.data)
		return res.data
	} catch (e) {
		console.error(e)
	}
}

export const getSessionsByIds = async (sessionIds) => {
	if (!sessionIds) return []
	let sessions = []
	await axios
		.post(problemUrl + "/ids", {
			ids: sessionIds,
		})
		.then((response) => {
			sessions = response.data
		})
		.catch((error) => {
			console.error(error)
			return []
		})
	return sessions
}

export const setProblemEnableChat = async (problemId, enableChat) => {
	if (!problemId || enableChat === undefined) return false
	axios
		.put(problemUrl + "/" + problemId, {
			problem: {
				enable_chat: enableChat,
			},
		})
		.then((response) => {
			return response.data.problem[1][0].enable_chat
		})
		.catch((error) => {
			console.error(error)
			return false
		})
}

export const subscribeProblem = (problemId, updateProblem) => {
	//getProblemById(problemId).then((problem)=>updateProblem(problem))
	console.log("subscribing to problem",problemId)
	socket.emit("subscribe problem", problemId)

	socket.on("update problem", (res) => {
		console.log(res)
		updateProblem(res.data)
	})

	socket.on("disconnect", () => {
		//console.log("disconnected from session service")
	})

	const handleUpdateProblem = (res) => {
		console.log(res)
		updateProblem(res.data)
	}

	return () => {
		socket.off("update problem", handleUpdateProblem)
		socket.emit("unsubscribe problem", problemId)
	}
}
export const subscribeProblems = (updateProblems) => {
	//getProblemById(problemId).then((problem)=>updateProblem(problem))
	console.log("subscribing to problems")
	socket.emit("subscribe problems")

	socket.on("update problems", (res) => {
		console.log(res)

		updateProblems((prevProblems)=>{
			let problemIndex = prevProblems?.findIndex(g => g.problemId === res.data.problemId)
			if (problemIndex !== -1) {
				if (res.operation === "INSERT") {
					let newProblems = [...prevProblems]
					newProblems.push(res.data)
					return newProblems
				} else if (res.operation === "UPDATE") {
					let newProblems = [...prevProblems]
					newProblems[problemIndex] = res.data
					return newProblems
				} else if (res.operation === "DELETE") {
					let newProblems = [...prevProblems]
					newProblems.splice(problemIndex, 1)
					return newProblems
				}
			} else {
				if (res.operation === "INSERT") {
					let newProblems = [...prevProblems]
					newProblems.push(res.data)
					return newProblems
				}
				return prevProblems
			}
		})
	})

	socket.on("disconnect", () => {
		//console.log("disconnected from session service")
	})

	const handleUpdateProblems = (res) => {
		console.log(res)
		updateProblems(res.data)
	}

	return () => {
		socket.off("update problems", handleUpdateProblems)
		socket.emit("unsubscribe problems")
	}
}
