import React, { useState } from "react"
import Tile from "components/Tile"
import Navbar from "components/Navbar"
import { Button } from "@material-ui/core"
import withAuth from "components/withAuth"
import Link from "next/link"

const Dashboard = ({ session }) => {
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

  return (
    session
      ? <>
        <Navbar pageTitle={"Dashboard"} />
        <Tile>
          <h1>Hey, {session.name} ({session.username})!</h1>
          <h2>Please select a course:</h2>
          {availableCourses.courses.map((course) => (
            <Link
              key={course.code + course.term}
              href={`/courses/${course.code}`} passHref>
              <Button
                variant="contained"
                color="primary"
              >
                {course.code} - {course.name} - {course.term}
              </Button>
            </Link>)
          )}
        </Tile>
      </>
      : null
  )
}

export default withAuth(Dashboard)