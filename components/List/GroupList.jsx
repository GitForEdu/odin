import { Grid } from "@material-ui/core"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Activity from "components/Activity"

const GroupList = ({ groups }) => {
  const secondaryTextStyling = { style:
    {
      color: "white",
      fontSize: "1rem",
    },
  }

  const itemList = groups.map((group, index) => {
    console.log(group)
    console.log(group.repositories)
    // Gitlab provides full name as elem.name, Blackboard provides name.given and name.family
    const fullName = `${group.name}`

    return (
      <ListItemLink key={index} alignItems="center" href={`groups/${group.id}`} >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          item
          xs={12}
        >
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            item
            xs={2}
          >
            <Grid
              item
              xs={12}
            >
              <ListItemText
                primary={fullName}
                secondary={group.user?.userName || group.userName}
                secondaryTypographyProps={secondaryTextStyling}
              />
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            item
            xs={10}
          >
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              item
              xs={12}
            >
              <Grid
                item
                xs
              >
                <ListItemText primary={"Issues"} secondary={group.issues.length}/>
              </Grid>
              <Grid
                item
                xs
              >

                <ListItemText primary={"Unassgined issues"} secondary={group.issues.map(issue => issue.assignees.nodes.length).filter(assigneesCount => assigneesCount === 0).length}/>
              </Grid>
              <Grid
                item
                xs
              >
                <ListItemText primary={"Commits"} secondary={group.commits.length}/>
              </Grid>
              <Grid
                item
                xs
              >
                <ListItemText primary={"MRs"} secondary={group.mergeRequests.length}/>
              </Grid>
              <Grid
                item
                xs
              >
                <ListItemText primary={"Wikis size"} secondary={group.totalWikiSize}/>
              </Grid>
              <Grid
                item
                xs
              >
                <ListItemText primary={"Wikis pages"} secondary={group.wikiPages.length}/>
              </Grid>
              <Grid
                item
                xs
              >
                <ListItemText primary={"Milestones"} secondary={group.milestones.length}/>
              </Grid>
              <Grid
                item
                xs
              >
                <ListItemText primary={"Projectes"} secondary={group.projects.length}/>
              </Grid>
              <Grid
                item
                xs
              >
                <ListItemText primary={"Branches"} secondary={group.branches.length}/>
              </Grid>
              <Grid
                item
                xs
              >
                <ListItemText primary={"Members"} secondary={group.members.length}/>
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
      justifyContent="center"
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