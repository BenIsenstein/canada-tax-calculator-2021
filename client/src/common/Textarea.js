import styled, {css} from 'styled-components'
import TextareaAutosize from 'react-textarea-autosize'

const Textarea = styled(TextareaAutosize)`
    width: ${props => props.noFullWidth ? 'auto' : '100%'};
    min-height: 1.8em;
    padding: .4em .6em;
    font-family: inherit;
    font-size: 1em;
    color: ${props => props.theme.contentColor};
    border: 1px solid ${props => props.theme.titleColor};
    border-radius: 6px;
    outline: none;
    resize: none;
    overflow: hidden;

    &:focus {
        padding: .4em .6em;
        background-color: ${props => props.theme.prmLt};
        border: 1px solid ${props => props.theme.contentColor};
        outline: none;
    }

    ${props => props.readOnly && css`
        border: none;
        padding: .4em 0;
        cursor: default;

        &:focus {
            padding: .4em 0;
            background: none;
            border: none;
            outline: none;
        }
    `} 

    ${props => ['GroupOfInputs', 'GroupOfCheckboxes'].includes(props.as?.name) && css`
        border: none;
        padding: 0;
        margin: 0;
    `}   
`

export {Textarea}