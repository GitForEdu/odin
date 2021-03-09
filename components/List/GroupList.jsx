import { Grid } from "@material-ui/core"
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

  const itemList = elements.map((elem, index) => {
    // Gitlab provides full name as elem.name, Blackboard provides name.given and name.family
    const fullName = `${elem.name}`
    const data1 = { title: "Commits", amount: elem.commits || 294 }
    const data2 = { title: "Pull requests", amount: elem.pullRequests || 50 }
    const data3 = { title: "Wiki edits", amount: elem.wikiEdits || 17 }

    return (
      <Grid
        key={index}
        container
        direction="row"
        justify="center"
        alignItems="center"
        item
        xs={12}
      >
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
          item
          xs={6}
        >
          <Grid
            item
            xs={6}
          >
            <ListItemText
              primary={fullName}
              secondary={elem.user?.userName || elem.userName}
              secondaryTypographyProps={secondaryTextStyling}
            />
          </Grid>
          <Grid
            item
            xs={6}
          >
            <Activity
              data={[0, 1, 2, 3, 2, 2, 3, 2, 3, 1, 1, 3, 3, 2, 1, 0, 0, 2, 2, 1, 0, 3, 2, 1, 0, 1, 3, 2]}
            />
          </Grid>


        </Grid>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          item
          xs={6}
        >
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            item
            xs={12}
          >
            <Grid
              item
              xs={4}
            >
              <ListItemText primary={data1.title} secondary={data1.amount}/>
            </Grid>
            <Grid
              item
              xs={4}
            >

              <ListItemText primary={data2.title} secondary={data2.amount}/>
            </Grid>
            <Grid
              item
              xs={4}
            >
              <ListItemText primary={data3.title} secondary={data3.amount}/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  })

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      spacing={2}
    >
      {itemList}
    </Grid>
  )
}

const ListItemLink = (props) => {
  return <ListItem button component="a" {...props} />
}

export default GroupList