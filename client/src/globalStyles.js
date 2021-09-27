import { createGlobalStyle } from 'styled-components/macro'

export default createGlobalStyle`
    body {
        background: ${props => props.theme.bkg};
    }

    h1, h2, h3, h4, h5, h6 {
        margin: 0;
        color: ${props => props.theme.titleColor};
        font-family: ${props => props.theme.titleFont};
    }

    p {
        margin: 0;
        color: ${props => props.theme.contentColor};
    }

    button {
        cursor: pointer;
    }
`