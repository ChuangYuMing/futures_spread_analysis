import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import OptionOpenInterestVIew from './view/OptionOpenInterestVIew'
import FuturesOpenInterestView from './view/FuturesOpenInterestView'
import Navigation from './components/navigation/Navigation'

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Switch>
          <Route path="/option-open-interest">
            <OptionOpenInterestVIew />
          </Route>
          <Route path="/futures-open-interest">
            <FuturesOpenInterestView />
          </Route>
          <Route path="/">
            <OptionOpenInterestVIew />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
