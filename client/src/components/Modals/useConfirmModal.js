import { useState } from 'react'

const useConfirmModal = () => {
  const [isConfirmModalShowing, setIsConfirmModalShowing] = useState(false)

  function toggleConfirmModal() {
    setIsConfirmModalShowing(!isConfirmModalShowing)
  }

  return {
    isConfirmModalShowing,
    toggleConfirmModal,
  }
}

export default useConfirmModal