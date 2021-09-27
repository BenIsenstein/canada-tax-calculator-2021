import { useState, useEffect } from "react"
import { Button, CalendarIcon, StyledDateTimePicker } from '../../common'
import ConfirmModal from './ConfirmModal'
import useConfirmModal from './useConfirmModal'
import { isValidDate, usePossessionDateByOwner, useEntryDetailsCompletion } from "../../functions"

const DatetimePickerModal = ({ watch, setValue, isAddMode, recurrenceFrequency, isCompleted, name, ...props}) => { 
  const { isConfirmModalShowing, toggleConfirmModal } = useConfirmModal()
  const currentValue = watch(name)
  const [modalDate, setModalDate] = useState(currentValue || new Date())
  const [mostRecentValidDate, setMostRecentValidDate] = useState(currentValue, new Date())

  // - - - - - General housekeeping effects - - - - - - - -

  // tracking the last valid date value
  useEffect(() => setMostRecentValidDate(prevState => isValidDate(currentValue) ? currentValue : prevState), [currentValue])

  // ensuring all date inputs have invalid date values handled
  useEffect(() => !isValidDate(currentValue) && setValue(name, mostRecentValidDate), [currentValue])

  //make sure the modal always opens with the current value of the input element, if it has a value.
  useEffect(() => {
    console.log(`current value of date "${name}" is ${currentValue}`)
    setModalDate(currentValue || new Date())
  }, [currentValue])

  // - - - - - Custom app-specific effects - - - - - - - 

  usePossessionDateByOwner(watch, setValue, isAddMode, name)

  useEntryDetailsCompletion(watch, setValue, name, currentValue, recurrenceFrequency, isCompleted, isValidDate)
  
  const ModalContent = () => <>
    <p>{props.modalTitle}</p>
    <StyledDateTimePicker
      closeWidgets
      onChange={setModalDate}
      value={modalDate}
    />
  </>

  return <>
    <ConfirmModal
      isConfirmModalShowing={isConfirmModalShowing}
      hideConfirmModal={toggleConfirmModal}
      modalContentProps={{column: true}}
      modalContent={<ModalContent />}
      confirmPrompt='Confirm'
      actionOnConfirm={() => setValue(name, modalDate)}
      actionOnCancel={()=>{}}
    />
    <Button type='button' noBorder onClick={toggleConfirmModal} {...props}>
      { props.iconButton ? <CalendarIcon /> : 'Delete Event' }       
    </Button>
  </>
}

export default DatetimePickerModal