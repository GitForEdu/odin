import { useState } from "react"
import { withStyles } from "@material-ui/core/styles"
import Accordion from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import Typography from "@material-ui/core/Typography"
import { Grid } from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"


const Student = ({ student }) => {
  const [expanded, setExpanded] = useState(false)

  const handleChange = () => () => {
    setExpanded(!expanded)
  }

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
              xs={4}
            >
              <Typography>
                Commits: {student.commits ? student.commits : 0}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
            >
              <Typography>
                Additions: {student.additions ? student.additions : 0}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
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


const StudentList = ({ elements }) => {

  const studentList = elements.map((elem, index) => {

    return (
      <Student key={index} student={elem} />
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