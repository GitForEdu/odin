import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Activity from "components/Activity"
import { Button } from "@material-ui/core"


const StudentActivity = ({ userName, activity }) => {
  const data1 = { title: "Commits", amount: activity.commits || 294 }
  const data2 = { title: "Merge requests", amount: activity.pullRequests || 50 }
  const data3 = { title: "Wiki edits", amount: activity.wikiEdits || 17 }

  return (
    <>
      <ListItem>
        <Activity
          data={[0, 1, 2, 3, 2, 2, 3, 2, 3, 1, 1, 3, 3, 2, 1, 0, 0, 2, 2, 1, 0, 3, 2, 1, 0, 1, 3, 2]}
        />
      </ListItem>

      <ListItem>
        <ListItemText primary={data1.title} secondary={data1.amount}/>
        <ListItemText primary={data2.title} secondary={data2.amount}/>
        <ListItemText primary={data3.title} secondary={data3.amount}/>

        {/* <Button
          variant="contained"
          color="primary"
          onClick={() => handleAddUserToGitlab(userName)}
        >
              Attempt GitLab add
        </Button> */}
      </ListItem>
    </>
  )
}

const handleAddUserToGitlab = (userName) => {
  console.log(userName, "should have been added to GitLab, not implemented yet")
}

export default StudentActivity