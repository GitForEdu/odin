import { createMuiTheme } from "@material-ui/core"

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00509e",
    },
    action: {
      disabledBackground: "grey",
      disabled: "white",
    },
  },
})

theme.overrides = {
  MuiButton: {
    containedPrimary: {
    },
    contained: {
    },
  },
  MuiInputBase: { // Cursor
    root: {
      color: "white",
    },
  },
  MuiFormLabel: { // Label when not focused
    root: {
      color: "white",
    },
  },
  MuiInput: { // underlined
    underline: {
      "&:before": {
        borderBottom: "1px solid white",
      },
    },
  },
}