import { Grid, Skeleton, Typography } from "@mui/material"
import { makeStyles, useTheme } from "@mui/styles"
import { useEffect, useState } from "react"
import calcultateGitStats from "./getCourseOverviewStats"

const useStyles = makeStyles(theme => ({
  skeleton: {
    width: "100%",
    height: "18rem",
    margin: "0rem 0rem 1rem 0rem",
  },
}))

const CourseOverviewStats = ({ courseGroupsBB, courseGroupsGit, courseId, term, sinceTime, untilTime }) => {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const theme = useTheme()
  const classes = useStyles(theme)

  useEffect(() => {
    setLoading(true)
    if(courseGroupsGit.length > 0) {
      calcultateGitStats(term, courseId, courseGroupsBB, courseGroupsGit, sinceTime, untilTime).then(data => {
        setStats(data)
        setLoading(false)
      })
    }
  }, [courseGroupsBB, courseGroupsGit, courseId, term, sinceTime, untilTime])

  return (
    <>
      { !loading
        ? <>
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
                  Issues:
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  - Total: {stats.issues ? stats.issues.length : 0}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  - Average: {stats.averageIssues}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  - Average open: {stats.averageOpenIssues}
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
                  Merge requests:
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  - Total: {stats.mergeRequests ? stats.mergeRequests.length : 0}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  - Average: {stats.averageMergeRequests}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  - Average Open: {stats.averageOpenMergeRequests}
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
        </>
        : <>
          <Grid
            item
            xs={12}
            md={12}
            spacing={0}
            style={{
              height: "30rem",
            }}
          >
            <Skeleton
              className={classes.skeleton}
              variant="rect"
            />
          </Grid>
        </>
      }
    </>
  )
}

export default CourseOverviewStats