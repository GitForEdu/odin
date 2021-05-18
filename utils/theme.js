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
      label: {
        color: "#FFF8DC",
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

export const HighchartsTheme = () => {

  const textBright = "#F0F0F3"

  return (
    {
      colors: [
        "#a6f0ff",
        "#70d49e",
        "#e898a5",
        "#007faa",
        "#f9db72",
        "#f45b5b",
        "#1e824c",
        "#e7934c",
        "#dadfe1",
        "#a0618b",
      ],

      chart: {
        backgroundColor: "#424242",
        plotBorderColor: "#606063",
      },

      title: {
        style: {
          color: textBright,
        },
      },

      subtitle: {
        style: {
          color: textBright,
        },
      },

      xAxis: {
        gridLineColor: "#707073",
        labels: {
          style: {
            color: textBright,
          },
        },
        lineColor: "#707073",
        minorGridLineColor: "#505053",
        tickColor: "#707073",
        title: {
          style: {
            color: textBright,

          },
        },
      },

      yAxis: {
        gridLineColor: "#707073",
        labels: {
          style: {
            color: textBright,
          },
        },
        lineColor: "#707073",
        minorGridLineColor: "#505053",
        tickColor: "#707073",
        title: {
          style: {
            color: textBright,
          },
        },
      },

      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        style: {
          color: textBright,
        },
      },

      plotOptions: {
        series: {
          dataLabels: {
            color: textBright,
          },
          marker: {
            lineColor: "#333",
          },
        },
        boxplot: {
          fillColor: "#505053",
        },
        candlestick: {
          lineColor: "white",
        },
        errorbar: {
          color: "white",
        },
        map: {
          nullColor: "#353535",
        },
      },

      legend: {
        backgroundColor: "transparent",
        itemStyle: {
          color: textBright,
        },
        itemHoverStyle: {
          color: "#FFF",
        },
        itemHiddenStyle: {
          color: "#606063",
        },
        title: {
          style: {
            color: "#D0D0D0",
          },
        },
      },

      credits: {
        style: {
          color: textBright,
        },
      },

      labels: {
        style: {
          color: "#707073",
        },
      },

      drilldown: {
        activeAxisLabelStyle: {
          color: textBright,
        },
        activeDataLabelStyle: {
          color: textBright,
        },
      },

      navigation: {
        buttonOptions: {
          symbolStroke: "#DDDDDD",
          theme: {
            fill: "#505053",
          },
        },
      },

      rangeSelector: {
        buttonTheme: {
          fill: "#505053",
          stroke: "#000000",
          style: {
            color: "#eee",
          },
          states: {
            hover: {
              fill: "#707073",
              stroke: "#000000",
              style: {
                color: textBright,
              },
            },
            select: {
              fill: "#303030",
              stroke: "#101010",
              style: {
                color: textBright,
              },
            },
          },
        },
        inputBoxBorderColor: "#505053",
        inputStyle: {
          backgroundColor: "#333",
          color: textBright,
        },
        labelStyle: {
          color: textBright,
        },
      },

      navigator: {
        handles: {
          backgroundColor: "#666",
          borderColor: "#AAA",
        },
        outlineColor: "#CCC",
        maskFill: "rgba(180,180,255,0.2)",
        series: {
          color: "#7798BF",
          lineColor: "#A6C7ED",
        },
        xAxis: {
          gridLineColor: "#505053",
        },
      },

      scrollbar: {
        barBackgroundColor: "#808083",
        barBorderColor: "#808083",
        buttonArrowColor: "#CCC",
        buttonBackgroundColor: "#606063",
        buttonBorderColor: "#606063",
        rifleColor: "#FFF",
        trackBackgroundColor: "#404043",
        trackBorderColor: "#404043",
      },
    }
  )
}