import styled, {css} from 'styled-components'
import {fadeIn} from './'

const GridSection = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: ${props => props.gridGap || "0"};

    ${props => props.fullWidth && css`
        width: 100%;
    `}

    ${props => props.popup && css`
        overflow: hidden;
        height: ${props => props.popupCondition ? 'max-content' : '0px'};
        transition: height 1s;
    `}

    ${props => props.fadeIn && css`
        animation: ${fadeIn} 0.4s linear;
    `}

    ${props => props.backgroundColor && css`
        background-color: ${props.backgroundColor};
    `}

    @media (min-width: ${props => props.theme.smScreen}) {
        grid-template-columns: ${props => props.gridTemplateColumns || "5fr 0.5fr 5fr"};
    }
`

export { GridSection }