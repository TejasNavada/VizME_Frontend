import avatar from "../icon/default_avatar.png";
const nerdamer = require("nerdamer/all.min")
var gen = require('random-seed');

export const getDateString = (timestamp) => {
	if (!timestamp) return null;

	let date = null;
	if (typeof timestamp === "object" && "seconds" in timestamp) {
		date = new Date(timestamp.seconds * 1000);
		// //console.log("Object")

	} else if (typeof timestamp === "string") {
		date = new Date(timestamp);
		// //console.log("String")
		// //console.log(date);
	}


	const now = new Date();
	const diff = now - date;
	const days = diff / (1000 * 60 * 60 * 24);
	if (days > 7) {
		return date.toLocaleDateString();
	} else if(days < 1){
		return "Today";
	}else {
		return date.toLocaleDateString("en-US", { weekday: "long" });
	}
};
export const replaceTaskWithVar = (task,variables,seed) =>{
	try {
		if(seed==null){
			return task
		}
		console.log(seed)
		console.log(variables)
		var rand = gen(seed);
		let str = task
		let eqIdx = []
		let equations = []
		for(let i = 0; i < variables.length; i++){
			let value=""
			if(variables[i].constant!=null){
				value = variables[i].constant
			}
			else if(variables[i].min!=null){
				value = Math.round(rand.floatBetween(variables[i].min, variables[i].max) / variables[i].step) * variables[i].step
			}
			else if(variables[i].equation!=null){
				eqIdx.push(i)
				equations.push(variables[i].var_name+"="+variables[i].equation)
				continue;
			}
			
			equations.push(variables[i].var_name+"="+value)
			str = str.replace(variables[i].var_name,value)
		}
		if(eqIdx.length>0){
			nerdamer.set('SOLUTIONS_AS_OBJECT', true)
			console.log(equations)
			var sol = nerdamer.solveEquations(equations);
			for(let i = 0; i < eqIdx.length; i++){
				str = str.replace(variables[eqIdx[i]].var_name,sol[variables[eqIdx[i]].var_name])
			}
		}
		return str
		
	} catch (error) {
		return task
	}
	
}

export const getTimeString = (timestamp) => {
	let date = new Date(timestamp);
	return date.toLocaleString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
	});
};

export const getAvatar = (url) => {
	if (url && url !== "") return url;
	else return avatar;
};
