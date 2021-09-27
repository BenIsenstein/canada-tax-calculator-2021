import styled, {css} from 'styled-components'

const Page = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    background: ${props => props.theme.bkgGradient};

    ${props => props.noBackground && css`
        background: none;
    `}

`

export {Page}