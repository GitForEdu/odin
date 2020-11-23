import { useStyles } from "hooks"
import logo from "./ntnu.svg"

export const Navbar = props => {
  const classes = useStyles()
  const { courseCode, pageTitle } = props

  return (
    <nav className={classes.navbar}>
      <div className={classes.logo}>
        <button>
          <img src={logo} className={classes.logoimage} alt="NTNU-logo" />
          {courseCode && <span className={classes.courseCodeText}>{courseCode} </span>}
        </button>
      </div>
      <div className={classes.middle}>
        <p>{pageTitle}</p>
      </div>
      <div className={classes.hamburger}>
        <button>
          <i className={`material-icons ${classes.hamburgerButton}`}>menu</i>
        </button>
      </div>
    </nav>
  )
}