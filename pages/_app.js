import { Provider as NextAuthProvider } from "next-auth/client"
import { ThemeProvider } from "@material-ui/core"
import { theme } from "utils/theme"
import "App.css"

export default function App ({ Component, pageProps }) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </NextAuthProvider>
  )
}