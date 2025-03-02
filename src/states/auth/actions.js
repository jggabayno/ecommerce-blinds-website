import makeRequest from '../../services/request'
import { LOGIN_LOADING, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT} from './types'

export const signUp = async (user, {message, navigate, form, setIsSigningUp}) => {
    setIsSigningUp(true)
   try {
    const response = await makeRequest(process.env.REACT_APP_API_URL).post('signup/', {...user, user_type_id: 3})
    const data = await response.data   
        if (data) {
            message.success('You are registered successfully')
            setTimeout(() => {navigate('/login')}, 2000)
            setIsSigningUp(false)
        }
   } catch(error) {
       
    const errors = error.response.data.errors
    
    setIsSigningUp(false)

    if (errors.hasOwnProperty('email')) {
        form.setFields([{ name: 'email', errors: ['Email has already been taken']}])
    }
    if (errors.hasOwnProperty('mobile_number')) {
        form.setFields([{ name: 'mobile_number', errors: ['Mobile Number has already been taken']}])
    }

   }
 
}

const loginAndGetInfo = async (credentials) => {
    const response = await makeRequest(process.env.REACT_APP_API_URL).login('login/', {...credentials, user_type_id: 3})
    return await response.data   
}

export const login = (credentials, navigate) => {
    return async dispatch => {
        dispatch(loginLoading());
        try {
            const loginInfo = await loginAndGetInfo(credentials)
            dispatch(loginSuccess(loginInfo))
            sessionStorage.setItem('SESSION', loginInfo.token)
            sessionStorage.setItem('USER', JSON.stringify(loginInfo.user))
            navigate('/')
        } catch{
            dispatch(loginFailure());
        }
    }
}

export const logout = (navigate) => {
    sessionStorage.removeItem('SESSION')
    sessionStorage.removeItem('USER')
    navigate('/')
    return ({type: LOGOUT})
}

export const loginLoading = () => ({type: LOGIN_LOADING})
export const loginSuccess = (payload) => ({ type: LOGIN_SUCCESS, payload})
export const loginFailure = () => ({type: LOGIN_FAILURE})