import React, { useEffect, useState } from "react"
import Tile from "components/Tile"
import Navbar from "components/Navbar"
import { Link } from "react-router-dom"
import { UserInfo } from "API/UserService"
import { useAuth0 } from "utils/authentication"
import { Button } from "@material-ui/core"

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState()
  const [availableCourses, setAvailableCourses] = useState({
    loading: false,
    courses: [
      {
        code: "TDT6969",
        name: "Elementary Front end development",
        term: "Spring 2021",
      },
      {
        code: "TDT9999",
        name: "Introduction to Back end development",
        term: "Spring 2021",
      },
    ],
    error: null,
  })
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
    userInfo
      ? <>
        <Navbar pageTitle={"Dashboard"} />
        <Tile>
          <h1>Hey, {userInfo.name} ({userInfo.username})!</h1>
          <h2>Please select a course:</h2>
          {availableCourses.courses.map((course) => (
            <Button
              variant="contained"
              key={course.code + course.term}
              color="primary"
              component={Link}
              to={`/courses/${course.code}`}
            >
              {course.code} - {course.name} - {course.term}
            </Button>
          ))}
        </Tile>
      </>
      : null
  )
}

export default Dashboard