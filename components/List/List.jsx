import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Activity from "components/Activity"

const List = ({ type, elements }) => {
  const itemList = elements.map(elem => {
    return (
      <ListItemLink key={elem.id}>
        <ListItemText primary={"Stian Student Studentsen"} secondary={elem.id} />
        <ListItemText primary="Activity" secondary={<Activity />} />
        <ListItemText primary="Commits" secondary={"294"} />
        <ListItemText primary="Pull requests" secondary={"50"} />
        <ListItemText primary="Wiki edits"secondary={"17"} />
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