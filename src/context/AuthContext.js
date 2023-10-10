// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import { Auth } from 'aws-amplify'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)
const ValidateUser = process.env.NEXT_PUBLIC_SESSION_DEATAILS
const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = JSON.parse(localStorage.getItem('userCognito')).accessToken.jwtToken
    const refreshToken = JSON.parse(localStorage.getItem('userCognito')).refreshToken.token
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        setLoading(true)
        const user = await Auth.currentAuthenticatedUser()
        console.log(user)
        const response = await axios.post(ValidateUser, {
          requestType:"ValidateUser",
          userName:user.attributes.email
      })
      const UserData =  Object.assign(response.data, {ability:[
        {
      action :'manage',
      subject : 'all'
    }
    ], 
    role:'admin',accessToken : JSON.stringify(accessToken) , refreshToken : JSON.stringify(refreshToken)})
          if (UserData) { 
            setLoading(false)
            console.log(UserData.data)
            setUser({ ...UserData})
          }
          else {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            } 
            console.log('is aiht')
          }
      } else {
        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleLogin = (params, errorCallback) => {
    const accessToken = JSON.parse(localStorage.getItem('userCognito')).accessToken.jwtToken
    const refreshToken = JSON.parse(localStorage.getItem('userCognito')).refreshToken.token
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        window.localStorage.setItem(authConfig.onTokenExpiration, refreshToken)
        params.rememberMe
          ? window.localStorage.setItem(authConfig.storageTokenKeyName, accessToken)
          : null
        const returnUrl = router.query.returnUrl
        console.log(response.data.data)
        const UserData =  Object.assign(response.data.data, {ability:[
          {
        action :'manage',
        subject : 'all'
      }
      ], 
      role:'admin',accessToken : JSON.stringify(accessToken) , refreshToken : JSON.stringify(refreshToken)})
        console.log(JSON.stringify(UserData))
        setUser({ ...UserData })
        console.log('login')
        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(UserData)) : null
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }