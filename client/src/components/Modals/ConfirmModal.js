import React from 'react'
import ReactDOM from 'react-dom'
import { Button, FlexSection } from '../../common'

import './ConfirmModal.css'

// const ConfirmModal = ({ isConfirmModalShowing, hideConfirmModal, modalContent, confirmPrompt, actionOnConfirm, ...props }) => {
const ConfirmModal = ({ isConfirmModalShowing, hideConfirmModal, modalContent, confirmPrompt, actionOnConfirm, actionOnCancel, ...props }) => {

  // buttonResponse = false
  if(isConfirmModalShowing) {
    return (
      ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-confirm-overlay"/>
          <div className="modal-confirm-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
            <div className="modal-confirm">
              
              <div className="modal-confirm-header">
                <button type="button" className="modal-confirm-close-button" data-dismiss="modal" aria-label="Close" onClick={hideConfirmModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <FlexSection {...props.modalContentProps}>
                {modalContent}
              </FlexSection>

              <FlexSection fullWidth justifyCenter marginTop1em>
                <Button fullWidth onClick={() => {
                  hideConfirmModal();
                  actionOnConfirm();
                }}>
                  {confirmPrompt}
                </Button>
                <Button fullWidth important onClick={()=> {
                  hideConfirmModal();
                  actionOnCancel();
                }}>
                  Cancel
                </Button>
              </FlexSection>
            </div>
          </div>
        </React.Fragment>, document.body
      )
    )
  }
  else {
    return (null)
  }
}

export default ConfirmModal