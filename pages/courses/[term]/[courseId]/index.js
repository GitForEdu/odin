import React, { useEffect, useState } from "react"
import Tile from "components/Tile"
import Navbar from "components/Navbar"
import withAuth from "components/withAuth"
import { Button, Grid, TextField, Typography, useMediaQuery } from "@material-ui/core"
import { useRouter } from "next/router"
import Link from "next/link"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import { CreateGitConnectionLink, CreatePatConnectionLink } from "components/GitConnection"
import fetcher from "utils/fetcher"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import { GetGroups } from "pages/api/courses/[term]/[courseId]/git/groups"
import DatePicker from "@material-ui/lab/DatePicker"

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

const calcultateGitStats = async (term, courseId, courseGroupsBB, courseGroupsGit, sinceTime, untilTime) => {
  const groupKeyStats = await fetcher(
    `/api/courses/${term}/${courseId}/git/groups/getGroupsKeyStats?since=${sinceTime.getFullYear()}.${sinceTime.getMonth()}.${sinceTime.getDate()}&until=${untilTime.getFullYear()}.${untilTime.getMonth()}.${untilTime.getDate() + 1}&groupPaths=${courseGroupsGit.map(group => encodeURIComponent(group.full_path)).join(",")}`,
    {},
    "GET"
  )

  let membersBB = 0

  courseGroupsBB.forEach(groupBB => {
    membersBB = membersBB + groupBB.members.length
  })
  const averageMembersBB = membersBB / courseGroupsBB.length

  let commits = 0
  let issues = []
  let mergeRequests = []
  let additions = 0
  let deletions = 0
  let branches = 0
  let projects = 0
  let membersGit = 0
  let groupMostCommitsCount = null
  let groupMostCommits = ""
  let groupFewestCommits = ""
  let groupFewestCommitsCount = null
  let groupMostIssuesCount = null
  let groupMostIssues = ""
  let groupFewestIssues = ""
  let groupFewestIssuesCount = null

  groupKeyStats.forEach(groupStats => {
    commits = commits + groupStats.commits.length
    issues = [...issues, ...groupStats.issues]
    mergeRequests = [...mergeRequests, ...groupStats.mergeRequests]
    additions = additions + groupStats.projectStats.additions
    deletions = deletions + groupStats.projectStats.deletions
    branches = branches + groupStats.branches.length
    projects = projects + groupStats.projects.length
    membersGit = membersGit + groupStats.members.length

    if ((groupStats.commits.length > groupMostCommitsCount) || (groupStats.commits.length && !groupFewestCommitsCount)) {
      groupMostCommitsCount = groupStats.commits.length
      groupMostCommits = groupStats.name
    }
    if ((groupStats.commits.length < groupFewestCommitsCount) || (groupStats.commits.length && !groupFewestCommitsCount)) {
      groupFewestCommitsCount = groupStats.commits.length
      groupFewestCommits = groupStats.name
    }
    if ((groupStats.issues.length > groupMostIssuesCount) || (groupStats.issues.length && !groupFewestIssuesCount)) {
      groupMostIssuesCount = groupStats.issues.length
      groupMostIssues = groupStats.name
    }
    if ((groupStats.issues.length < groupFewestIssuesCount) || (groupStats.issues.length && !groupFewestIssuesCount)) {
      groupFewestIssuesCount = groupStats.issues.length
      groupFewestIssues = groupStats.name
    }
  })

  const groups = groupKeyStats.length
  const averageCommits = commits / groups
  const averageIssues = issues.length / groups
  const averageMergeRequests = mergeRequests.length / groups
  const averageAdditions = additions / groups
  const averageDeletions = deletions / groups
  const averageBranches = branches / groups
  const averageProjects = projects / groups
  const averageMembersGit = membersGit / groups
  const averageOpenIssues = issues.filter(issue => issue.state === "opened").length / groups
  const averageOpenMergeRequests = mergeRequests.filter(mergeRequests => mergeRequests.state === "opened").length / groups

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
    averageMembersBB: averageMembersBB.toFixed(2),
    averageMembersGit: averageMembersGit.toFixed(2),
    groupFewestCommits: groupFewestCommits,
    groupFewestCommitsCount: groupFewestCommitsCount,
    groupMostCommits: groupMostCommits,
    groupMostCommitsCount: groupMostCommitsCount,
    groupFewestIssues: groupFewestIssues,
    groupFewestIssuesCount: groupFewestIssuesCount,
    groupMostIssues: groupMostIssues,
    groupMostIssuesCount: groupMostIssuesCount,
    averageOpenIssues: averageOpenIssues.toFixed(2),
    averageOpenMergeRequests: averageOpenMergeRequests.toFixed(2),
  }
}


const CourseDashboard = ({ session, courseGroupsBB, courseGroupsGit, bbGitConnection }) => {
  const matches = useMediaQuery("(max-width:400px)")
  const router = useRouter()
  const { term, courseId } = router.query
  const [sinceTime, setSinceTime] = useState(new Date((new Date()).valueOf() - 31536000000))
  const [untilTime, setUntilTime] = useState(new Date((new Date()).valueOf() + 86400000))
  const sessionCourse = session.bbUserCourses.find(course => course.id === courseId)
  const [stats, setStats] = useState({})

  useEffect(() => {
    if(courseGroupsGit.length > 0) {
      calcultateGitStats(term, courseId, courseGroupsBB, courseGroupsGit, sinceTime, untilTime).then(data => {
        setStats(data)
      })
    }
  }, [courseGroupsBB, courseGroupsGit, courseId, term])
  console.log(stats)
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
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignContent="center"
              item
            >
              <Grid
                item
                xs={6}
                md={3}
              >
                <DatePicker
                  renderInput={(props) =>
                    <TextField
                      {...props}
                      margin="normal"
                      helperText=""
                    />}
                  label="DatePicker"
                  value={sinceTime}
                  onChange={(newValue) => {
                    setSinceTime(newValue)
                  }}
                />
              </Grid>
              <Grid
                item
                xs={6}
                md={3}
              >
                <DatePicker
                  renderInput={(props) =>
                    <TextField
                      {...props}
                      margin="normal"
                      helperText=""
                    />}
                  label="DatePicker"
                  value={untilTime}
                  onChange={(newValue) => {
                    setUntilTime(newValue)
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignContent="center"
              item
            >
              <Grid
                item
                xs={3}
                md={3}
              >
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignContent="center"
                item
                xs={12}
                md={6}
              >
                <Grid
                  item
                  xs={3}
                  md={4}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      const date = new Date()
                      date.setDate(date.getDate()-1)
                      setSinceTime(date)
                      const dateUntil = new Date()
                      setUntilTime(dateUntil)
                    }}
                  >
                Last day
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={3}
                  md={4}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      const date = new Date()
                      date.setDate(date.getDate()-7)
                      setSinceTime(date)
                      const dateUntil = new Date()
                      setUntilTime(dateUntil)
                    }}
                  >
                Last week
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={3}
                  md={4}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      const date = new Date()
                      date.setMonth(date.getMonth()-1)
                      setSinceTime(date)
                      const dateUntil = new Date()
                      setUntilTime(dateUntil)
                    }}
                  >
                Last month
                  </Button>
                </Grid>
              </Grid>
              <Grid
                item
                xs={3}
                md={3}
              ></Grid>
            </Grid>
          </Grid>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            item
            xs={12}
            md={12}
            style={{
              backgroundColor: "#424242",
              padding: "1rem 0rem 1rem 0.5rem",
            }}
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
              margin: "0rem 0rem 1rem 0rem",
              padding: "0rem 0rem 1rem 0rem",
              backgroundColor: "#424242",
            }}
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
              style={{
                padding: "0rem 0rem 1rem 0rem",
              }}
            >
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Projects: {stats.projects}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Commits: {stats.commits}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
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
              style={{
                padding: "0rem 0rem 1rem 0rem",
              }}
            >
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Issues: {stats.issues ? stats.issues.length : 0}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Average Issues: {stats.averageIssues}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Average open Issues: {stats.averageOpenIssues}
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
              style={{
                padding: "0rem 0rem 1rem 0rem",
              }}
            >
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Merge requests: {stats.mergeRequests ? stats.mergeRequests.length : 0}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Average Merge requests: {stats.averageMergeRequests}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Average Open MR's: {stats.averageOpenMergeRequests}
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
              style={{
                padding: "0rem 0rem 1rem 0rem",
              }}
            >
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Average Additions: {stats.averageAdditions}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Additions: {stats.additions}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Deletions: {stats.deletions}
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
              style={{
                padding: "0rem 0rem 1rem 0rem",
              }}
            >
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Most commits: {stats.groupMostCommits}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Most commits count: {stats.groupMostCommitsCount}
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
              style={{
                padding: "0rem 0rem 1rem 0rem",
              }}
            >
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Fewest commits: {stats.groupFewestCommits}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Fewest commits count: {stats.groupFewestCommitsCount}
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
              style={{
                padding: "0rem 0rem 1rem 0rem",
              }}
            >
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Most issues: {stats.groupMostIssues}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Most issues count: {stats.groupMostIssuesCount}
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
              style={{
                padding: "0rem 0rem 1rem 0rem",
              }}
            >
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Fewest issues: {stats.groupFewestIssues}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Fewest issues count: {stats.groupFewestIssuesCount}
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
              style={{
                padding: "0rem 0rem 1rem 0rem",
              }}
            >
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Members per group BB: {stats.averageMembersBB}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Members per group Git: {stats.averageMembersGit}
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