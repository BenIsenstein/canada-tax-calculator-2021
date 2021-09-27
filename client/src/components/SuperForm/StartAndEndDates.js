import { useState, useEffect, useMemo } from 'react' 
import GroupOfInputs from './GroupOfInputs'
import { isValidDate } from '../../functions'

const StartAndEndDates = ({isCustomComponent, forwardErrors, readOnly, ...props}) => {
  const { watch, setValue, areDetailsLoaded, isDetailsMode } = props
  const [startEndDiff, setStartEndDiff] = useState(3600000)           //diff value between 'start' and 'end'. stored as milliseconds
  const startDateValue = watch('start')
  const endDateValue = watch('end')
  const [mostRecentValidDates, setMostRecentValidDates] = useState({
    start: startDateValue,
    end: endDateValue
  })

  //tracking the most recent valid value for 'start' and 'end'
  useEffect(() => {
    setMostRecentValidDates(prevState => {
      return {
        start: isValidDate(startDateValue) ? startDateValue : prevState.start,
        end: isValidDate(endDateValue) ? endDateValue : prevState.end
      }
    })

  }, [startDateValue, endDateValue])

  // boolean that has an accurate value at all times - whether both dates are invalid
  const areBothDatesInvalid = useMemo(() => (
    !isValidDate(startDateValue) && 
    !isValidDate(endDateValue)

  ), [startDateValue, endDateValue])

  // effect on page load that sets the dates to reflect 12-1pm on the current date.
  // page load is guaged by whether both dates are invalid
  useEffect(() => {
    if (isDetailsMode) return  
    if (!areBothDatesInvalid) return 
    
    setValue('start', new Date(new Date().setHours(12,0,0)))
    setValue('end', new Date(new Date().setHours(13,0,0)))  

  }, [isDetailsMode, setValue, areBothDatesInvalid])

  // effect that watches for user changes to 'start'.
  // catches any invalid values for 'start' and sets back to the most recent valid value. 
  // adjusts 'end' according to the startEndDiff
  useEffect(() => {
    if (isDetailsMode && !areDetailsLoaded) return  
    if (areBothDatesInvalid) return
    if (!isValidDate(startDateValue)) return setValue('start', mostRecentValidDates.start)

    setValue('end', new Date(startDateValue?.getTime() + startEndDiff))

  }, [startDateValue]) 


  // effect that watched for user changes to 'end'.
  // MUST ONLY HAVE 'endDateValue' IN THE DEP ARRAY.
  // catches any invalid values for 'end' and sets back to the most recent valid value. 
  // if an invalid change is made and endDateValue is an earlier date 
  // than startDateValue, set startDateValue to the startEndDiff *behind* endDateValue.
  // otherwise, change startEndDiff to match the newly selected endDateValue.
  useEffect(() => {
    if (isDetailsMode && !areDetailsLoaded) return  
    if (areBothDatesInvalid) return
    if (!isValidDate(endDateValue)) return setValue('end', mostRecentValidDates.end)

    const taskLength = endDateValue?.getTime() - startDateValue?.getTime()

    if (taskLength < 0) return setValue('start', new Date(endDateValue?.getTime() - startEndDiff))
    
    setStartEndDiff(taskLength)

  }, [endDateValue])

  return <GroupOfInputs {...props} />
}

export default StartAndEndDates