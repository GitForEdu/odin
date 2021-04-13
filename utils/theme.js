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
      main: "#008000", // green
    },
    error: {
      main: "#8b0000",
    },
    mode: "dark",
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
      // root: {
      //   color: "white",
      // },
    },
  },

  // This wil cause the border to strike through label on inputs...
  // MuiInputLabel: {
  //   defaultProps: {
  //     shrink: true,
  //   },
  // },
  MuiInput: {
    defaultProps: {
      disableUnderline: true,
    },
  },
  MuiFormLabel: { // TextField label before focus & after focus
    styleOverrides: {
      root: {
        color: "white !important",
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        "& fieldset, &:hover": {
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
        textAlign: "center",
      },
      secondary: {
        textAlign: "center",
        fontSize: "1.5rem",
      },
    },
  },
  MuiToolbar: {
    styleOverrides: {
      // root: {
      //   backgroundColor: "grey",
      // },
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      // root: {
      //   backgroundColor: "grey",
      // },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      // root: {
      //   borderBottomColor: "black",
      //   color: "white",
      // },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
      },
    },
  },
  MuiTableSortLabel: {
    styleOverrides: {
      root: {
        // color: "white",
        // "&$active": {
        //   color: "white",
        // },
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
  },
}
