import styled, {css} from 'styled-components'
import {fadeIn} from './'

const PageContainer = styled.div`
    width: 95%;
    min-height: 90vh;
    margin: 0 0 1.4em 0;
    padding: .5em;
    background-color: ${props => props.theme.bkg};
    border-radius: 10px;
    animation: ${fadeIn} 0.4s linear;
    overflow: auto;

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

    @media (min-width: ${props => props.theme.smScreen}) {
        width: 75vw;
        padding: 1.4em;
    }
`

export {PageContainer}