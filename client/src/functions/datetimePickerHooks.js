import { useEffect } from 'react'

const usePossessionDateByOwner = (watch, setValue, isAddMode, name) => {
  const possessionDateValue = watch("possessionDateByOwner")
  const shouldSetPossessionDate = (name==="possessionDateByOwner" && !possessionDateValue && isAddMode)

  useEffect(() => shouldSetPossessionDate && setValue(name, new Date()), [possessionDateValue])
}


const useEntryDetailsCompletion = (watch, setValue, name, currentValue, recurrenceFrequency, isCompleted, isValidDate) => {
    // - - - - EntryDetails completion effects - - - - - - - - -
  const dateCompletedValue = watch("dateCompleted")

  // in the case of recurrenceFrequency prop, setValue to the appropriate future date.
  // This is meant to take place in a CalendarEntry completion form.
  useEffect(() => { 
    // the input is meant to be a nextRecurringDate input, 
    // the frequency value has loaded in,
    // and the input has a falsy value
    if (recurrenceFrequency && !currentValue) {
      let recurrenceDate = new Date(new Date().setHours(12,0,0))
      recurrenceDate.setDate(recurrenceDate.getDate() + recurrenceFrequency)

      setValue(name, recurrenceDate)
    }
  }, [recurrenceFrequency])

  // if the input is 'dateCompleted' and they are completing for the first time, 
  // start them off with the current date and time.
  useEffect(() => {
    if (name === "dateCompleted" && !currentValue && !isCompleted) setValue("dateCompleted", new Date())

  }, [name, currentValue, setValue, isCompleted])

  // watching for user changes to 'dateCompleted' 
  // and adjusting 'nextRecurringDate' accordingly
  useEffect(() => {
    if (!recurrenceFrequency) return
    if (!isValidDate(dateCompletedValue)) return

    const recurrenceFrequencyInMs = recurrenceFrequency * 86400000

    setValue("nextRecurringDate", new Date(new Date(dateCompletedValue?.getTime() + recurrenceFrequencyInMs).setHours(12,0,0)))
  
  },[dateCompletedValue])

}

export { usePossessionDateByOwner, useEntryDetailsCompletion }
