import styled, {css} from 'styled-components'

const Label = styled.label`
    color: ${props => props.theme.titleColor};
    margin: .4em .4em .1em 0;
    font-size: .8em;  
    text-transform: capitalize;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    ${props => props.margin && css`
        margin: ${props.margin};
    `}

    ${props => props.fontSize && css`
        font-size: ${props.fontSize};
    `}
`

export {Label}