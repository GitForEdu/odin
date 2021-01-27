import { Button } from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"
import clsx from "clsx"


const styles = () => {

  return ({
    root: {
    },
  })
}

const StyledButton = ({ classes, children, className, ...other }) => {

  return (
    <Button
      variant="contained"
      color="primary"
      className={clsx(classes.root, className)}
      {...other}>
      {children}
    </Button>
  )
}

export default withStyles(styles)(StyledButton)
