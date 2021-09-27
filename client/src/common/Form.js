import styled, {css} from 'styled-components'

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: ${props => props.theme.prm};

  ${props => props.authForm && css`
    max-width: 20em;
  `}
`

export {Form}