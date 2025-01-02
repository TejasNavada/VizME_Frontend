import axios from 'axios'
import Cookies from 'js-cookie'
const url = process.env.REACT_APP_HOST_API
// Retrieve token from cookies
const token = Cookies.get('VizME_token');

// Set Axios defaults globally

console.log(token)
if (token!=null && token!="undefined") {
  
  console.log(token)
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const signInWithEmailAndPassword = async (email, password) => {
  const user = {
    email: email,
    password: password
  }
  let newToken
  try {
    let res = await axios.post(url + '/login', {
      email: email,
      password: password
    })
    console.log(res)
    newToken = res.data.token
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    if (newToken!=null && newToken!="undefined") {
      Cookies.set('VizME_token', newToken, { expires: 1 })
    }
    
  } catch (e) {
    console.error(e)
    throw e
  }
  return newToken
}

export const validateToken = async (token) => {
  let instructor
  try {
    instructor = await axios.get(url + '/validate')
  } catch (error) {
    console.error(error)
    return null
  }
  return instructor.data
}














export const signOut = async () => {
  Cookies.remove('VizME_token')
  Cookies.remove('VizME_userId')
  return true
}
