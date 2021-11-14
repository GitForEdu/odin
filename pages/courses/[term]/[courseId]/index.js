import { useState } from "react"
import Navbar from "components/Navbar"
import withAuth from "components/withAuth"
import { Button, Grid, useMediaQuery } from "@mui/material"
import { useRouter } from "next/router"
import Link from "next/link"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import { CreateGitConnectionLink, CreatePatConnectionLink } from "components/GitConnection"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import { GetGroups } from "pages/api/courses/[term]/[courseId]/git/groups"
import { CourseOverviewStats } from "components/Stats"
import DatePickerBar from "components/DatePickerBar"

const getButtonStyle = bigScreen => {
  const baseStyle = {
    width: "90%",
  }
  if (bigScreen) {
    return ({
      ...baseStyle,
    })
  }
  else {
    return ({
      ...baseStyle,
      width: "30%",
    })
  }
}

const CourseDashboard = ({ session, courseGroupsBB, courseGroupsGit, bbGitConnection }) => {
  const matches = useMediaQuery("(max-width:400px)")
  const router = useRouter()
  const { term, courseId } = router.query
  const [sinceTime, setSinceTime] = useState(new Date((new Date()).valueOf() - 31536000000))
  const [untilTime, setUntilTime] = useState(new Date((new Date()).valueOf() + 86400000))
  const sessionCourse = session.bbUserCourses.find(course => course.id === courseId)

  return (
    <>
      <Navbar pageTitle={"Dashboard"} courseId={courseId} term={term} />
      <h1>Hey, {session.name}! </h1>
      {sessionCourse && (
        <h2>{`Your user ${session.username} is registered as ${sessionCourse.role} in ${sessionCourse.name} (${courseId} ${term})`}</h2>
      )}
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={10} md={10}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{
              margin: "0 0 1rem 0",
            }}
          >
            <Link href={`/courses/${term}/${courseId}/students`} passHref>
              <Button
                variant="contained"
                color="primary"
                style={getButtonStyle(matches)}
              >
              Show students
              </Button>
            </Link>
            <Link href={`/courses/${term}/${courseId}/groups`} passHref>
              <Button
                variant="contained"
                color="primary"
                style={getButtonStyle(matches)}
              >
              Show groups
              </Button>
            </Link>
            <Link href={`/courses/${term}/${courseId}/ta`} passHref>
              <Button
                variant="contained"
                color="primary"
                style={getButtonStyle(matches)}
              >
                Show ta&apos;s
              </Button>
            </Link>
            {bbGitConnection.error
              ? <CreateGitConnectionLink />
              : !bbGitConnection.pat
                ? <CreatePatConnectionLink />
                : undefined
            }
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignContent="center"
            item
          >
            <DatePickerBar sinceTime={sinceTime} untilTime={untilTime} setSinceTime={setSinceTime} setUntilTime={setUntilTime}/>
            <CourseOverviewStats
              courseGroupsBB={courseGroupsBB}
              courseGroupsGit={courseGroupsGit}
              courseId={courseId}
              term={term}
              sinceTime={sinceTime}
              untilTime={untilTime}
            />
          </Grid>
        </Grid>
      </Grid>
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

  const courseGroupsBB = await getCourseGroups(context.req, params)

  const courseGroupsGit = (await GetGroups(context.req, params))?.subGroups

  return {
    props: { courseGroupsBB, courseGroupsGit, bbGitConnection },
  }
})


export default withAuth(CourseDashboard)