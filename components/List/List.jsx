import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Activity from "components/Activity"

const List = ({ type, elements }) => {

  console.log("List elements", elements)

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
    const fullName = elem.name ? elem.name : "Stian Student Studentsen"
    const data1 = { title: "Commits", amount: elem.commits ? elem.commits : 294 }
    const data2 = { title: "Pull requests", amount: elem.pullRequests ? elem.pullRequests : 50 }
    const data3 = { title: "Wiki edits", amount: elem.wikiEdits ? elem.wikiEdits : 17 }

    return (
      <ListItemLink key={elem.id} alignItems="center" >
        <ListItemText
          primary={fullName}
          secondary={elem.username ? elem.username : elem.id}
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