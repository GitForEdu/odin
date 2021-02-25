import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import StudentActivity from "./StudentActivity"

const StudentList = ({ elements }) => {
  const secondaryTextStyling = { style:
    {
      color: "white",
      fontSize: "1rem",
    },
  }

  const itemList = elements.map(elem => {
    // Gitlab provides full name as elem.name, Blackboard provides name.given and name.family
    const fullName = elem.user?.name.given ? `${elem.user.name.given} ${elem.user.name.family}` : elem.name

    return (
      <ListItemLink key={elem.id} alignItems="center" >
        <ListItem>
          <ListItemText
            primary={fullName}
            secondary={elem.user?.userName || elem.userName}
            secondaryTypographyProps={secondaryTextStyling}
          />
        </ListItem>
        {elem.activity && <StudentActivity userName={elem.userName} activity={elem.activity}/>}
      </ListItemLink>
    )
  })

  return itemList
}

const ListItemLink = (props) => {
  return <ListItem button component="a" {...props} />
}

export default StudentList