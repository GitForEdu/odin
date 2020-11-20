import { useStyles } from "hooks"

export const Navbar = props => {
  const classes = useStyles()
  const { courseCode } = props

  return (
    <nav className={classes.navbar}>
      <h1>Velkommen til Gitlab For Edu</h1>
      {courseCode && <h2>Emne: {courseCode}</h2>}
    </nav>
  )
}