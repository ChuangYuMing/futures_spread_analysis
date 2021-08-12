import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import OptionOpenInterestVIew from './view/OptionOpenInterestVIew'
import FuturesOpenInterestView from './view/FuturesOpenInterestView'
import Navigation from './components/navigation/Navigation'
import './App.css'

console.log('test github action')
function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <div className="main">
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
        </div>
      </Router>
    </div>
  )
}

export default App
