import { SuperFormSelect } from './GroupOfInputs'
import { useEffect, useState, useContext, useMemo } from 'react'
import UserContext from '../../UserContext'

// It needs register to plug into SuperForm.
// register will take care of itself if you include 
// 'isCustomComponent=true' with this input in SuperForm.
const UserHomesSelect = props => {
  const [homeOptions, setHomeOptions] = useState([{value: 'loading...'}])
  const userContext = useContext(UserContext)
  const { setValue } = props

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        let homesRes = await fetch(`/api/home/getbyuser/activated/${userContext.user._id}`)
        let homesArray = await homesRes.json()

        //successful fetch check

        setHomeOptions(homesArray.map(home => {return {value: home._id, optionText: home.nickname || home.address}}))
        setValue('homeId', homesArray[0]._id)
      }
      catch (err) {
        alert("There was an error searching the homes registered to this user. We're working on it.")
        console.log(err)
      }
    }

    fetchHomes()

  }, [userContext.user._id, setValue])

  return <SuperFormSelect options={homeOptions} {...props} />
}

const HomeItemsSelect = (props) => {
    const [itemOptions, setItemOptions] = useState([{value: 'loading...'}])
    const { setValue, name, watch } = props
    const homeId = watch("homeId")
    
    useEffect(() => {
        if (homeId === 'loading...') return
        if (['', undefined].includes(homeId)) return setItemOptions([{value: watch(name)}])
       
        let isMounted = true 
        const fetchHomes = async () => {
            try {
              setItemOptions([{value: 'loading...'}])
              let homeRes
              let homeObject
              let itemsObject
              let itemsArray
              
              if (isMounted) {
                homeRes = await fetch(`/api/home/get/${homeId}`)
                homeObject = await homeRes.json()
                itemsObject = homeObject?.homeItems
                itemsArray = Object.keys(itemsObject)?.filter(key => itemsObject[key])  // an array of strings that produce truthy values in the itemsObject. ie - they were checked on adding the home.
              }

              // successful fetch check??

              if (isMounted) {
                setItemOptions(itemsArray.map(item => {return { value: item }}))
                if (props.isAddMode) setValue(name, itemsArray[0])
              }
            }
            catch (err) {
                alert("There was an error searching the items registered to this home. We're working on it.")
                console.log(err)
            }
        }
        fetchHomes()

        return () => isMounted = false

    }, [homeId, name, props.isAddMode, setValue, watch])
    
    return <SuperFormSelect options={itemOptions} {...props} />
}

const useItemTasksSelect = () => {
  const [homeId, setHomeId] = useState()
  const [itemName, setItemName] = useState()
  const [taskName, setTaskName] = useState()
  const [selectedTask, setSelectedTask] = useState()
  const [defaultTaskList, setDefaultTaskList] = useState([])
  const [customTaskList, setCustomTaskList] = useState([])
  const fullTaskList = useMemo(() => [...defaultTaskList, ...customTaskList], [defaultTaskList, customTaskList])
  const [taskOptions, setTaskOptions] = useState([{value: 'loading...'}])

  // effect to fire on mount, storing default task info in a piece of state
  useEffect(() => {
    const getDefaultInfo = async () => {
      try {
        let defaultTasksRes = await fetch("/api/info")
        let defaultTasksArray = await defaultTasksRes.json()
        setDefaultTaskList(defaultTasksArray)
      }
      catch (err) {
        console.log("There was an error loading your table", err)
      }
    }

    getDefaultInfo()

   return () => console.log("getDefaultInfo effect - unmounting!")
  }, [])

  // effect that fetches for a home's custom tasks whenever homeId changes 
  useEffect(() => {
    if (homeId === 'loading...') return
    if (['', undefined].includes(homeId)) return setCustomTaskList([])
     
    let isMounted = true 
    const fetchHomes = async () => {
      try {
        setCustomTaskList([])
        let homeRes
        let homeObject
        let tasksArray

        if (isMounted) {
          homeRes = await fetch(`/api/home/get/${homeId}`)
          homeObject = await homeRes.json()
          tasksArray = homeObject?.customTasks
        }

        // successful fetch check??

        if (isMounted) {
          setCustomTaskList(tasksArray)
        }
      }
      catch (err) {
        alert("There was an error searching the items registered to this home. We're working on it.")
        console.log(err)
      }
    }
    fetchHomes()

    return () => {isMounted = false; console.log("fetching new custom tasks effect - unmounting!")}

  }, [homeId])

  // effect that filters for relevant tasks whenever itemName changes
  useEffect(() => {
    let isMounted = true

    if (isMounted) {
      setTaskOptions([{value: 'loading...'}])

      const relevantTasks = fullTaskList.filter(task => task.item === itemName)

      setTaskOptions(relevantTasks.map(task => {return { value: task.task }}))
    }

    return () => {isMounted = false; console.log("filtering for relevant tasks effect - unmounting!")}

  }, [fullTaskList, itemName])

  // effect to set 'selectedTask' whenever user selects a new task, changing 'taskName'
  useEffect(() => {
    const currentTask = fullTaskList.find(task => 
      (task.item === itemName) && 
      (task.task === taskName)
    )

    console.log("Effect inside ItemTasksSelect to set selectedTask object. currentTask: ", currentTask)

    setSelectedTask(currentTask)

    return () => console.log("setSelectedTask effect - unmounting!")

  }, [fullTaskList, itemName, taskName])

  const ItemTasksSelect = (props) => {
    const { setValue, name, watch, isAddMode } = props

    const watchedHomeId = watch("homeId")
    useEffect(() => {
      console.log("homeId: ", watchedHomeId)
      setHomeId(watchedHomeId)

      return () => console.log("setHomeId effect - unmounting!")

    }, [watchedHomeId])

    const watchedItemName = watch("item")
    useEffect(() => {
      console.log("itemName: ", watchedItemName)
      setItemName(watchedItemName)

      return () => console.log("setItemName effect - unmounting!")

    }, [watchedItemName])

    const watchedTaskName = watch(name)
    useEffect(() => {
      console.log("taskName: ", watchedTaskName)
      setTaskName(watchedTaskName)

      return () => console.log("setTaskName effect - unmounting!")

    }, [watchedTaskName])

    useEffect(() => {
      const shouldSetTaskValue = (
        isAddMode && 
        (
          ['', undefined, null, 'loading...'].includes(watchedTaskName) ||  // current task name has no meaningful value OR
          !taskOptions.map(task => task.value).includes(watchedTaskName)    // current task carried over from previous item, and is not in the current item's task list
        )
      )

      console.log("shouldSetTaskValue: ", shouldSetTaskValue)

      if (shouldSetTaskValue) {
        setValue(name, taskOptions[0]?.value)
        console.log("setTaskValue effect fired")
      }

      return () => console.log('isAddMode effect - unmounted!')

    }, [isAddMode, name, setValue, watchedTaskName])
  
    return <SuperFormSelect options={taskOptions} {...props} />
  }

  return {
    homeId,
    selectedTask,
    ItemTasksSelect
  }
}

export default UserHomesSelect
export { HomeItemsSelect, useItemTasksSelect }