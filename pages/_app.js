import { Provider as NextAuthProvider } from "next-auth/client"
import { ThemeProvider } from "@material-ui/core/styles"
import { theme } from "utils/theme"
import "App.css"
import AdapterDateFns from "@material-ui/lab/AdapterDateFns"
import LocalizationProvider from "@material-ui/lab/LocalizationProvider"
import StyledEngineProvider from "@material-ui/core/StyledEngineProvider"


export default function App ({ Component, pageProps }) {
  return (
    <NextAuthProvider session={pageProps.session}>
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