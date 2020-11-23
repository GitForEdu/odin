import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import "./App.css"
import reportWebVitals from "./reportWebVitals"
import { ThemeProvider } from "@material-ui/core"
import { Auth0Provider } from "./utils/authentication"
import history from "./utils/history"
import { theme } from "utils"


const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  )
}

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH_DOMAIN}
        client_id={process.env.REACT_APP_AUTH_CLIENT_ID}
        redirect_uri={`${window.location.origin}`}
        onRedirectCallback={onRedirectCallback}
        authorizeTimeoutInSeconds={15}
        scope={"aud userid-feide groups"}
      >
        <App />
      </Auth0Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
