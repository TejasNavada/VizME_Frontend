import React, { useContext, useEffect, useState } from "react";
import { ProblemContext } from "./ProblemContext";
import { AuthContext } from "./AuthContext";
import { getMessagesByProblemAndUser, subscribeMessageByProblemAndUser } from "../service/chatService";
import { getUserStats } from "../service/userService";

export const MessageContext = React.createContext();

export const MessageProvider = ({ children}) => {
	const [messages, setMessages] = useState([]);
	const {problem} = useContext(ProblemContext);
	const {currentUser} = useContext(AuthContext);
	const [listenTo, setListenTo] = useState(null);
	const [stats, setStats] = useState([]);

	useEffect(()=>{
		if(currentUser?.userId && problem?.problemId && currentUser?.userRole==3){
			return subscribeMessageByProblemAndUser(problem.problemId,currentUser.userId,setMessages)
		}
		if(currentUser?.userId && problem?.problemId && currentUser?.userRole<=3){
			setMessages([])
			setStats([])
			setListenTo(null)
		}
	
	},[problem,currentUser])
	useEffect(()=>{
		if(listenTo!=null){
			getUserStats(listenTo).then((results)=>{
				console.log(results)
				results.sort((a,b)=>a.problemId<b.problemId)
				setStats(results)
			})
			return subscribeMessageByProblemAndUser(problem.problemId,listenTo,setMessages)
		}
	
	},[listenTo])
	

	return (
		<MessageContext.Provider value={{ messages, setMessages, listenTo, setListenTo, stats, setStats }}>
			{children}
		</MessageContext.Provider>
	);
};
