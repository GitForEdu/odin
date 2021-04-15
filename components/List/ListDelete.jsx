import ListItemText from "@material-ui/core/ListItemText"
import { Button, Grid } from "@material-ui/core"


const primaryTextStyling = { style:
  {
    color: "white",
    textAlign: "center",
  },
}


const ListDelete = ({ elements, deleteFunc, disabled }) => {
  const itemList = elements.map(elem => {
    return (
      <Grid
        key={elem.id}
        container
        item
      >
        <Grid item xs={2}></Grid>
        <Grid
          item
          xs={8}
        >
          <ListItemText
            primary={elem.name}
            primaryTypographyProps={primaryTextStyling}
            secondaryTypographyProps={primaryTextStyling}
          />
        </Grid>
        <Grid
          item
          xs={2}
        >
          <Button
            variant="contained"
            color="primary"
            disabled={disabled}
            onClick={() => deleteFunc(elem)}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    )
  })

  return (
    <>
      { itemList }
    </>
  )
}


export default ListDelete