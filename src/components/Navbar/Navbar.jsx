import { useStyles } from "hooks"
import { Link } from "react-router-dom"
import logo from "./ntnu.svg"

export const Navbar = props => {
  const classes = useStyles()
  const { courseCode, pageTitle } = props

  return (
    <nav className={classes.navbar}>
      <div className={classes.logo}>
        <Link to={{ pathname: "/home" }} className={classes.linkWithoutStyling}>
          <img src={logo} className={classes.logoimage} alt="NTNU-logo" />
          {courseCode && <span className={classes.courseCodeText}>{courseCode} </span>}
        </Link>
      </div>
      <div className={classes.middle}>
        <p>{pageTitle}</p>
      </div>
      <div className={classes.hamburger}>
        <Link to={{ pathname: "/logout" }}>
          <i className={`material-icons ${classes.hamburgerButton}`}>menu</i>
        </Link>
      </div>
    </nav>
  )
}