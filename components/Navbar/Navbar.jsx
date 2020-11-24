import { useStyles } from "./useStyles"

export const Navbar = props => {
  const classes = useStyles()
  const { courseCode, pageTitle } = props

  return (
    <nav className={classes.navbar}>
      <div className={classes.logo}>
        <img src="/ntnu.svg" className={classes.logoimage} alt="NTNU-logo" />
        {courseCode && <span className={classes.courseCodeText}>{courseCode} </span>}
      </div>
      <div className={classes.middle}>
        <p>{pageTitle}</p>
      </div>
      <div className={classes.hamburger}>
        <i className={`material-icons ${classes.hamburgerButton}`}>menu</i>
      </div>
    </nav>
  )
}