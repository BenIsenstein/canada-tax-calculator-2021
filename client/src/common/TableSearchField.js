import styled from 'styled-components'

const TableSearchField = styled.input`
    width: 100%;
    font-family: inherit;
    border: 1px solid ${props => props.theme.scdLt};
    border-radius: 3px;
    outline: none;
    color: ${props => props.theme.contentColor};

    :focus {
        border: 1px solid ${props => props.theme.scd};
        outline: none;
    }
`

export {TableSearchField}