import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Activity from "components/Activity"
import { Button } from "@material-ui/core"


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
    // Gitlab provides full name as elem.name, Blackboard provides name.given and name.family
    const fullName = elem.user?.name.given ? `${elem.user.name.given} ${elem.user.name.family}` : elem.name
    const data1 = { title: "Commits", amount: elem.commits ? elem.commits : 294 }
    const data2 = { title: "Pull requests", amount: elem.pullRequests ? elem.pullRequests : 50 }
    const data3 = { title: "Wiki edits", amount: elem.wikiEdits ? elem.wikiEdits : 17 }

    return (
      <ListItemLink key={elem.id} alignItems="center" >
        <ListItemText
          primary={fullName}
          secondary={elem.user?.userName || elem.userName}
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
            primary={data1.title}
            secondary={data1.amount}
            primaryTypographyProps={primaryTextStyling}
            secondaryTypographyProps={secondaryTextStyling}
          />
          <ListItemText
            primary={data2.title}
            secondary={data2.amount}
            primaryTypographyProps={primaryTextStyling}
            secondaryTypographyProps={secondaryTextStyling}
          />
          <ListItemText
            primary={data3.title}
            secondary={data3.amount}
            primaryTypographyProps={primaryTextStyling}
            secondaryTypographyProps={secondaryTextStyling}
          />
          {(type === "students" && elem.notInGitlab) && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddUserToGitlab(elem.userName)}
            >
              Attempt GitLab add
            </Button>
          )}
        </ListItem>
      </ListItemLink>
    )
  })

  if (type === "students" || type === "groups") return itemList
}

const ListItemLink = (props) => {
  return <ListItem button component="a" {...props} />
}

const handleAddUserToGitlab = (userName) => {
  console.log(userName, "should have been added to GitLab, not implemented yet")
}

export default List