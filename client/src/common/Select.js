import styled from 'styled-components'

const Select = styled.select`
    appearance: none;
    width: 100%;
    padding: .4em .6em;
    font-size: 1em;
    color: ${props => props.theme.contentColor};
    border: 1px solid ${props => props.theme.titleColor};
    border-radius: 6px;
    outline: none;

    &:focus {
        background-color: ${props => props.theme.prmLt};
        border: 1px solid ${props => props.theme.contentColor};
        outline: none;
    }
`

export {Select}