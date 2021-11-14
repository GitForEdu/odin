import { useStyles } from "./useStyles"
import Link from "next/link"
import NTNULogo from "assets/ntnu.svg"
import { useState } from "react"
import { Button, Divider, Drawer, FormControlLabel, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Switch } from "@mui/material"
import clsx from "clsx"
import InboxIcon from "@mui/icons-material/MoveToInbox"
import MailIcon from "@mui/icons-material/Mail"
import MenuIcon from "@mui/icons-material/Menu"
import { useRouter } from "next/router"

const getNTNULogoStyle = () => ({
  width: "2rem",
  height: "2rem",
})


export const Navbar = props => {
  const rootPageCheck = useRouter().pathname === "/"
  const coursesPageCheck = useRouter().pathname === "/courses"
  const classes = useStyles()
  const { pageTitle, courseId, term } = props
  const [drawer, setDrawer] = useState(false)

  const toggleDrawer = (state) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return
    }
    setDrawer(state)
  }

  const list = () => (
    <div
      className={clsx(classes.list, { [classes.fullList]: false } )}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Grid
        style={{ height: "80%", width: "100%" }}
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        { !coursesPageCheck
        && <>
          <Grid
            item
            xs={12}
          >
            <Link href={"/courses"} passHref>
              <Button
                variant="contained"
                color="primary"
              >
        Back to courses
              </Button>
            </Link>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Button
              variant="contained"
              color="primary"
            >
              Edit your pat for this course
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Button
              variant="contained"
              color="primary"
            >
              Edit git hosting instance for this course
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Link href={`/courses/${term}/${courseId}/groups/diff`} passHref>
              <Button
                variant="contained"
                color="primary"
              >
              Check status or edit groups
              </Button>
            </Link>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <FormControlLabel
              labelPlacement="top"
              control={
                <Switch
                  checked={true}
                  name="changeColorTheme"
                  color="primary"
                />
              }
              label="Not working theme switch"
            />
          </Grid>
        </>
        }
      </Grid>
      <Grid
        style={{ height: "20%", width: "100%" }}
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Grid
          item
          xs={12}
        >
          <Link href={"/"} passHref>
            <Button
              variant="contained"
              color="error"
            >
        Logout
            </Button>
          </Link>
        </Grid>
      </Grid>
    </div>
  )


  return (
    <nav className={classes.navbar}>
      <Link href={courseId ? `/courses/${term}/${courseId}` : "/courses"} passHref>
        <div className={classes.logo}>
          <NTNULogo style={getNTNULogoStyle()}/>
          {courseId && <span className={classes.courseIdText}>{courseId} {term}</span>}
        </div>
      </Link>
      <div className={classes.middle}>
        <p style={{ color: "#FFF8DC" }}>{pageTitle}</p> {/** cornsilk */}
      </div>
      {!rootPageCheck
      && <>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer(true)}
          edge="start"
          className={clsx(classes.menuButton, drawer && classes.hide)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor={"right"}
          open={drawer}
          onClose={toggleDrawer(false)}
        >
          {list()}
        </Drawer>
      </>
      }
    </nav>
  )
}