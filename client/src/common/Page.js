import styled, {css} from 'styled-components'

const Page = styled.div`
    width: 100%;
    height: 100%;
    min-height; 100vh;
    display: flex;
    justify-content: center;
    background: ${props => props.theme.bkgGradient};

    ${props => props.noBackground && css`
        background: none;
    `}
`

export {Page}