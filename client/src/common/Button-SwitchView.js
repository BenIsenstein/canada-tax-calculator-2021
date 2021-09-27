import styled, {css} from 'styled-components'

const SwitchViewButton = styled.button`
    background: ${props => props.theme.prmLt};
    border: none;
    color: white;

    display: flex;
    align-items: center;
    margin: 0.2em 0;
    padding: 0.4em 1em;
    font-size: .8em;
    font-weight: lighter;
    text-transform: uppercase;

    &:hover {
        background: ${props => props.theme.prm};
    }

    ${props => props.activeView && css`
        background: ${props => props.theme.prm};
        color: white;
    `}

    ${props => props.icon && css`
        padding: .2em;
    `}

    ${props => props.edit && css`
        padding: .2em;
        fill: ${props => props.theme.prm};
        background: none;
        transition: all .2s ease-in-out;

        &:hover {
            fill: ${props => props.theme.prmDk};
            background: none;
            transform: rotate(90deg);
        }
    `}
`

export {SwitchViewButton}