import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Activity from "components/Activity"

const List = ({ type, elements }) => {

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

  const itemList = elements.map(elem => {
    return (
      <ListItemLink key={elem.id} alignItems="center" >
        <ListItemText
          primary={"Stian Student Studentsen"}
          secondary={elem.id}
          primaryTypographyProps={primaryTextStyling}
          secondaryTypographyProps={primaryTextStyling}
        />

        <ListItem alignItems="flex-start">
          <Activity
            data={[0, 1, 2, 3, 2, 2, 3, 2, 3, 1, 1, 3, 3, 2, 1, 0, 0, 2, 2, 1, 0, 3, 2, 1, 0, 1, 3, 2]}
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Commits"
            secondary={"294"}
            primaryTypographyProps={primaryTextStyling}
            secondaryTypographyProps={secondaryTextStyling}
          />
          <ListItemText
            primary="Pull requests"
            secondary={"50"}
            primaryTypographyProps={primaryTextStyling}
            secondaryTypographyProps={secondaryTextStyling}
          />
          <ListItemText
            primary="Wiki edits"
            secondary={"17"}
            primaryTypographyProps={primaryTextStyling}
            secondaryTypographyProps={secondaryTextStyling}
          />
        </ListItem>
      </ListItemLink>
    )
  })
  if (type === "students") return (
    <>
      <h1>Student list</h1>
      { itemList }
    </>
  )
  if (type === "groups") return (
    <>
      <h1>Group list</h1>
      { itemList }
    </>
  )
}

const ListItemLink = (props) => {
  return <ListItem button component="a" {...props} />
}

export default List