import { Fragment, useState, useEffect, useMemo } from 'react'
import { FlexSection, GridSection, Input, Select, Li, Button, AddIcon, StyledDateTimePicker } from '../../common'
import { useIsDateInput } from '../../functions'
import CustomItemModal, { DeleteItemModal, EditItemModal } from '../Modals/CustomItemModal'
import DatetimePickerModal from '../Modals/DatetimePickerModal'
import ComplexInput from './ComplexInput'

// all props not in the component code are passed to the outside GridSection.

const GroupOfInputs = ({
  inputs, 
  isAddMode,
  isDetailsMode,
  isDetailsView,
  isEditView,
  areDetailsLoaded,
  register,
  unregister,
  setValue,
  watch,
  errors,
  getValues,
  setResetValues,
  ...props }) => {
  // - - - - - - hooks/variables - - - - - - - //
  const isDateInput = useIsDateInput()
  const modeAndView = {
    isAddMode,
    isDetailsMode,
    isDetailsView,
    isEditView,
    areDetailsLoaded
  }
  const formTools = {
    register,
    unregister,
    setValue,
    watch,
    errors,
    getValues,
    setResetValues
  }

  useEffect(() => () => console.log('GroupOfInputs unmounted!'), [])

  // - - - - - - - RETURN JSX - - - - - - - - //
  return <GridSection fullWidth {...props}>
    {inputs && inputs.map((input, index) => {
      if (!input) return null

      const { name, readOnly } = input

      // every input other than date-types
      if (!isDateInput(name)) return ( 
        <ComplexInput 
          key={index}
          name={name}
          readOnly={isDetailsMode ? (isDetailsView || readOnly) : readOnly}
          {...formTools}
          {...modeAndView}
          {...input} 
        />
      )
        
      // date-type input
      return (isDetailsMode && isDetailsView) || readOnly
        ? <ComplexInput 
          key={index} 
          name={name}
          readOnly 
          {...formTools} 
          {...modeAndView}
          {...input}
        />  
        : (
          <FlexSection 
            key={index} 
            gridColumn={input.wrapperProps?.gridColumn || "1/-1"} 
            {...input.wrapperProps} 
            fullWidth
          >
            <ComplexInput  
              name={name}
              as={(dateProps) => <StyledDateTimePicker
                disableCalendar
                disableClock
                onChange={e => setValue(name, e)}
                value={watch(name)}
              />}    
              {...formTools}
              {...modeAndView}
              {...input}
            />
            <DatetimePickerModal  
              modalTitle={input.modalTitle || "set " + (input.labelText || name)}
              name={name} 
              margin="0 0 0 5px"
              iconButton 
              {...formTools}
              {...modeAndView}
              {...input}
            />
          </FlexSection>
        )
    })}
  </GridSection>
}

const GroupOfCheckboxes = ({
  // GroupOfCheckboxes needs to have 'isCustomComponent' set to true
  inputs, 
  detailsUrl,
  homeId,
  defaultCheckboxNames,
  isAddMode,
  isDetailsMode,
  isDetailsView,
  isEditView,
  areDetailsLoaded,
  register,
  unregister,
  setValue,
  watch,
  errors,
  getValues,
  setResetValues,
  name: groupName,
  ...props }) => {
  // - - - - - - hooks/variables - - - - - - - //
  const modeAndView = {
    areDetailsLoaded,
    isAddMode,
    isDetailsMode,
    isDetailsView,
    isEditView
  }
  const formTools =  {
    setValue, 
    register,
    unregister,
    watch,
    errors,
    getValues
  }
  const isAddingOrEditing = (isAddMode || isEditView)
  const makeItemName = (name) => name.split('.')[1]

  const [customItems, setCustomItems] = useState([])
  const allItems = useMemo(() => [...inputs, ...customItems], [inputs, customItems])
  
  // useEffect(() => console.log("customItems: ", customItems), [customItems])
  // useEffect(() => console.log("allItems: ", allItems), [allItems])

  //const allDefaultTasks = useGetAllInfo()
  const [allCustomTasks, setAllCustomTasks] = useState([])

  // useEffect(() => console.log("allDefaultTasks: ", allDefaultTasks), [allDefaultTasks])
  // useEffect(() => console.log("allCustomTasks: ", allCustomTasks), [allCustomTasks])

  useEffect(() => () => console.log('GroupOfCheckboxes unmounting!'), [])

  // Effect to conditionally bring in entry and populate fields
  useEffect(() => {
    if (!isDetailsMode || !homeId) return
    
    let isMounted = true 
    const getDetails = async () => {
      if (!isMounted) return

      try {
        let customItemValuesForReset = {}

        // fetch details to call 'setCustomItems'
        let homeDetailsRes = await fetch(detailsUrl)
        let homeDetails = await homeDetailsRes.json()

        // function to find the value of an input field, no matter how nested the name is.
        // breaks nested input names down by dot notation, but works for non-nested input values as well.
        const findValInDetails = (name) => name?.split('.')?.reduce((curVal, curKey) => curVal && curVal[curKey], homeDetails)

        // make sure items that fall outside of the checkbox group's 
        // "defaultCheckboxNames" - ie. they were added by the user -  become a part of 
        // the 'customItems' state array sitting in the component.
        let customItemsToSet = Object.keys(homeDetails[groupName])
          .filter(key => !defaultCheckboxNames?.includes(key))
          .map(key => {return { name: `${groupName}.${key}`, isCustomItem: true }})

        setCustomItems(customItemsToSet)

        customItemsToSet.forEach(({ name }) => {
          console.log(`setting custom item ${name} to ${findValInDetails(name)}`)
          setValue(name, findValInDetails(name))
          customItemValuesForReset[name] = findValInDetails(name)
        })

        setResetValues(prevState => {return { ...prevState, ...customItemValuesForReset }})

        console.log('customTasks: ', homeDetails.customTasks)
        setAllCustomTasks(homeDetails.customTasks)


      }
      catch(err) {
        console.log(err)
        alert("There as an error loading your home's items. We're working on it as fast as we can.")
      }   
    }

    getDetails()

    return () => isMounted = false

  }, [detailsUrl, homeId])
  
  // declare checkbox names such that their data ends up in an object, 
  // accessible with the name of the parent <GroupOfCheckboxes />
  const DefaultCheckbox = ({ readOnly, name, ...rest }) => <ComplexInput 
    noFullWidth
    name={name}
    labelText={makeItemName(name)}
    type="checkbox"
    readOnly={isDetailsMode ? (isDetailsView || readOnly) : readOnly}
    wrapperProps={{rowReverse: true, justifyEnd: true}}
    {...formTools}
    {...modeAndView}
    {...rest} 
  />

  const DefaultCheckboxAndTasks = (rest) => {
    const [editedTask, setEditedTask] = useState()
    const [editedFrequency, setEditedFrequency] = useState()
    const isBoxChecked = watch(rest.name)
    const itemName = makeItemName(rest.name)

    return <Fragment key={rest.index}>
      <DefaultCheckbox {...rest} name={rest.name} /> 
      {isBoxChecked && 
      <FlexSection gridColumn="1/-1">
        <FlexSection margin="0 0 0 15px">
          {/* {allDefaultTasks
            .filter(task => task.item === itemName)
            .map((task, index) => <Li margin="0 20px 0 0" key={index}>{task.task}: {task.frequency} days</Li>)
          } */}
          {allCustomTasks
            .filter(task => task.item === itemName)
            .map((task, index) => <Fragment key={index}>
              <Li margin="0 20px 0 0">{task.task}: {task.frequency} days</Li>
              <EditItemModal 
                modalContent={<>
                  <p>Editing {`${task.item} - ${task.task}`}</p>
                  <ComplexInput placeholder={task.task} {...modeAndView} onChange={event => setEditedTask(event.target.value)} labelText="task" />
                  <ComplexInput placeholder={task.frequency} {...modeAndView} onChange={event => setEditedFrequency(event.target.value)} labelText="frequency (days)" type="number" />
                </>}
                actionOnConfirm={() => {
                  unregister(`customTasks.${index}`)
                  setAllCustomTasks(prevState => prevState.map(prevTask => prevTask.task === task.task ? { ...prevTask, task: (editedTask || prevTask.task), frequency: (editedFrequency || prevTask.frequency) } : prevTask))
                }}
              />
              <DeleteItemModal 
                {...task}
                name={`${task.item} - ${task.task}`}
                actionOnConfirm={() => {
                  unregister(`customTasks.${index}`)
                  setAllCustomTasks(prevState => prevState.filter(prevTask => prevTask.task !== task.task))
                }}
              />
            </Fragment>
          )}
        </FlexSection>
      </FlexSection>
      }
    </Fragment>
  }

  const CustomItemCheckbox = ({ wrapperProps, name, ...rest }) => {
    const [editedItem, setEditedItem] = useState()
    const itemName = makeItemName(name)

    return <FlexSection gridColumn="1/2" {...wrapperProps}>
      <DefaultCheckbox {...rest} name={name} />
      <FlexSection>
        <EditItemModal 
          modalContent={<>
            <p>Editing {rest.labelText || itemName}</p>
            <ComplexInput {...modeAndView} onChange={event => setEditedItem(event.target.value)}/>
          </>}
          actionOnConfirm={() => {
            const valueOfPrevName = getValues(name)
            unregister(name)
            setCustomItems(prevState => prevState.map(item => item.name === name ? { ...item, name: `${groupName}.${editedItem}`} : item))
            setValue(`${groupName}.${editedItem}`, valueOfPrevName)
            allCustomTasks.forEach((task, index) => {if (task.item === itemName) unregister(`customTasks.${index}`)})
            setAllCustomTasks(prevState => prevState.map(task => task.item === itemName ? { ...task, item: editedItem } : task))
          }}
        />
        <DeleteItemModal 
          {...rest}
          name={itemName}
          actionOnConfirm={() => {
            unregister(name)
            setCustomItems(prevState => prevState.filter(item => item.name !== name))
            allCustomTasks.forEach((task, index) => {if (task.item === itemName) unregister(`customTasks.${index}`)})
            setAllCustomTasks(prevState => prevState.filter(task => task.item !== itemName))
          }}
        />
      </FlexSection>
    </FlexSection>
  }

  const CustomCheckboxAndTasks = (rest) => {
    const [editedTask, setEditedTask] = useState()
    const [editedFrequency, setEditedFrequency] = useState()
    const isBoxChecked = watch(rest.name)
    const itemName = makeItemName(rest.name)

    return <Fragment key={rest.index}>
      <CustomItemCheckbox {...rest} name={rest.name} /> 
      {isBoxChecked && 
      <FlexSection gridColumn="1/-1">
        <FlexSection margin="0 0 0 15px">
          {allCustomTasks
            .filter(task => task.item === itemName)
            .map((task, index) => <Fragment key={index}>
              <Li margin="0 20px 0 0">{task.task}: {task.frequency} days</Li>
              <EditItemModal 
                modalContent={<>
                  <p>Editing {`${task.item} - ${task.task}`}</p>
                  <ComplexInput placeholder={task.task} {...modeAndView} onChange={event => setEditedTask(event.target.value)} labelText="task" />
                  <ComplexInput placeholder={task.frequency} {...modeAndView} onChange={event => setEditedFrequency(event.target.value)} labelText="frequency (days)" type="number" />
                </>}
                actionOnConfirm={() => {
                  unregister(`customTasks.${index}`)
                  setAllCustomTasks(prevState => prevState.map(prevTask => prevTask.task === task.task ? { ...prevTask, task: (editedTask || prevTask.task), frequency: (editedFrequency || prevTask.frequency) } : prevTask))
                }}
              />
              <DeleteItemModal 
                {...task}
                name={`${task.item} - ${task.task}`}
                actionOnConfirm={() => {
                  unregister(`customTasks.${index}`)
                  setAllCustomTasks(prevState => prevState.filter(prevTask => prevTask.task !== task.task))
                }}
              />
            </Fragment>
          )}
        </FlexSection>
      </FlexSection>
      }
    </Fragment>
  }

  const AddCustomItemModal = () => {
    const [newItem, setNewItem] = useState()
    const [newTask, setNewTask] = useState()
    const [newFrequency, setNewFrequency] = useState()

    return <CustomItemModal 
      modalContent={<>
        <p>New item</p>
        <ComplexInput required labelText="item" {...modeAndView} onChange={event => setNewItem(event.target.value)} />
        <ComplexInput required labelText="task" {...modeAndView} onChange={event => setNewTask(event.target.value)} />
        <ComplexInput required labelText="frequency (days)" type="number" {...modeAndView} onChange={event => setNewFrequency(event.target.value)} />
      </>}
      actionOnConfirm={() => {
        setCustomItems(prevState => [...prevState, { name: `${groupName}.${newItem}`, isCustomItem: true }])
        setValue(`${groupName}.${newItem}`, true)
        setAllCustomTasks(prevState => [...prevState, { item: newItem, task: newTask, frequency: newFrequency }])
      }}
    />
  }

  const AddCustomTaskModal = () => {
    const [newItem, setNewItem] = useState(allItems[0].name)
    const [newTask, setNewTask] = useState()
    const [newFrequency, setNewFrequency] = useState()

    return <CustomItemModal 
      confirmPrompt="add task"
      buttonText="add your own task"
      modalContent={<>
        <p>New task</p>
        <ComplexInput 
          name="item" 
          {...modeAndView} 
          as={() => 
            <Select value={newItem} onChange={event => setNewItem(event.target.value)}>
              {allItems.map(({ name }) => <option value={name} key={name}>{makeItemName(name)}</option>)}
            </Select>
          }
        />
        <ComplexInput {...modeAndView} onChange={event => setNewTask(event.target.value)} name="task" />
        <ComplexInput {...modeAndView} onChange={event => setNewFrequency(event.target.value)} name="frequency (days)" type="number" />
      </>}
      actionOnConfirm={() => {
        setAllCustomTasks(prevState => [...prevState, { item: makeItemName(newItem), task: newTask, frequency: newFrequency }])
        setValue(newItem, true)
      }}
    />
  }

  const CheckAllButton = () => (
    <Button text onClick={() => allItems.forEach(({ name }) => setValue(name, true))}>
      <AddIcon sm />select all
    </Button>
  )
  
  // - - - - - - - RETURN JSX - - - - - - - - //
  return (isAddMode || areDetailsLoaded) && <>
    <GridSection fullWidth {...props}>
      {allItems.map((input, index) => (props.readOnly || input.readOnly)
        ? watch(input.name) && <Li gridColumn="1/2" key={index}>{makeItemName(input.name)}</Li>
        : input.isCustomItem 
          ? <CustomCheckboxAndTasks index={index} {...input} />
          : <DefaultCheckboxAndTasks index={index} {...input} />
      )} 
    </GridSection>
    {allCustomTasks.map((task, index) => 
      <Fragment key={index}>
        <ComplexInput name={`customTasks.${index}.item`} labelHidden type="hidden" value={task.item} {...formTools} {...modeAndView} />
        <ComplexInput name={`customTasks.${index}.task`} labelHidden type="hidden" value={task.task} {...formTools} {...modeAndView} />
        <ComplexInput name={`customTasks.${index}.frequency`} labelHidden type="hidden" value={task.frequency} {...formTools} {...modeAndView} />
      </Fragment>
    )}
    
    {isAddingOrEditing && <AddCustomItemModal />}
    {isAddingOrEditing && <AddCustomTaskModal />}
    {isAddingOrEditing && <CheckAllButton />}
  </>
}

const SuperFormSelect = ({ options, name, ...props }) => { 
  // *SuperFormSelect needs to have "isCustomComponent" set to true.*
  const allProps = {
    ...props.register(name, props.registerOptions), 
    ...props,
    name: name,
    id: name
  }
  
  if (props.readOnly) return <Input {...allProps} />

  return <>
    <Select {...allProps}>
      {options && options.map(({ value, optionText }) => <option value={value} key={value}>{optionText || value}</option> )}
    </Select>
  </>
}

export default GroupOfInputs
export { GroupOfCheckboxes, SuperFormSelect }