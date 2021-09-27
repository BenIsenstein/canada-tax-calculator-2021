import styled, {css} from 'styled-components'
import DateTimePicker from 'react-datetime-picker'

const StyledDateTimePicker = styled(DateTimePicker).attrs(props => ({
    dayPlaceholder: 'dd',
    hourPlaceholder: 'hh',
    minutePlaceholder: 'mi',
    monthPlaceholder: 'mm',
    yearPlaceholder: 'yy',
    format: 'dd-MM-y  h:mm a',
    calendarIcon: null
  }))`
    width: 100%;
    min-height: 1.8em;
    padding: .4em .6em;
    font-family: inherit;
    font-size: 1em;
    color: ${props => props.theme.contentColor};
    border: 1px solid ${props => props.theme.prm};
    border-radius: 6px;
    outline: none;
    z-index: 2;
    
    &:focus {
        padding: .4em .6em;
        background-color: ${props => props.theme.scdLt};
        border: 1px solid ${props => props.theme.prmDk};
        outline: none;
    }

    ${props => props.detailedPage && css`
        padding: .4em 0;
        border: none;
    `}

    .react-datetime-picker__wrapper {
        border: none;
    }

    .react-datetime-picker__inputGroup__input {
        color: ${props => props.theme.contentColor};

        &:focus-visible {
            outline: 1px solid ${props => props.theme.contentColor};
        }

        &:invalid {
            background: none;
        }
    }

    .react-datetime-picker__button svg {
        stroke: ${props => props.theme.contentColor};
    }
`

export {StyledDateTimePicker}