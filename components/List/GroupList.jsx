import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Activity from "components/Activity"

const GroupList = ({ elements }) => {
  const secondaryTextStyling = { style:
    {
      color: "white",
      fontSize: "1rem",
    },
  }

  const itemList = elements.map(elem => {
    // Gitlab provides full name as elem.name, Blackboard provides name.given and name.family
    const fullName = `Group ${elem.name}`
    const data1 = { title: "Commits", amount: elem.commits || 294 }
    const data2 = { title: "Pull requests", amount: elem.pullRequests || 50 }
    const data3 = { title: "Wiki edits", amount: elem.wikiEdits || 17 }

    return (
      <ListItemLink key={elem.id} alignItems="center" >
        <ListItem>
          <ListItemText
            primary={fullName}
            secondary={elem.user?.userName || elem.userName}
            secondaryTypographyProps={secondaryTextStyling}
          />
        </ListItem>

        <ListItem>
          <Activity
            data={[0, 1, 2, 3, 2, 2, 3, 2, 3, 1, 1, 3, 3, 2, 1, 0, 0, 2, 2, 1, 0, 3, 2, 1, 0, 1, 3, 2]}
          />
        </ListItem>

        <ListItem>
          <ListItemText primary={data1.title} secondary={data1.amount}/>
          <ListItemText primary={data2.title} secondary={data2.amount}/>
          <ListItemText primary={data3.title} secondary={data3.amount}/>
        </ListItem>
      </ListItemLink>
    )
  })

  return itemList
}

const ListItemLink = (props) => {
  return <ListItem button component="a" {...props} />
}

export default GroupList