import { Router, Switch, Route } from "react-router-dom"
import { Dashboard, LandingPage, CourseDashboard } from "./pages"
import PrivateRoute from "components/PrivateRoute"
import history from "utils/history"

const App = () => {
  return (
    <div className="App">
      <Router history={history}>
        <Switch>
          <PrivateRoute path="/courses/:courseCode" component={CourseDashboard}/>
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <Route path="/">
            <LandingPage />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
