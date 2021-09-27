import { Switch, Route } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from "styled-components"
import theme from './theme'
import GlobalStyle from "./globalStyles"
import { LandingPage, AccountDetailsPage } from './pages'

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Switch>
        <Route exact path='/' component={LandingPage} />
        <Route path='/account' render={(...props) => (<AccountDetailsPage {...props} />)} />
      </Switch>
    </ThemeProvider>
  )
}

export default App
