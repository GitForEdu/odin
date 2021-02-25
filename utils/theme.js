import { createMuiTheme } from "@material-ui/core"


export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00509e",
    },
    action: {
      main: "grey",
      disabledBackground: "grey",
      disabled: "white",
    },
    selected: {
      main: "green",
    },
  },
})

// Props
theme.props = {
  MuiButton: {
    disableElevation: true,
  },
  MuiInputLabel: {
    shrink: true,
  },
  MuiInput: {
    disableUnderline: true,
  },
}

// CSS
theme.overrides = {
  MuiButton: {
    root: {
      borderRadius: 0,
      textTransform: "none",
      margin: "1.0rem 0.5rem 0.5rem 0.5rem",
    },
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

  MuiFormLabel: { // TextField Øabel before focus
    root: {
      color: "white",
      "&$focused": {
        color: "white",
      },
    },
  },

  MuiInputLabel: {
    root: {
    },
  },

  MuiInput: {
    root: {
    },
  },

  MuiOutlinedInput: {
    root: {
      "&:hover $notchedOutline": {
        borderColor: theme.palette.primary.main,
        borderWidth: "2px",
      },
    },
    notchedOutline: {
      borderColor: theme.palette.primary.main,
    },
  },

  MuiFormControl: {
    root: {
      margin: "1.0rem 0.5rem 0.5rem 0.5rem",
    },
  },

  MuiListItemText: {
    primary: {
      color: "white",
      textAlign: "center",
    },
    secondary: {
      color: "white",
      textAlign: "center",
      fontSize: "1.5rem",
    },
  },
}