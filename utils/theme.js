import { createMuiTheme } from "@material-ui/core/styles"


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
theme.components = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
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
  },
  MuiInputBase: { // Cursor
    styleOverrides: {
      root: {
        color: "white",
      },
    },
  },
  MuiInputLabel: {
    defaultProps: {
      shrink: true,
    },
  },
  MuiInput: {
    defaultProps: {
      disableUnderline: true,
    },
  },
  MuiFormLabel: { // TextField Øabel before focus
    styleOverrides: {
      root: {
        color: "white",
        "&$focused": {
          color: "white",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
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
    },
  },
  MuiFormControl: {
    styleOverrides: {
      root: {
        margin: "1.0rem 0.5rem 0.5rem 0.5rem",
      },
    },
  },

  MuiListItemText: {
    styleOverrides: {
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
  },
}
