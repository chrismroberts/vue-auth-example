import decode from 'jwt-decode'
import axios from 'axios'

const REST_ENDPOINT = 'http://localhost:3000/'
const AUTH_TOKEN_KEY = 'authToken'

export function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        axios({
            url: `${REST_ENDPOINT}api/v1/auth/token`,
            method: 'POST',
            data: {
                username: username,
                password: password,
                grant_type: 'password'
            }
        }).then((res) => {            
            setAuthToken(res.data.token)
            resolve()
        }).catch((err) => {
            console.error('Caught an error during login:', err)
            reject(err)
        })
    })
}

export function logoutUser() {
    clearAuthToken()
}

export function setAuthToken(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY)    
}

export function clearAuthToken() {
    axios.defaults.headers.common['Authorization'] = ''
    localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function isLoggedIn() {
    let authToken = getAuthToken()
    return !!authToken && !isTokenExpired(authToken)
}

export function getUserInfo() {
    if (isLoggedIn()) {
        return decode(getAuthToken())
    }
}

function getTokenExpirationDate(encodedToken) {
    let token = decode(encodedToken)
    if (!token.exp) {
        return null
    }
  
    let date = new Date(0)
    date.setUTCSeconds(token.exp)
  
    return date
}
  
function isTokenExpired(token) {
    let expirationDate = getTokenExpirationDate(token)
    return expirationDate < new Date()
}