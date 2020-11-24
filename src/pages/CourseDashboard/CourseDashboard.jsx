import React, { useEffect, useState } from "react"
import { Switch, Route } from "react-router-dom"
import Tile from "components/Tile"
import Navbar from "components/Navbar"
import List from "components/List"
import { Link, useRouteMatch } from "react-router-dom"
import { UserInfo } from "API/UserService"
import { useAuth0 } from "utils/authentication"
import { Button } from "@material-ui/core"

const CourseDashboard = location => {
  const courseCode = location.match.params.courseCode.toUpperCase()
  const { url } = useRouteMatch()
  const [userInfo, setUserInfo] = useState()
  const { getTokenSilently, getIdTokenClaims } = useAuth0()

  useEffect(() => {
    getIdTokenClaims().then(id_token => {
      getTokenSilently().then(access_token => {
        UserInfo(id_token.__raw, access_token).then(userInfo => {
          setUserInfo(userInfo)
        })
      })
    })
  }, [getIdTokenClaims, getTokenSilently])

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
              <h1>Hey, {userInfo.name} ({userInfo.username})!</h1>
              <h2>{courseCode}</h2>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`${url}/students`}
              >
              Show students
              </Button>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`${url}/groups`}
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