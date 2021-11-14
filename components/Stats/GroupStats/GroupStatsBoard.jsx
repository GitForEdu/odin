import { Grid, Skeleton, Typography } from "@mui/material"
import { makeStyles, useTheme } from "@mui/styles"
import { formatDate } from "utils/format"


const useStyles = makeStyles(theme => ({
  skeleton: {
    width: "100%",
    height: "9rem",
    margin: "0rem 0rem 1rem 0rem",
  },
}))

const GroupStatsBoard = ({ courseGroup, loading }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

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
            md={3}
            style={{
              backgroundColor: "#424242",
              padding: "1rem 0rem 1rem 0.5rem",
            }}
          >
            <Typography>
                  Stats for this group
            </Typography>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
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
              md={3}
            >
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Projects: {courseGroup.groupKeyStats.projects.length}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Commits: {courseGroup.groupKeyStats.commits.length}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Branches: {courseGroup.groupKeyStats.branches.length}
              </Typography>
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
                  - Total: {courseGroup.groupKeyStats.issues.length}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  - Open: {courseGroup.groupKeyStats.issues.filter(issue => issue.state === "opened").length}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  - Closed: {courseGroup.groupKeyStats.issues.filter(issue => issue.state === "closed").length}
              </Typography>
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
                  - Total: {courseGroup.groupKeyStats.mergeRequests.length}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  - Open: {courseGroup.groupKeyStats.mergeRequests.filter(mr => mr.state === "opened").length}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  - Closed: {courseGroup.groupKeyStats.mergeRequests.filter(mr => mr.state === "closed").length}
              </Typography>
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
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Last activity: {formatDate(courseGroup.groupKeyStats.projectStats.lastActivity)}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Additions: {courseGroup.groupKeyStats.projectStats.additions}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Deletions: {courseGroup.groupKeyStats.projectStats.deletions}
              </Typography>
            </Grid>
          </Grid>
        </>
        : <Grid
          xs={12}
          md={12}
        >
          <Skeleton
            className={classes.skeleton}
            variant="rect"
          />
        </Grid>
      }
    </>
  )
}

export default GroupStatsBoard