import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import OptionOpenInterestVIew from './view/OptionOpenInterestVIew'
import FuturesOpenInterestView from './view/FuturesOpenInterestView'
import FuturesBigOpenInterestView from './view/FuturesBigOpenInterestView'
import Navigation from './components/navigation/Navigation'
import LoanAndLendingAnalysis from './components/loan-and-lending-analysis/LoanAndLendingAnalysis'

function App() {
  const pathPrefix = process.env.REACT_APP_PUBLIC_URL
  return (
    <div className="App">
      <Router>
        <Navigation />
        <div className="p-5">
          <Switch>
            <Route path={`${pathPrefix}/option-open-interest`}>
              <OptionOpenInterestVIew />
            </Route>
            <Route path={`${pathPrefix}/futures-open-interest`}>
              <FuturesOpenInterestView />
            </Route>
            <Route path={`${pathPrefix}/futures-big-open-interest`}>
              <FuturesBigOpenInterestView />
            </Route>
            <Route path={`${pathPrefix}/loan-and-lending-analysis`}>
              <LoanAndLendingAnalysis />
            </Route>
            <Route path={`${pathPrefix}/`}>
              <OptionOpenInterestVIew />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default App
