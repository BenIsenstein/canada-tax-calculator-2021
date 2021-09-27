import { useState, useContext, useEffect, useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import UserContext from '../UserContext'
import stringRandomizer from './stringRandomizer'
//import { useGetAllInfo } from './useGetAllInfo'

const useFetchAddEntry = () => {

  // let updateICS = useUpdateICS()

  const fetchAddEntry = async (data) => {
    try {
      let action = "/api/calendarEntry/add"
      let options = {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
      }
      let res = await fetch(action, options)
      let resObject = await res.json()

      if (!resObject.success) alert("Your entry wasn't added for some reason. Please try again.")
      // else {
      //   await updateICS()
      // }
    }
    catch (err) {
      console.log('error adding calendar entry: ', err)
      alert("There was an error adding your entry. We're fixing it as fast as we can.")
    }
  }

  return fetchAddEntry
}

//updateEntry
const useUpdateEntry = () => {
  const { id } = useParams()
  const history = useHistory()
  let fetchAddEntry = useFetchAddEntry()
  //let updateICS = useUpdateICS()
  
  const updateEntry = async (data) => {
    try {
      // only add a recurring entry if it hasn't been completed before
      if (data.dateCompleted && !data.completed) {
        await fetchAddEntry(data.newCalendarEntry)

        data.completed = true
      }

      let options = {
        method: "put",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
      }
      let res = await fetch(`/api/calendarEntry/update/${id}`, options)
      let resObject = await res.json()

      if (!resObject.success) return alert("Your entry wasn't updated for some reason. Please try again.")
      //await updateICS()
      history.goBack()
    }
    catch (err) {
      console.log('error updating calendar entry: ', err)
      alert("There was an error updating your entry. We're fixing it as fast as we can.")
    }
  }

  return updateEntry

}

// addEntry
const useAddEntry = () => {
  const history = useHistory()
  let fetchAddEntry = useFetchAddEntry()

  const addEntry = async (data) => {
    data.completed = false

    await fetchAddEntry(data)

    history.push(`/calendar`)
  }

  return addEntry
}

const useDeleteEntry = () => { 
  let history = useHistory()
  //let updateICS = useUpdateICS()

  const deleteEntry = async (entryId) => {
    try {
      let options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }
      let response = await fetch(`/api/calendarEntry/delete/${entryId}`, options)
      if (!response) return console.log("Error on DELETE method.")
  
      let resObject = await response.json()
      if (!resObject.success) return alert("Your entry wasn't deleted for some reason. We're working on it.")
    
      // Deletion was successful. redirect back to calendar.
      //await updateICS() // Update user's ICS file
      history.push(`/calendar`)      
    }
    catch (err) {
      console.log("Problem DELETING entry!")
    }
  }

  return deleteEntry
}

// addHome
const useAddHome = () => {
  const history = useHistory()
  const userContext = useContext(UserContext)
  const [taskInfo, setTaskInfo] = useState([])
  let fetchAddEntry = useFetchAddEntry()
  //let updateICS = useUpdateICS()

  useEffect(() => {
    const getAllInfo = async () => {
      // console.log('calling getAllInfo')
      try {
        let response = await fetch("/api/info")
        let allTasksArray = await response.json()
        setTaskInfo(allTasksArray)
      }
      catch (err) {
        console.log("There was an error loading your table", err)
      }
    }

    getAllInfo()

    // return () => console.log("getAllInfo effect - unmounting!")
  }, [])

  const addHome = useCallback(async (data) => {
    data.activated = true
    let addHomeObject

    try {
      let action = "/api/home/add"
      let options = {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
      }
      let addHomeRes = await fetch(action, options)
      addHomeObject = await addHomeRes.json()
      data._id = addHomeObject.homeId

      console.log('addHomeObject: ', addHomeObject)

      if (!addHomeObject.success) return alert("Your home wasn't added for some reason. Please try again.")
      
      userContext.setUser(user => data && { ...user, homes: [...user.homes, data] })
    }
    catch (err) {
      console.log('error adding calendar entry: ', err)
      return alert("There was an error adding your entry. We're fixing it as fast as we can.")
    }


    // add default entries based on industry standards from info table
    let selectedItems = Object.keys(data.homeItems).filter(key => data.homeItems[key])

    let relevantTasks = [
      ...taskInfo.filter(task => selectedItems.includes(task.item)),
      ...data.customTasks || []
    ]

    let newCalendarEntries = relevantTasks.map(taskObject => {

      let defaultDate = new Date()

      defaultDate.setDate(parseInt(defaultDate.getDate()) + parseInt(taskObject.frequency))

      return {
        completed: false,
        userId: data.userId,
        homeId: addHomeObject.homeId,
        homeIcon: addHomeObject.homeIcon, 
        item: taskObject.item,
        task: taskObject.task,
        notes: "",
        start: defaultDate.setHours(12, 0, 0),
        end: defaultDate.setHours(13, 0, 0)
      }
    })

    for (let newEntry of newCalendarEntries) await fetchAddEntry(newEntry)

    // update user's ICS file
    //await updateICS()

    if (userContext.user.homes?.length > 0) { // Only navigate to ACCOUNT page if this is the user's FIRST home
      history.goBack()
    }
    else {
      history.push(`/calendar`)
    }

  }, [history, taskInfo, userContext])

  return addHome
}

// // update Home
// const useUpdateHome = () => {
//   const { id } = useParams()
//   const history = useHistory()
//   const userContext = useContext(UserContext)
//   const deleteEntry = useDeleteEntry()
//   const fetchAddEntry = useFetchAddEntry()
//   //const defaultTasks = useGetAllInfo()
//   //let updateICS = useUpdateICS()

//   const updateHome = async (data) => {
//     // - - - DEAL WITH NEWLY SELECTED AND UNSELECTED ITEMS - - - //
//     try {
//       // fetch all calendar entries for current authenticated user
//       let entriesRes = await fetch(`/api/calendarEntry/getbyuser/${userContext.user?._id}`)
//       let entriesObject = await entriesRes.json()
      
//       //fetch for the home in its former state
//       let homeRes = await fetch(`/api/home/get/${id}`)
//       let homeObject = await homeRes.json()
      
//       //variables 
//       let entriesList = entriesObject.entryList.filter(entry => entry.homeId === id)
//       let oldHomeItems = homeObject.homeItems
//       let newHomeItems = data.homeItems
//       // console.log("updateHome | oldHomeItems: ", oldHomeItems)
//       // console.log("updateHome | newHomeItems: ", newHomeItems)

//       let oldCustomTasks = homeObject.customTasks || []
//       let newCustomTasks = data.customTasks || []
//       // console.log("updateHome | oldCustomTasks: ", oldCustomTasks)
//       // console.log("updateHome | newCustomTasks: ", newCustomTasks)
   
//       //do a diff comparison between old and new custom tasks
//       let customTasksNewlyAdded = newCustomTasks.filter(newTask => !oldCustomTasks.find(oldTask => oldTask.item===newTask.item && oldTask.task===newTask.task))
//       let customTasksNewlyRemoved = oldCustomTasks.filter(oldTask => !newCustomTasks.find(newTask => newTask.item===oldTask.item && newTask.task===oldTask.task))
//       // console.log("updateHome | customTasksNewlyAdded: ", customTasksNewlyAdded)
//       // console.log("updateHome | customTasksNewlyRemoved: ", customTasksNewlyRemoved)

//       //do a diff comparison between old and new selected items
//       let itemsNewlySelected = Object.keys(newHomeItems).filter(itemName => newHomeItems[itemName] && !oldHomeItems[itemName])
//       let itemsNewlyUnselected = Object.keys(oldHomeItems).filter(itemName => oldHomeItems[itemName] && !newHomeItems[itemName])
//       // console.log("updateHome | itemsNewlySelected: ", itemsNewlySelected)
//       // console.log("updateHome | itemsNewlyUnselected: ", itemsNewlyUnselected)

//       //add all tasks for the items now selected, and custom tasks added
//       //let selectedItemsTasks = defaultTasks.filter(task => itemsNewlySelected.includes(task.item))
//       //let allTasksToAdd = [...selectedItemsTasks, ...customTasksNewlyAdded]
//       // console.log("updateHome | allTasksToAdd: ", allTasksToAdd)

//       allTasksToAdd.forEach(async (task) => {
//         // console.log("")
//         // console.log("")
//         // console.log(`updateHome | adding calendarEntry for task: "${task.item} - ${task.task}"`)
        
//         let recurrenceDate = new Date()
//         // console.log("updateHome | recurrenceDate first init: ", recurrenceDate)
//         // console.log("updateHome | task.frequency: ", task.frequency)
//         // console.log("updateHome | recurrenceDate.getDate(): ", recurrenceDate.getDate())
//         // console.log("updateHome | parseInt(recurrenceDate.getDate()) + parseInt(task.frequency): ", parseInt(recurrenceDate.getDate()) + parseInt(task.frequency))


//         recurrenceDate.setDate(parseInt(recurrenceDate.getDate()) + parseInt(task.frequency))
//         // console.log("updateHome | recurrenceDate after adding frequency: ", recurrenceDate)

//         const entry = { 
//           userId: userContext.user?._id,
//           homeId: id,
//           item: task.item,
//           task: task.task,
//           completed: false,
//           homeIcon: data.homeIcon,
//           start: recurrenceDate.setHours(12, 0, 0),
//           end: recurrenceDate.setHours(13, 0, 0)
//         }

//         await fetchAddEntry(entry)
//       })
      
//       //delete all tasks for the items now unchecked, and custom tasks removed
//       let unselectedItemsEntries = entriesList.filter(entry => itemsNewlyUnselected.includes(entry.item))
//       let removedCustomTasksEntries = entriesList.filter(entry => customTasksNewlyRemoved.find(task => task.item===entry.item && task.task===entry.task))
//       let entriesToDelete = [...unselectedItemsEntries, ...removedCustomTasksEntries]
      
//       entriesToDelete.forEach(async (entry) => {
//         // console.log(`updateHome | deleting calendarEntry for task: "${entry.item} - ${entry.task}"`)
//         await deleteEntry(entry._id)
//       })  
//     }  
//     catch (err) {
//       console.log('error submitting new calendar entries: ', err)
//       alert("There was an error updating your home details. We're fixing it as fast as we can.")
//     }

//     // - - - UPDATE THE HOME DOCUMENT - - - //
//     // console.log("updating home now")

//     try {
//       let options = {
//         method: "put",
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify(data)
//       }
//       let res = await fetch(`/api/home/update/${id}`, options)
//       let resObject = await res.json()

//       if (!resObject.success) return alert("Your home details wasn't updated for some reason. Please try again.")
      
//       // update user's ICS file
//       await updateICS()

//       history.goBack()
//     }
//     catch (err) {
//       console.log('error updating home: ', err)
//       alert("There was an error updating your home details. We're fixing it as fast as we can.")
//     }

//   }

//   return updateHome
// }

// updateAccount submit function
const useUpdateAccount = () => {
  const history = useHistory()
  const userContext = useContext(UserContext)

  const updateAccount = async (data) => {
    try {
      let isEmailChanged = data.email !== userContext.user.email
      let authAction = `/api/auth/update/${userContext.user._id}`
      let userAction = `/api/user/update/${userContext.user._id}`
      let method = 'put'
      let headers = { "content-type": "application/json" }
      let body

      // if the user wants to change their email, start by updating their auth record
      // the only values in the request body are the new email and new dateLastModified
      if (data.email && isEmailChanged) {
        body = JSON.stringify({ email: data.email, dateLastModified: new Date() })

        // send auth update request
        let authRes = await fetch(authAction, { method, headers, body })
        let authObject = await authRes.json()

        // return if the auth update was unsuccessful
        if (!authObject.success) return alert("Your entry wasn't updated for some reason. Please try again.")
      }
      // redefine body with all of the form data
      body = JSON.stringify(data)

      // send user update request
      let userRes = await fetch(userAction, { method, headers, body })
      let userObject = await userRes.json()

      // if the update was unsuccessful, reverse the email change made to the auth document
      if (!userObject.success) {
        if (data.email && isEmailChanged) {
          body = JSON.stringify({ email: userContext.user.email })
          let authCorrection = await fetch(authAction, { method, headers, body })
          let correctionObject = await authCorrection.json()

          // return if the auth correction was unsuccessful
          if (!correctionObject.success) return alert("Your entry update failed halfway through. Please contact customer service.")
        }
      }
      else { // All updates have been successful, continue with rest of instruction.
        // Preserve the original email before userContext gets updated.
        let oldEmail = userContext.user.email

        // make sure the data for context update includes _id and dateSignedUp
        // set all context to match the account changes and redirect 
        for (let key of ['dateSignedUp', '_id']) data[key] = userContext.user[key]

        // Preserve HOMES list prior to updating userContext
        let tempUserData = { ...userContext.user }
        data.homes = tempUserData.homes

        userContext.setUserInfo(data)

        // Before redirecting user back to the Calendar page, consider
        // whether or not Email Address has changed. If it has, we need to
        // interrupt the regular user flow and 'disable' the user account
        // until the new email address can be verified as legitimate.

        if (data.email && isEmailChanged) {
          // DELETE the old SendInBlue Contact
          //await deleteSiBContact(oldEmail)
          // Generate a random activation code
          let randomString = stringRandomizer(10)
          // Update the user's AUTH document with new activation code and 'disable' the account by setting the 'confirmed' property to FALSE.
          let apiRoute = `/api/auth/update/${userContext.user._id}`
          const headers = { "content-type": "application/json" }
          let method = 'put'
          let body = JSON.stringify({ confirmCode: randomString, confirmed: false })

          // send auth update request
          let authUpdateRes = await fetch(apiRoute, { method, headers, body })
          let authUpdateObject = await authUpdateRes.json()

          if ((authUpdateObject.success) && (authUpdateRes.status == 200)) {
            console.log("Successfully disabled user account to wait for validation of new email address!")

            // Send confirmation email to user via SendInBlue
            let action = "/api/sendEmail/user"  // For the GROUP email API Endpoint, replace 'user' with 'group'
            let options = {
              method: 'post',
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                "type": "emailChange",  // TYPE is choice of: 'test', 'reminder', 'welcome', 'emailChange', 'overdue'.
                "email": `${data.email}`,
                "userid": `${userContext.user._id}`,
                "firstname": `${userContext.user.firstName}`,
                "activationcode": `${randomString}`
              })
            }
            console.log("Sending API request with options = ", options)
            console.log("userContext = ", userContext)
            try {
              let res = await fetch(action, options)
              let resObject = await res.json()
              console.log("Response from server = ", resObject)
              if (!resObject.success) alert("Your call to the sendEmail API failed for some reason. Please try again.")
            }
            catch (err) {
              console.log('error calling sendEmail API: ', err)
              alert("There was an error calling the sendEmail API. We're fixing it as fast as we can.")
            }

            // Log the user out
            userContext.logOut()

            // Send user to the WELCOME page while we await their email confirmation
            history.push("/welcome")
          }
          else console.log("Failed to update AUTH document to disable account because of email change.")

        }
        else {
          history.push("/calendar")
        }
      }
    }
    catch (err) {
      console.log('error updating account: ', err)
      alert("There was an error updating your account. We're fixing it as fast as we can.")
    }
  }
  return updateAccount
}

const useChangePassword = () => {
  const history = useHistory()
  const userContext = useContext(UserContext)

  const changePassword = async (data) => {
    try {
      const options = {
        method: 'put',
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, username: userContext.user?.email })
      }

      let passwordRes = await fetch('/api/auth/change-password', options)

      if (passwordRes.status === 401) return alert("Verification failed. Please make sure your password is correct.")

      let passwordObject = await passwordRes.json()

      if (!passwordObject.success) return alert("Your password failed to update for some reason. We're working on it.")

      alert("Your password was successfully changed.")
      history.push('/calendar')
    }
    catch (err) {
      console.log('error updating password: ', err)
      alert("Something went wrong.")
    }
  }

  return changePassword
}

export {
  useUpdateAccount,
  useChangePassword,
  useAddEntry,
  useUpdateEntry,
  useDeleteEntry,
  useAddHome,
  //useUpdateHome
}
