import { BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import { Home, NotHome } from "./pages"

const App = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/nothome">
            <NotHome />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
