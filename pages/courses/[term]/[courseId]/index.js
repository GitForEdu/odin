import React from "react"
import Tile from "components/Tile"
import Navbar from "components/Navbar"
import withAuth from "components/withAuth"
import { Button } from "@material-ui/core"
import { useRouter } from "next/router"
import Link from "next/link"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import { CreateGitConnectionLink, CreatePatConnectionLink } from "components/GitConnection"

const CourseDashboard = ({ session, bbGitConnection }) => {
  const router = useRouter()
  const { term, courseId } = router.query
  const sessionCourse = session.bbUserCourses.find(course => course.id === courseId)

  return (
    <>
      <Navbar pageTitle={"Dashboard"} courseId={courseId} term={term} />
      <Tile>
        <h1>Hey, {session.name}! </h1>
        {sessionCourse && (
          <h2>{`Your user ${session.username} is registered as ${sessionCourse.role} in ${sessionCourse.name} (${courseId} ${term})`}</h2>
        )}

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

  if (bbGitConnection.gitURL && !bbGitConnection.pat) {
    return {
      redirect: {
        destination: `/courses/${params.term}/${params.courseId}/git/addPAT`,
        permanent: false,
      },
    }
  }

  if (!bbGitConnection.gitURL) {
    return {
      redirect: {
        destination: `/courses/${params.term}/${params.courseId}/git/create`,
        permanent: false,
      },
    }
  }

  return {
    props: { bbGitConnection },
  }
})


export default withAuth(CourseDashboard)