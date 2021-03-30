import { useState } from "react"
import { withStyles } from "@material-ui/core/styles"
import Accordion from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import Typography from "@material-ui/core/Typography"
import { Grid } from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"


const Student = ({ name }) => {
  const [expanded, setExpanded] = useState(false)

  const handleChange = () => () => {
    setExpanded(!expanded)
  }

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
                {name}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
            >
              <Typography>
                {name}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
            >
              <Typography>
                {name}
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
    // Gitlab provides full name as elem.name, Blackboard provides name.given and name.family
    const fullName = elem.user ? `${elem.user.name.given} ${elem.user.name.family}` : `${elem.name.given} ${elem.name.family}`

    return (
      <Student key={index} name={fullName} />
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