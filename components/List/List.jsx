import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"


const List = ({ type, elements }) => {
  const itemList = elements.map(elem => {
    return <ListItemLink key={elem.id}><ListItemText primary={elem.id} /></ListItemLink>
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