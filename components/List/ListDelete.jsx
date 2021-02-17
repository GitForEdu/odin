import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import StyledButton from "components/Button"

const primaryTextStyling = { style:
  {
    color: "white",
    textAlign: "center",
  },
}

const secondaryTextStyling = { style:
  {
    color: "white",
    textAlign: "center",
    fontSize: "1.5rem",
  },
}

const ListDelete = ({ elements, deleteFunc, disabled }) => {
  const itemList = elements.map(elem => {
    return (
      <ListItemLink key={elem.id} alignItems="center" >
        <ListItemText
          primary={elem.name}
          secondary={elem.username ? elem.username : elem.id}
          primaryTypographyProps={primaryTextStyling}
          secondaryTypographyProps={primaryTextStyling}
        />
        <StyledButton disabled={disabled} onClick={() => deleteFunc(elem)}>Delete</StyledButton>

      </ListItemLink>
    )
  })

  return (
    <>
      { itemList }
    </>
  )
}

const ListItemLink = (props) => {
  return <ListItem button component="a" {...props} />
}

export default ListDelete