import { Grid, makeStyles, Skeleton, Typography, useTheme } from "@material-ui/core"
import { formatDate } from "utils/format"


const useStyles = makeStyles(theme => ({
  skeleton: {
    width: "100%",
    height: "9rem",
    margin: "0rem 0rem 1rem 0rem",
  },
}))

const GroupsAverageStatsBoard = ({ groupsStats, loading }) => {
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
                  Average stats for other groups
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
                  Projects: {groupsStats.averageProjects}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Commits: {groupsStats.averageCommits}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Branches: {groupsStats.averageBranches}
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
                  - Total: {groupsStats.averageIssues}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  - Open: {groupsStats.averageIssuesOpen}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  - Closed: {groupsStats.averageIssuesClosed}
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
                  - Total: {groupsStats.averageMergeRequests}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  - Open: {groupsStats.averageMergeRequestsOpen}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  - Closed: {groupsStats.averageMergeRequestsClosed}
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
                  Last activity: {formatDate(groupsStats.lastActivity)}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Additions: {groupsStats.averageAdditions}
              </Typography>
              <Typography
                style={{
                  padding: "0rem 0rem 0rem 2rem",
                }}
              >
                  Deletions: {groupsStats.averageDeletions}
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

export default GroupsAverageStatsBoard