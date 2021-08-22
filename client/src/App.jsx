import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from 'react-router-dom'
import OptionOpenInterestVIew from './view/OptionOpenInterestVIew'
import FuturesOpenInterestView from './view/FuturesOpenInterestView'
import FuturesBigOpenInterestView from './view/FuturesBigOpenInterestView'
import Navigation from './components/navigation/Navigation'
import LoanAndLendingAnalysis from './components/loan-and-lending-analysis/LoanAndLendingAnalysis'

function App() {
  const history = useHistory()
  const pathPrefix = process.env.REACT_APP_PUBLIC_URL

  if (window.location.hash && process.env.REACT_APP_IS_GH_PAGE === 'true') {
    const path = window.location.hash.replace('#/', '')
    const pathName = window.location.pathname
    history.push(`${pathName}${path}`)
  }

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
