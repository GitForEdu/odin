import React, { useEffect, useState } from "react"
import Tile from "components/Tile"
import Navbar from "components/Navbar"
import withAuth from "components/withAuth"
import { Button, Grid, Typography, useMediaQuery } from "@material-ui/core"
import { useRouter } from "next/router"
import Link from "next/link"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import { CreateGitConnectionLink, CreatePatConnectionLink } from "components/GitConnection"
import fetcher from "utils/fetcher"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import { GetGroups } from "pages/api/courses/[term]/[courseId]/git/groups"


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

const calcultateGitStats = async (term, courseId, courseGroupsBB, courseGroupsGit) => {
  const groupKeyStats = await fetcher(
    `/api/courses/${term}/${courseId}/git/groups/getGroupsKeyStats?groupPaths=${courseGroupsGit.map(group => group.full_path).join(",")}`,
    {},
    "GET"
  )

  let commits = 0
  let issues = 0
  let mergeRequests = 0
  let additions = 0
  let deletions = 0
  let branches = 0
  let projects = 0

  groupKeyStats.forEach(groupStats => {
    console.log(groupStats)
    commits = commits + groupStats.commits.length
    issues = issues + groupStats.issues.length
    mergeRequests = mergeRequests + groupStats.mergeRequests.length
    additions = additions + groupStats.projectStats.additions
    deletions = deletions + groupStats.projectStats.deletions
    branches = branches + groupStats.branches.length
    projects = projects + groupStats.projects.length
  })

  const groups = groupKeyStats.length
  const averageCommits = commits / groups
  const averageIssues = issues / groups
  const averageMergeRequests = mergeRequests / groups
  const averageAdditions = additions / groups
  const averageDeletions = deletions / groups
  const averageBranches = branches / groups
  const averageProjects = projects / groups

  return {
    commits: commits,
    averageCommits: averageCommits,
    issues: issues,
    averageIssues: averageIssues.toFixed(2),
    mergeRequests: mergeRequests,
    averageMergeRequests: averageMergeRequests.toFixed(2),
    additions: additions,
    averageAdditions: averageAdditions.toFixed(2),
    deletions: deletions,
    averageDeletions: averageDeletions.toFixed(2),
    branches: branches,
    averageBranches: averageBranches.toFixed(2),
    projects: projects,
    averageProjects: averageProjects.toFixed(2),
  }
}


const CourseDashboard = ({ session, courseGroupsBB, courseGroupsGit, bbGitConnection }) => {
  const matches = useMediaQuery("(max-width:400px)")
  const router = useRouter()
  const { term, courseId } = router.query
  const sessionCourse = session.bbUserCourses.find(course => course.id === courseId)
  const [stats, setStats] = useState({})

  useEffect(() => {
    if(courseGroupsGit.length > 0) {
      calcultateGitStats(term, courseId, courseGroupsBB, courseGroupsGit, false).then(data => {
        setStats(data)
      })
    }
  }, [courseGroupsBB, courseGroupsGit, courseId, term])

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
            {bbGitConnection.error
              ? <CreateGitConnectionLink />
              : !bbGitConnection.pat
                ? <CreatePatConnectionLink />
                : undefined
            }
          </Grid>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            item
            xs={12}
            md={3}
          >
            <Typography>
                  Stats for all groups
            </Typography>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            style={{
              padding: "2rem",
            }}
            spacing={2}
          >
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
              item
              xs={12}
              sm={4}
              md={3}
            >
              <Typography>
                  Projects: {stats.projects}
              </Typography>
              <Typography>
                  Commits: {stats.commits}
              </Typography>
              <Typography>
                  Branches: {stats.branches}
              </Typography>
            </Grid>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
              item
              xs={12}
              sm={4}
              md={3}
            >
              <Typography>
                  Issues: {stats.issues}
              </Typography>
              <Typography>
                  Average Issues: {stats.averageIssues}
              </Typography>
              <Typography>
                  Average Issues: {stats.averageIssues}
              </Typography>
            </Grid>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
              item
              xs={12}
              sm={4}
              md={3}
            >
              <Typography>
                  Pull requests: {stats.mergeRequests}
              </Typography>
              <Typography>
                  Average Pull requests: {stats.averageMergeRequests}
              </Typography>
              <Typography>
                  Average Pull requests: {stats.averageMergeRequests}
              </Typography>
            </Grid>
            <Grid
              container
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              item
              xs={12}
              sm={4}
              md={3}
            >
              <Typography>
                  Average Additions: {stats.averageAdditions}
              </Typography>
              <Typography>
                  Additions: {stats.additions}
              </Typography>
              <Typography>
                  Deletions: {stats.deletions}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export const getServerSideProps = (async (context) => {
  const params = context.params

  const courseGroupsBB = await getCourseGroups(context.req, params)

  const courseGroupsGit = (await GetGroups(context.req, params))?.subGroups

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
    props: { courseGroupsBB, courseGroupsGit, bbGitConnection },
  }
})


export default withAuth(CourseDashboard)