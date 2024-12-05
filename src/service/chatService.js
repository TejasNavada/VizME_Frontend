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
	console.log("message sent",messageData)
    try {
        let response = await axios.post(messageUrl, messageData)
        return response.data.message
    } catch (error) {
        console.log(error)
    }
	
}

export const getMessagesByProblem = async (problemId) => {
	try {
		const response = await axios.get(messageUrl + "/problem/" + problemId)
		return response.data.messages
	} catch (error) {
		//console.log(error)
	}
}
export const getMessagesByProblemAndUser = async (problemId,userId) => {
	try {
		const response = await axios.get(messageUrl + "/problem/" + problemId+"/user/"+userId)
		return response.data.messages
	} catch (error) {
		//console.log(error)
	}
}



export const sendMessageToAI = async (messages, newMessage,imageURL,task,problemId,userId) => {
    if(messages.length<2 || messages[0].content!="You will help a student in their Mechanical Engineering task: "+task){
        messages = [
            {
                "role":"system",
                "content": "You will help a student in their Mechanical Engineering task: "+task,
            },
            {
                "role": "user", 
                "content": [
                    {"type": "text", "text": newMessage},
                    {
                      "type": "image_url",
                      "image_url": {
                        "url": imageURL,
                        "detail": "low"
                      },
                    },
                  ],
                "sender_id": userId,
                "receiver_id": 1,
                "problemId": problemId,
            }
        ];
    }
    try {

        let response = await axios.post(process.env.REACT_APP_HOST_API + "/chat"+"/ai", {
            messages:messages
        })

        
        
        console.log(response);
        let toReturn = [...messages,response.data.message]
        await sendMessage(problemId,1,userId,response.data.message.content)
        return toReturn
    } catch (error) {
        console.error("Error in AI processing:", error);
    }
}
export const subscribeMessageByProblemAndUser = (problemId, userId, updateMessages) => {
	//getProblemById(problemId).then((problem)=>updateProblem(problem))
	console.log("subscribing to messages",problemId,userId)
    getMessagesByProblemAndUser(problemId,userId).then((messages)=>{
        console.log(messages)
        updateMessages(messages)
    })
	socket.emit("subscribe message", problemId, userId)

	socket.on("update message", (res) => {
		console.log(res)
        updateMessages((prevMessages)=>{
            return [...prevMessages,res.data]
		})
	})

	socket.on("disconnect", () => {
		//console.log("disconnected from session service")
	})


	return () => {
		socket.off("update message")
		socket.emit("unsubscribe message", problemId, userId)
	}
}