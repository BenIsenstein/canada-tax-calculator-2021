import React, { useEffect, useState, useContext, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { useForm } from "react-hook-form"
import UserContext from '../../UserContext'
import { PencilIcon, Form, FormSectionTitle, Button, FlexSection } from '../../common'
import { useIsDateInput } from '../../functions'
import GroupOfInputs from './GroupOfInputs'

/* 
NOTES
FormTemplate is a dynamic form component wrapped in a FlexSection
Other JSX components can be added before and after the main template and remain within this component

- - - - - - - - - - - inputs | arr | default: undefined | - - - - - - - - - - - - - -
- the inputs array is very important. it needs this structure:

const inputs = [
  {
    name: "item",
    registerOptions: { required: "You must choose an item." },
    labelText: "",
    maxLength: '50'
  },
  {
    name: "task",
    registerOptions: { required: "You must choose a task." },
    labelText: "Custom label text",
    maxLength: '50'
  }
]

- the 'name' attribute of each input must match the attribute as it appears in the Mongoose model
- other than the crucial 'name' prop, inputs can take any regular html 
  attributes as well as some custom ones:

some important input props:
- readOnly | bool | default: false |
- as | str, React component | default: undefined | https://styled-components.com/docs/api#as-polymorphic-prop
- labelText | str | default: this.name |
- registerOptions | object | default: undefined | https://react-hook-form.com/api/useform/register

- - - - - - - - - | Styling inputs to group together | - - - - - -  
- Inputs may be grouped into a row, column, wrapped, etc. by using a "GroupOfInputs".

Note in this example the second object in the outside 'inputs' array:

const inputs = [
  {
    name: "item",
    registerOptions: { required: "You must choose an item." },
    labelText: "",
    maxLength: '50'
  },
  {
    isCustomComponent: true,
    as: GroupOfInputs,
    inputs: [{}, {}] 
    // These inputs all render inside of a FlexSection.
    // Any other attributes will be fed as props into the FlexSection wrapping the GroupOfInputs.
  }
]
- - - - - - - - - - - - - - - - - - - - - - - - -

- ...props | object | default: undefined | any props not recognized by the component are fed to the outermost <FlexSection>
- BeforeTemplate | JSX | default: undefined |
- AfterTemplate | JSX | default: undefined  |
- BeforeSubmitButton | JSX | default: undefined |
- BeforeSubmitButtonIfEditView | JSX | default: undefined |
- formProps | object | default: undefined | all props fed directly to the main <Form> element
- onSubmit | func | default: alert('No onSubmit given to <FormTemplate />') | called on submit event of the main <Form /> element
- formMode | str | default: 'add' | can be either 'add' or 'details'
- titleText | str | default: null | Appears just below the back button, above the inputs
- titleTag | str, React component | default: <P></P> | Can make the title of the template into any native html element, or a React component.
- openInEditView | bool | default: undefined | can choose to open a details mode form in editable view.

- ADD MODE:
  *  addModeCancel | func | default: history.push('/') | a customizable function that fires on clicking the 'cancel' button. 

- DETAILS EDIT VIEW or ADD MODE:
  * submitText | str | default: "Save" | <Form /> 'submit' button at the bottom of the template
  * cancelText | str | default: "Cancel" | right next to the 'submit' button. default onCick is to cancel edit view, or take user to homepage from add mode. Can have a custom "addModeCancel" function
  
- DETAILS MODE:
  * detailsUrl | str | default: undefined | is crucial to fetch info for the template dynamically
  * displayOnly | bool | default: false | if true the PencilIcon disappears, meaning you can effectively have a read-only FlexSection 
  * editViewCancel | func | default: undefined | function that can overide the cancel button onClick() in edit view of details form.
*/

const SuperForm = ({ 
  formMode, 
  detailsUrl,
  openInEditView,
  onSubmit, 
  inputs, 
  ...props }) => {
  // - - - - - Handle the most crucial props - - - - -  
  useEffect(() => () => console.log('SuperFormTemplate unmounted!'), [])

  if (!formMode) formMode = 'add'
  if (!onSubmit) onSubmit = () => alert('No onSubmit given to <FormTemplate />')
  // - - - - - - - - - - - Hooks - - - - - - - - - - -
  const { register, unregister, formState: { errors }, handleSubmit, setValue, reset, watch, getValues } = useForm({})
  const [areDetailsLoaded, setAreDetailsLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasBeenChanged, setHasBeenChanged] = useState(false)
  const [viewMode, setViewMode] = useState(openInEditView ? 'edit' : 'details')
  const [resetValues, setResetValues] = useState({})
  const userContext = useContext(UserContext)
  const history = useHistory()
  const goHome = useMemo(() => () => history.push('/calendar'), [history])
  const isDateInput = useIsDateInput()
  const resetForm = useMemo(() => () => {reset(resetValues); setViewMode('details')}, [reset, resetValues])
  // - - - -  Conditions measuring formMode + viewMode - - - -
  const isAddMode = formMode === 'add'
  const isDetailsMode = formMode === 'details'
  const isEditView = viewMode === 'edit'
  const isDetailsView = viewMode === 'details'
  const modeAndView = {
    areDetailsLoaded,
    isAddMode,
    isDetailsMode,
    isDetailsView,
    isEditView
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

  // Account for changes to 'openInEditView'
  useEffect(() => !openInEditView && setViewMode('details'), [openInEditView])

  // Effect to conditionally bring in entry and populate fields
  useEffect(() => {
    if (!isDetailsMode) return
    
    let isMounted = true 
    const getDetails = async () => {
      try {
        let valuesForReset = {}
        let detailsRes
        let details
        
        // fetch details
        if (isMounted) {
          detailsRes = await fetch(detailsUrl)
          details = await detailsRes.json()
        }

        // ensure that the value of date-type inputs are made into Date objects
        for (let key in details) if (isDateInput(key)) details[key] = new Date(details[key])

        // function to find the value of an input field, no matter how nested the name is.
        // breaks nested input names down by dot notation, but works for non-nested input values as well.
        const findValInDetails = (name) => name?.split('.')?.reduce((curVal, curKey) => curVal && curVal[curKey], details)
        
        // for each input, setValue + add the value to valuesForReset
        for (let { name, ...input } of inputs) {
          // if the object contains a single input element:
          if (!['GroupOfInputs', 'GroupOfCheckboxes', 'StartAndEndDates'].includes(input?.asName)) {
            console.log("input?.asName: ", input?.asName)
            console.log(`setting ${name} to ${findValInDetails(name)}`)
            setValue(name, findValInDetails(name))
            valuesForReset[name] = findValInDetails(name)
          } 
          // if the object is a <GroupOfInputs />, <GroupOfCheckbxes /> or <StartAndEndDates /> with an array of inputs:
          else {
            input?.inputs?.forEach(({ name }) => {
              console.log("input?.asName: ", input?.asName)
              console.log(`setting ${name} to ${findValInDetails(name)}`)
              setValue(name, findValInDetails(name))
              valuesForReset[name] = findValInDetails(name)
            })
          }
        }

        if (isMounted) {
          setResetValues(prevState => {return { ...prevState, ...valuesForReset }})
          setAreDetailsLoaded(true)
        }
      }
      catch(err) {
        console.log(err)
        alert("There as an error loading your details. We're working on it as fast as we can.")
        //goHome()
      }   
    }
    getDetails()

    return () => isMounted = false
  }, [
    isDetailsMode, 
    detailsUrl,  
    isDateInput,
    setAreDetailsLoaded, 
    setValue, 
    goHome
  ])

  // Effect to conditionally control the value of 'hasBeenChanged'. 
  // It can be useful to know if the form has been edited.
  // It won't render infinitely, the logic at the end prevents it.
  useEffect(() => {
    if (!isDetailsMode) return

    // store the current value the form data
    let currentValues = {}
    for (let { name } of inputs) currentValues[name] = watch(name)

    // see if current form data is identical to the original values
    let doEntriesMatch = Object.keys(resetValues).every(key => 
      isDateInput(key) 
        ? resetValues[key]?.toString() === currentValues[key]?.toString() 
        : resetValues[key] === currentValues[key]
    )

    if (!hasBeenChanged) if (!doEntriesMatch) setHasBeenChanged(true)
    if (hasBeenChanged) if (doEntriesMatch) setHasBeenChanged(false)
  })

  // When using a form in 'add' mode, 
  // attach a 'userId' input to the form with a value of the user's _id
  if (isAddMode) register('userId', { value: userContext.user?._id })

  // - - - - - - RETURN JSX - - - - - - - - - - - //
  return <FlexSection fullWidth column fadeIn {...props}>
    {props.BeforeTemplate} 

    <FlexSection fullWidth spaceBetween>
      <FormSectionTitle as={props.titleTag}>{props.titleText}</FormSectionTitle>
      {!props.displayOnly && isDetailsMode && <PencilIcon onClick={isEditView ? (props.editViewCancel || resetForm) : (() => setViewMode('edit'))} />}                    
    </FlexSection>
    
    <Form {...props.formProps} onSubmit={handleSubmit(async (data) => {setIsSubmitting(true); await onSubmit(data); setIsSubmitting(false)})}>  
      <GroupOfInputs 
        inputs={inputs}
        {...modeAndView}
        {...formTools}
      />

      {props.BeforeSubmitButton}
      {isEditView && props.BeforeSubmitButtonIfEditView}

      {(isAddMode || isEditView) && 
        <FlexSection fullWidth marginTop1em>
          <Button fullWidth important type='submit' value='submit' disabled={isSubmitting}>
            {isSubmitting ? "Please wait" : (props.submitText || "Save")}
          </Button>
          <Button 
            fullWidth 
            type='button' 
            onClick={isEditView 
              ? (props.editViewCancel || resetForm) 
              : (props.addModeCancel || goHome)
            }
          >
            {props.cancelText || "Cancel"}
          </Button>                              
        </FlexSection>
      }
    </Form>  

    {props.AfterTemplate} 
  </FlexSection>
}

export default SuperForm