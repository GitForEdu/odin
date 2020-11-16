// src/react-auth0-spa.js
import React, { useState, useEffect, useContext } from "react"
import createAuth0Client from "@nhi/auth0-spa-js"
import Cookies from "universal-cookie"

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname)

export const Auth0Context = React.createContext()
export const useAuth0 = () => useContext(Auth0Context)
export const Auth0Provider = ({
  children,
  role_uri,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState()
  const [user, setUser] = useState()
  const [auth0Client, setAuth0] = useState()
  const [loading, setLoading] = useState(true)
  const [popupOpen, setPopupOpen] = useState(false)
  const [token, setToken] = useState()
  const [roles, setRoles] = useState()

  useEffect(() => {
    const initAuth0 = async () => {
      new Cookies().remove("_legacy_auth0.is.authenticated", { path: "/" })
      new Cookies().remove("auth0.is.authenticated", { path: "/" })
      const auth0FromHook = await createAuth0Client(initOptions)
      setAuth0(auth0FromHook)

      if (window.location.search.includes("code=")
          && window.location.search.includes("state=")) {
        try {
          const { appState } = await auth0FromHook.handleRedirectCallback()
          onRedirectCallback(appState)

        } catch (error) {
          console.log(error)
        }
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated()

      setIsAuthenticated(isAuthenticated)

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser()
        const token = await getDecodedToken(auth0FromHook)

        setUser(user)
        setToken(token)
        setRoles(token[role_uri])
      }

      setLoading(false)
    }
    initAuth0()
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true)
    try {
      await auth0Client.loginWithPopup(params)
    } catch (error) {
      console.error(error)
    } finally {
      setPopupOpen(false)
    }
    const user = await auth0Client.getUser()
    setUser(user)
    setIsAuthenticated(true)
  }

  const handleRedirectCallback = async () => {
    setLoading(true)
    await auth0Client.handleRedirectCallback()
    const token = await getDecodedToken(auth0Client)
    const user = await auth0Client.getUser()
    setLoading(false)
    setIsAuthenticated(true)
    setUser(user)
    setToken(token)
    setRoles(token[role_uri])
  }

  const getDecodedToken = async (client) => {
    const jwtToken = await client.getTokenSilently()
    return jwtToken
  }

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        roles,
        token,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => auth0Client?.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client?.loginWithRedirect(...p),
        getTokenSilently: (...p) => auth0Client?.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client?.getTokenWithPopup(...p),
        logout: (...p) => auth0Client?.logout(...p),
      }}
    >
      {children}
    </Auth0Context.Provider>
  )
}