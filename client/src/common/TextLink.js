import styled from 'styled-components'

const TextLink = styled.span`
    color: ${props => props.theme.prm};
    cursor: pointer;

    &:hover {
        color: ${props => props.theme.prmDk};
    }
`

export {TextLink}