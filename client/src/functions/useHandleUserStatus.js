/* 
NOTE - landing will eventually contain info for guests. LoggedIn redirects will eventually only be from LogIn/signUp page and not from "/", so guests can view the landing info. ??&**!!
1. if user is not logged in and on a sensitive page, redirect to landing.
2. if user is logged in and has no homes yet, redirect to /addHome. (should there be places a user with no homes can visit? ex. settings?)
3. if user is logged in, has a home, and on landing/LogIn, redirect to /calendar.
*/

import { useEffect, useContext } from "react"
import { useHistory, useRouteMatch } from 'react-router-dom'
import UserContext from '../UserContext'

const useHandleUserStatus = () => {
  const history = useHistory()
  const userContext = useContext(UserContext)
  const currentRoute = useRouteMatch().path
  const doesUserHaveHomes = userContext.user?.homes?.length > 0

  useEffect(() => {
    console.log('running useEffect in useHandleUserStatus')

    const isUserOnSafeScreen = ['/', '/login', '/signup'].includes(currentRoute)
    const canUserHaveNoHomes = ['/new-home', '/settings', '/account'].includes(currentRoute)

    //redirect to landing if not logged in
    if (!userContext.isLoggedIn) {
      //return isUserOnSafeScreen ? {} : history.push('/')
      if (isUserOnSafeScreen) {
        return console.log("user is not logged in, and is on a safe screen.")
      }
      else {
        console.log("user is not logged in, and on an unsafe screen. they will be redirected to /"); 
        return history.push("/")
      }
    }

    // redirect to new-home if logged in and has no homes yet
    if (!doesUserHaveHomes) {
      //return canUserHaveNoHomes ? {} : history.push('/new-home')
      if (canUserHaveNoHomes) {
        return console.log("user has no homes, but that's okay. they're on /new-home, /settings or /account.")
      }
      else {
        console.log("User has no homes but is trying to view a page requiring homes. they will be redirected to /new-home."); 
        return history.push("/new-home")
      }
    }

    // redirect to calendar if logged in, on landing/login/signup and has homes
    if (isUserOnSafeScreen) {
      console.log('user is logged in, on landing/login/signup and has homes. redirecting to /calendar')
      return history.push('/calendar')
    }
  
  }, [
    userContext.isLoggedIn, 
    userContext.isLoading,
    history, 
    doesUserHaveHomes, 
    userContext.user?.homes,
    currentRoute
  ])
}

export { useHandleUserStatus }