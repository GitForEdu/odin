import { useStyles } from "./useStyles"
import Link from "next/link"

export const Navbar = props => {
  const classes = useStyles()
  const { courseCode, pageTitle } = props

  return (
    <nav className={classes.navbar}>
      <Link href={`/courses/${courseCode}`} passHref>
        <div className={classes.logo}>
          <img src="/ntnu.svg" className={classes.logoimage} alt="NTNU-logo" />
          {courseCode && <span className={classes.courseCodeText}>{courseCode} </span>}
        </div>
      </Link>
      <div className={classes.middle}>
        <p>{pageTitle}</p>
      </div>
      <Link href={"/"} passHref>
        <div className={classes.hamburger}>
          <i className={`material-icons ${classes.hamburgerButton}`}>menu</i>
        </div>
      </Link>
    </nav>
  )
}