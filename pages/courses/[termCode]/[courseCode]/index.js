import React from "react"
import Tile from "components/Tile"
import Navbar from "components/Navbar"
import withAuth from "components/withAuth"
import { Button } from "@material-ui/core"
import { useRouter } from "next/router"
import Link from "next/link"

const CourseDashboard = ({ session }) => {
  const router = useRouter()
  const { termCode, courseCode } = router.query

  return (
    <>
      <Navbar pageTitle={"Dashboard"} courseCode={courseCode} termCode={termCode} />
      <Tile>
        <h1>Hey, {session.name}, {session.username}!</h1>
        <h2>{`${courseCode} ${termCode}`}</h2>
        <Link href={`/courses/${termCode}/${courseCode}/students`} passHref>
          <Button
            variant="contained"
            color="primary"
          >
              Show students
          </Button>
        </Link>
        <Link href={`/courses/${termCode}/${courseCode}/groups`} passHref>
          <Button
            variant="contained"
            color="primary"
          >
              Show groups
          </Button>
        </Link>
      </Tile>
    </>
  )
}

export default withAuth(CourseDashboard)