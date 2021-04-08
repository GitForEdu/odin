import { useEffect, useState } from "react"
import { makeStyles, withStyles } from "@material-ui/core/styles"
import Accordion from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import Typography from "@material-ui/core/Typography"
import { Grid } from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

const AccordionStyles = makeStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})

const AccordionSummaryStyles = makeStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})

const AccordionDetailsStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))


const Student = ({ student, expandAll }) => {
  const [expanded, setExpanded] = useState(false)

  const handleChange = () => () => {
    setExpanded(!expanded)
  }

  useEffect(() => {
    setExpanded(expandAll)
  }, [expandAll])

  // Gitlab provides full name as student.name, Blackboard provides student.name.given and student.name.family
  const name = student.user ? `${student.user.name.given} ${student.user.name.family}` : `${student.name.given} ${student.name.family}`

  return (
    <Grid
      item
      xs={12}
    >
      <Accordion square expanded={expanded} onChange={handleChange()}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
          <Typography>{name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignContent="center"
            item
          >
            <Grid
              item
              xs={6}
              md={4}
            >
              <Typography>
                Commits: {student.commits ? student.commits : 0}
              </Typography>
            </Grid>
            <Grid
              xs={6}
              md={4}
            >
              <Typography>
                Additions: {student.additions ? student.additions : 0}
              </Typography>
            </Grid>
            <Grid
              xs={6}
              md={4}
            >
              <Typography>
                Merge requests: {student.mergeRequests ? student.mergeRequests.length : 0}
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  )
}


const StudentList = ({ elements, expandAll }) => {

  const studentList = elements.map((elem, index) => {

    return (
      <Student key={index} student={elem} expandAll={expandAll}/>
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