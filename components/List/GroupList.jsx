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
    const data1 = { title: "Issues", amount: elem.issuesCount }
    const data2 = { title: "Issues Open", amount: elem.issuesOpen }
    const data3 = { title: "Commits", amount: elem.commitCount }

    return (
      <ListItemLink key={index} alignItems="center" href={`groups/${elem.id}`} >
        <Grid
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
      </ListItemLink>
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