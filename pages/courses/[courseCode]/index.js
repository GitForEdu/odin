import React from "react"
import Tile from "components/Tile"
import Navbar from "components/Navbar"
import withAuth from "components/withAuth"
import { Button } from "@material-ui/core"
import { useRouter } from "next/router"
import Link from "next/link"

const CourseDashboard = ({ session }) => {
  const router = useRouter()
  const { courseCode } = router.query

  return (
    <>
      <Navbar pageTitle={"Dashboard"} courseCode={courseCode} />
      <Tile>
        <h1>Hey, {session.name}, {session.username}!</h1>
        <h2>{courseCode}</h2>
        <Link href={`${courseCode}/students`} passHref>
          <Button
            variant="contained"
            color="primary"
          >
              Show students
          </Button>
        </Link>
        <Link href={`${courseCode}/groups`} passHref>
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