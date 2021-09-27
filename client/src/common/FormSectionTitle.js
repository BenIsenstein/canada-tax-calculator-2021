import styled, {css} from 'styled-components'

const FormSectionTitle = styled.h2`
    font-size: 1em;
    color: ${props => props.theme.titleColor}

    ${props => props.margin && css`
        margin: 1em 0;
    `}
`

export {FormSectionTitle}