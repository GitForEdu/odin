import { SessionProvider as NextAuthProvider } from "next-auth/react"
import { ThemeProvider } from "@mui/material/styles"
import { theme } from "utils/theme"
import "App.css"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import StyledEngineProvider from "@mui/material/StyledEngineProvider"


export default function App ({
  Component,
  pageProps: { session, ...pageProps }
}) {
  return (
    <NextAuthProvider session={session}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </StyledEngineProvider>
      </LocalizationProvider>
    </NextAuthProvider>
  )
}