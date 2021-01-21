import React from "react"
import Tile from "components/Tile"
import Navbar from "components/Navbar"
import withAuth from "components/withAuth"
import { Button } from "@material-ui/core"
import { useRouter } from "next/router"
import Link from "next/link"

const CourseDashboard = ({ session }) => {
  const router = useRouter()
  const { term, courseId } = router.query

  return (
    <>
      <Navbar pageTitle={"Dashboard"} courseId={courseId} term={term} />
      <Tile>
        <h1>Hey, {session.name}, {session.username}!</h1>
        <h2>{`${courseId} ${term}`}</h2>
        <Link href={`/courses/${term}/${courseId}/students`} passHref>
          <Button
            variant="contained"
            color="primary"
          >
              Show students
          </Button>
        </Link>
        <Link href={`/courses/${term}/${courseId}/groups`} passHref>
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