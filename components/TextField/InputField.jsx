import { TextField } from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"
import clsx from "clsx"


const styles = () => {

  return ({
    root: {
    },
  })
}

const StyledInputField = ({ classes, children, className, ...other }) => {

  return (
    <TextField
      variant="outlined"
      color="primary"
      className={clsx(classes.root, className)}
      {...other}>
      {children}
    </TextField>
  )
}

export default withStyles(styles)(StyledInputField)
