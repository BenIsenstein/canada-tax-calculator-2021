import styled, {css} from 'styled-components'

const Li = styled.li`
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

    @media (min-width: ${props => props.theme.smScreen}) {
        ${props => props.gridColumn && css`
        grid-column: ${props.gridColumn};
    `}
    }
`

export {Li}