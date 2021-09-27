import { useState } from "react"
import { Button, AddIcon, PencilIcon, TrashIcon } from '../../common'
import ConfirmModal from './ConfirmModal'
import useConfirmModal from './useConfirmModal'

const CustomItemModal = props => {
  const { isConfirmModalShowing, toggleConfirmModal } = useConfirmModal()

  return <>
    <ConfirmModal
      isConfirmModalShowing={isConfirmModalShowing}
      hideConfirmModal={toggleConfirmModal}
      modalContentProps={{column: true}}
      modalContent={props.modalContent}
      confirmPrompt={props.confirmPrompt || 'Add item'}
      actionOnConfirm={props.actionOnConfirm}
      actionOnCancel={()=>{}}
    />
    <Button text type='button' onClick={toggleConfirmModal} {...props}>
      <AddIcon sm />{props.buttonText || "add your own item "}     
    </Button>
  </>
}

const EditItemModal = props => {
  const { isConfirmModalShowing, toggleConfirmModal } = useConfirmModal()

  return <>
    <ConfirmModal
      isConfirmModalShowing={isConfirmModalShowing}
      hideConfirmModal={toggleConfirmModal}
      modalContentProps={{column: true}}
      modalContent={props.modalContent}
      confirmPrompt="Edit"
      actionOnConfirm={props.actionOnConfirm}
      actionOnCancel={()=>{}}
    />
    <Button text type='button' onClick={toggleConfirmModal} {...props}>
      <PencilIcon sm /> 
    </Button>
  </>
}

const DeleteItemModal = props => {
  const { isConfirmModalShowing, toggleConfirmModal } = useConfirmModal()

  return <>
    <ConfirmModal
      isConfirmModalShowing={isConfirmModalShowing}
      hideConfirmModal={toggleConfirmModal}
      modalContentProps={{column: true}}
      modalContent={`Are you sure you want to delete "${props.labelText || props.name}"?`}
      confirmPrompt="Delete"
      actionOnConfirm={props.actionOnConfirm}
      actionOnCancel={()=>{}}
    />
    <Button text type='button' onClick={toggleConfirmModal} {...props}>
      <TrashIcon sm /> 
    </Button>
  </>
}

export default CustomItemModal
export { EditItemModal, DeleteItemModal }



