import styled, {css} from 'styled-components'
import {fadeIn} from './'

const PageContainer = styled.div`
    min-height: 90vh;
    margin: 0 0 1.4em 0;
    padding: .5em;
    background-color: ${props => props.theme.bkg};
    border-radius: 10px;
    animation: ${fadeIn} 0.4s linear;

    ${props => props.flexColumn && css`
        display: flex;
        flex-direction: column;
    `}

    ${props => props.centerPage && css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `}
    
    ${props => props.mockMobileView && css`
        min-height: 80vh;
    `}      

    ${props => props.extraCss && css`${props.extraCss(props)}`}

    @media (min-width: ${props => props.theme.smScreen}) {
        width: 90%;
        padding: 1.4em;
    }
`

export {PageContainer}