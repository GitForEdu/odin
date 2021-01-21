import React from "react"
import Tile from "components/Tile"
import Navbar from "components/Navbar"
import { Button } from "@material-ui/core"
import withAuth from "components/withAuth"
import Link from "next/link"

import { getCourses } from "pages/api/courses"

const Dashboard = ({ session }) => {

  return (
    <>
      <Navbar pageTitle={"Dashboard"} />
      <Tile>
        <h1>Hey, {session.name} ({session.username})!</h1>
        <h2>Please select a course:</h2>
        {session.bbUserCourses.map((course) => (
          <Link
            key={course.code + course.term}
            href={`/courses/${course.term}/${course.code}`} passHref>
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
  )
}

export const getServerSideProps = (async () => {
  const courseList = await getCourses()

  if (!courseList) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: { courseList },
  }
})

export default withAuth(Dashboard)