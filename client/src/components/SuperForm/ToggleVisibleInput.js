import { useState } from 'react'
import { Input, FlexSection, EyeIcon, EyeSlashIcon } from '../../common'

// you can declare an object of 'wrapperProps' for the outside FlexSection.
// all other props are passed to the Input element.

const ToggleVisibleInput = props => {
  const [inputTextVisible, setInputTextVisible] = useState(props.startVisible || false)
  const toggleInputTextVisible = () => setInputTextVisible(!inputTextVisible)
  
  return <FlexSection fullWidth {...props.wrapperProps}>
    <Input 
      type={!inputTextVisible ? "password" : "text"}
      {...props.register(props.name, props.registerOptions)}
      {...props} 
    />
    {!inputTextVisible 
      ? <EyeIcon onClick={toggleInputTextVisible} />
      : <EyeSlashIcon onClick={toggleInputTextVisible} />
    }
  </FlexSection>
}

export default ToggleVisibleInput