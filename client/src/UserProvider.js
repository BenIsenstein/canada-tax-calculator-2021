import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import UserContext from './UserContext'

const UserProvider = ({ children }) => {
  const history = useHistory()
  const redirectHome = () => history.push('/calendar')
  const [user, setUser] = useState()
  const [userName, setUserName] = useState('loading')
  const [userType, setUserType] = useState()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const setUserInfo = (userInfo) => {
    let { firstName, lastName, userType } = userInfo

    setUser(userInfo)
    setUserName(firstName + ' ' + lastName)
    setUserType(userType)
  }

  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        let response = await fetch('/api/user/getloggedinuser')
        let userObject = await response.json()

        if (userObject.no_user) {
          setIsLoading(false)
          return setUserName("no_user")
        }

        // fetch for all homes here before concatenating with the userObject
        let homesRes = await fetch(`/api/home/getbyuser/${userObject._id}`)
        let homesArray = await homesRes.json()
        userObject.homes = homesArray
        
        setUserInfo(userObject)
        setIsLoggedIn(true)
        setIsLoading(false)
      }
      catch (err) {
        console.log('error running checkLoggedInUser: ', err)
        alert("There was an error checking your login status. We're fixing it as fast as we can.")
      }
    }

    getLoggedInUser()
  }, [history])

  const logIn = async (data) => {
    let loginOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }

    let response = await fetch('/api/auth/login', loginOptions)

    if (response.status === 401) return alert('Unable to log in. Please make sure your email has been confirmed and your login info is correct.')
    
    let loggedInUser = await response.json()

    // fetch for all homes here before concatenating with loggedInUser
    let homesRes = await fetch(`/api/home/getbyuser/${loggedInUser._id}`)
    let homesArray = await homesRes.json()
    loggedInUser.homes = homesArray
    
    setUserInfo(loggedInUser)
    setIsLoggedIn(true)
    
    //history.push(`/calendar`)
  }

  const logOut = async () => {
    try {
      let response = await fetch("/api/user/logout")
      let resObject = await response.json()

      if (resObject.isLoggedOutNow) {
        setIsLoggedIn(false)
        setUser(undefined)
        setUserName('no_user')
        setUserType(undefined)

        //history.push(`/`)  
      }
      else {
        alert('You are still logged in for some reason. Please try logging out again.')
      }
    }
    catch (err) {
      console.log(`Error logging out user ${userName}: `, err)
      alert("There was an error logging you out. We're fixing it as fast as we can.")
    }
  }

  let contextValue = {
    user,
    userName,
    userType,
    isLoggedIn,
    isLoading,
    logIn,
    logOut,
    setUserInfo,
    setUser
  }

  return (
    <UserContext.Provider value={contextValue}>
      {!isLoading && children}
    </UserContext.Provider>
  )
}

export default UserProvider