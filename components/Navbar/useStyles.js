import { makeStyles } from "@material-ui/core/styles"

export const useStyles = makeStyles(theme => ({
  navbar: {
    display: "grid",
    gridTemplateAreas: "\"logo middle hamburger\"",
    gridTemplateColumns: "8em 1fr 8em",
    backgroundColor: theme.palette.primary.main,
    minHeight: "4em",
  },
  logo: {
    gridArea: "logo",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  middle: {
    gridArea: "middle",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  hamburger: {
    gridArea: "hamburger",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoimage: {
    height: "2em",
  },
  courseIdText: {
    margin: "0.25em",
    fontSize: "0.75em",
    color: "white",
  },
  hamburgerButton: {
    color: "white",
  },
  list: {
    width: 250,
    height: "100%",
  },
  fullList: {
    width: "auto",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
}))