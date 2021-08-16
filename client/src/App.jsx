import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import OptionOpenInterestVIew from './view/OptionOpenInterestVIew'
import FuturesOpenInterestView from './view/FuturesOpenInterestView'
import FuturesBigOpenInterestView from './view/FuturesBigOpenInterestView'
import Navigation from './components/navigation/Navigation'
import LoanAndLendingAnalysis from './components/loan-and-lending-analysis/LoanAndLendingAnalysis'

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <div className="p-5">
          <Switch>
            <Route path="/option-open-interest">
              <OptionOpenInterestVIew />
            </Route>
            <Route path="/futures-open-interest">
              <FuturesOpenInterestView />
            </Route>
            <Route path="/futures-big-open-interest">
              <FuturesBigOpenInterestView />
            </Route>
            <Route path="/loan-and-lending-analysis">
              <LoanAndLendingAnalysis />
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
