import axios from "axios"
const userUrl = process.env.REACT_APP_HOST_API + '/users'

export const registerStudent = async (user) => {
  if (!user) {
    //console.log("can't update")
    return false
  }
  try {
    let res = await axios.post(process.env.REACT_APP_HOST_API + '/register', user)
    console.log(res)
    return res.data
  }
  catch (err) {
    console.log(err)
    return null
  }
}

export const getUserById = async (id) => {
	if (!id) return null

	let res = null
	try {
		const response = await axios.get(userUrl + "/" + id)
		res = response.data
		return res
	} catch (error) {
		console.error(error)
		throw null
	}
}

export const getUserByEmail = async (email) => {
	if (!email) return null

	try {
		const response = await axios.get(userUrl + "/email/"+email)
		return response
	} catch (error) {
		console.error(error)
		return null
	}
}

export const updateUser = async (userId, user) => {
	if (!user) return null
	let res = false
	await axios
		.put(userUrl + "/" + userId, user )
		.then((response) => {
			res = true
		})
		.catch((error) => {
			console.error(error)
		})
	return res
}

export const deleteUser = async (userId) => {
	if (!userId) return null
	try {
		let res = await axios.delete(userUrl+"/"+userId)
		console.log(res.data)
		return res.data
	} catch (e) {
		console.error(e)
	}
}
  
export const getUserStats = async (id) => {
	if (!id) return null
	console.log(id)
	let res = null
	try {
		const response = await axios.get(userUrl + "/stats/" + id)
		res = response.data
		console.log(response)
		return res
	} catch (error) {
		console.error(error)
		throw error
	}
}