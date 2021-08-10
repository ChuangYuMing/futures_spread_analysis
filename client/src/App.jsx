import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import OptionOpenInterest from './view/OptionOpenInterest'
import Navigation from './components/navigation/Navigation'

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Switch>
          <Route path="/option-open-interest">
            <OptionOpenInterest />
          </Route>
          <Route path="/">
            <OptionOpenInterest />
          </Route>
        </Switch>
      </Router>
      <OptionOpenInterest />
    </div>
  )
}

export default App
