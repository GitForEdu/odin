import React from "react"
import { Switch, Route } from "react-router-dom"
import Tile from "../../components/Tile"
import Navbar from "../../components/Navbar"
import List from "../../components/List"

import { Button } from "@material-ui/core"

const CourseDashboard = location => {
  const courseCode = location.match.params.courseCode.toUpperCase()
  const { url } = useRouteMatch()


  return (
    <Switch>
      <Route exact path="/courses/:courseCode/students">
        <Navbar pageTitle={"All students"} courseCode={courseCode} />
        <List type="students" />
      </Route>

      <Route exact path="/courses/:courseCode/groups">
        <Navbar pageTitle={"All groups"} courseCode={courseCode} />
        <List type="groups" />
      </Route>

      <Route path="/">
        {userInfo
          ? <>
            <Navbar pageTitle={"Dashboard"} courseCode={courseCode} />
            <Tile>
              <h1>Hey, USERINFO_HERE!</h1>
              <h2>{courseCode}</h2>
              <Button
                variant="contained"
                color="primary"
              >
              Show students
              </Button>
              <Button
                variant="contained"
                color="primary"
              >
              Show groups
              </Button>
            </Tile>
          </>
          : null}
      </Route>
    </Switch>
  )
}

export default CourseDashboard