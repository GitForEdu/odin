import React from "react"
import Tile from "components/Tile"
import Navbar from "components/Navbar"
import withAuth from "components/withAuth"
import { Button } from "@material-ui/core"
import { useRouter } from "next/router"
import Link from "next/link"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/creategit"
import { CreateGitConnectionLink, CreatePatConnectionLink } from "components/GitConnection"

const CourseDashboard = ({ session, bbGitConnection }) => {
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
        {bbGitConnection.error
          ? <CreateGitConnectionLink />
          : !bbGitConnection.pat
            ? <CreatePatConnectionLink />
            : undefined
        }
      </Tile>
    </>
  )
}

export const getServerSideProps = (async (context) => {
  const params = context.params

  const bbGitConnection = await getBBGitConnection(context.req, params)

  return {
    props: { bbGitConnection },
  }
})


export default withAuth(CourseDashboard)