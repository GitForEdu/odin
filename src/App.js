import { Router, Switch, Route } from "react-router-dom"
import { Home, NotHome, Login } from "./pages"
import PrivateRoute from "components/PrivateRoute"
import Navbar from "components/Navbar"
import history from "utils/history"

const App = () => {
  return (
    <div className="App">
      <Router history={history}>
        <Navbar courseCode="TDT6969" />
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>

          <Route path="/nothome">
            <NotHome />
          </Route>

          <PrivateRoute path="/home" component={Home} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
