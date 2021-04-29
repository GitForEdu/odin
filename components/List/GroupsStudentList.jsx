import { useEffect, useState } from "react"
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles"
import Accordion from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import Typography from "@material-ui/core/Typography"
import { Grid, Skeleton } from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import clsx from "clsx"

const useStyles = makeStyles(theme => ({
  accordion: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      // margin: "auto",
    },
  },
  accordionSummary: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,

  },
  accordionDetails: {
    padding: theme.spacing(2),
  },
  content: {
    "&$expanded": {
      // margin: "0 0",
    },
  },
  expanded: {},
  skeleton: {
    width: "100%",
    height: "3.75rem",
    margin: "0rem 0rem 1rem 0rem",
  },
}))


const Student = ({ student, expandAll, groupStats }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  const [expanded, setExpanded] = useState(false)

  const handleChange = () => () => {
    setExpanded(!expanded)
  }

  useEffect(() => {
    setExpanded(expandAll)
  }, [expandAll])

  // Gitlab provides full name as student.name, Blackboard provides student.name.given and student.name.family
  const name = student.user ? `${student.user.name.given} ${student.user.name.family}` : `${student.name.given} ${student.name.family}`

  const precCommits = ((student.commits / groupStats.commits.length) * 100).toFixed(0)
  const checkedPrecCommits = isNaN(precCommits) ? 0 : precCommits

  const precAdditions = ((student.additions / groupStats.projectStats.additions) * 100).toFixed(0)
  const checkedAdditions = isNaN(precAdditions) ? 0 : precAdditions

  const precMergeRequests = student.mergeRequests && ((student.mergeRequests.length / groupStats.mergeRequests.length) * 100).toFixed(0)
  const checkedMergeRequests = isNaN(precMergeRequests) ? 0 : precMergeRequests


  return (
    <Grid
      item
      xs={12}
    >
      <Accordion className={clsx(classes.accordion, classes.expanded)} disableGutters elevation={0} square expanded={expanded} onChange={handleChange()}>
        <AccordionSummary className={clsx(classes.accordionSummary, classes.expanded, classes.content)} aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
          <Typography>{name}</Typography>
        </AccordionSummary>
        <AccordionDetails className={clsx(classes.accordionDetails, classes.expanded)}>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignContent="center"
            item
          >
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignContent="center"
              item
              xs={6}
              md={4}
            >
              <Grid>
                <Typography>
                  {student.commits ? student.commits : 0}
                </Typography>
              </Grid>
              <Grid>
                <Typography>
                Commits
                </Typography>
              </Grid>
              <Grid>
                <Typography>
                  {checkedPrecCommits}% of group total
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignContent="center"
              item
              xs={6}
              md={4}
            >
              <Grid>
                <Typography>
                  {student.additions ? student.additions : 0}
                </Typography>
              </Grid>
              <Grid>
                <Typography>
                Additions
                </Typography>
              </Grid>
              <Grid>
                <Typography>
                  {checkedAdditions}% of group total
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignContent="center"
              item
              xs={6}
              md={4}
            >
              <Grid>
                <Typography>
                  {student.mergeRequests ? student.mergeRequests.length : 0}
                </Typography>
              </Grid>
              <Grid>
                <Typography>
                Merge requests
                </Typography>
              </Grid>
              <Grid>
                <Typography>
                  {checkedMergeRequests}% of group total
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  )
}


const StudentList = ({ group, expandAll, loading }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  if (loading) {

    return (
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignContent="center"
        item
        spacing={2}
      >
        <Grid
          item
          xs={12}
        >
          <Skeleton
            className={classes.skeleton}
            variant="rect"
          />
        </Grid>
        <Grid
          item
          xs={12}
        >
          <Skeleton
            className={classes.skeleton}
            variant="rect"
          />
        </Grid>
        <Grid
          item
          xs={12}
        >
          <Skeleton
            className={classes.skeleton}
            variant="rect"
          />
        </Grid>
        <Grid
          item
          xs={12}
        >
          <Skeleton
            className={classes.skeleton}
            variant="rect"
          />
        </Grid>
      </Grid>
    )
  }

  const studentList = (group.members).map((elem, index) => {

    return (
      <Student key={index} student={elem} expandAll={expandAll} groupStats={group.groupKeyStats}/>
    )
  })

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignContent="center"
      item
      spacing={2}
    >
      {studentList}
    </Grid>
  )
}

export default StudentList