import OpenAI from "openai";
import axios from 'axios'
import { socket } from "../tool/socketIO"
const messageUrl = process.env.REACT_APP_HOST_API + "/chat"


export const sendMessage = async (problemId, sender_id, receiver_id, content) => {
	if (!content || content === "" || !problemId || !sender_id || !receiver_id)
		return null
	const messageData = {
		problemId: problemId,
		sender_id: sender_id,
		receiver_id: receiver_id,
		content: content,
	}
	
    try {
        let response = await axios.post(messageUrl +"/", {
            problemId: problemId,
            sender_id: sender_id,
            receiver_id: receiver_id,
            content: content,
            created_time: Date.now()
        })
        console.log(response)
        return response.data
    } catch (error) {
        console.log(error)
    }
	
}

export const getMessagesByProblem = async (problemId) => {
	try {
		const response = await axios.get(messageUrl + "/problem/" + problemId)
		return response.data
	} catch (error) {
		//console.log(error)
	}
}
export const getMessagesByProblemAndUser = async (problemId,userId) => {
    console.log(problemId +", "+ userId)
	try {
		const response = await axios.get(messageUrl + "/problem/" + problemId+"/user/"+userId)
        console.log(response)
		return response.data
	} catch (error) {
		console.log(error)
	}
}



export const sendMessageToAI = async (messages) => {
    
    try {

        let response = await axios.post(process.env.REACT_APP_HOST_API + "/chat"+"/ai", messages)

        
        
        
        return response.data
    } catch (error) {
        console.error("Error in AI processing:", error);
    }
}
export const subscribeMessageByProblemAndUser = (problemId, userId, updateMessages) => {
	//getProblemById(problemId).then((problem)=>updateProblem(problem))
	console.log("subscribing to messages",problemId,userId)
    getMessagesByProblemAndUser(problemId,userId).then((messages)=>{
        console.log(messages)
        if(messages.length>0){
            updateMessages(messages)
        }
    })
	let result = socket.emit("subscribe message",{ problemId: problemId, userId: userId })
    console.log(result)
	socket.on("update message", (res) => {
		console.log(res)
		
        updateMessages((prevMessages)=>{
			if(res.operation == 'UPDATE'){
				let messageIndex = prevMessages?.findIndex(g => g.messageId === res.data.messageId)
				if (messageIndex !== -1) {
					let newMessages = [...prevMessages]
					newMessages[messageIndex] = res.data
					return newMessages
				} 
			}
			else if (res.operation === 'DELETE') {
				let messageIndex = prevMessages?.findIndex(g => g.messageId === res.data.messageId)
				if (messageIndex !== -1) {
					let newMessages = [...prevMessages]
					newMessages.splice(messageIndex, 1)
					return newMessages
				} 
				
			}
			else if (res.operation == 'INSERT'){
				return [...prevMessages,res.data]
			}
            
		})
	})

	socket.on("disconnect", () => {
		//console.log("disconnected from session service")
	})


	return () => {
		socket.off("update message")
		socket.emit("unsubscribe message",{ problemId: problemId, userId: userId })
	}
}