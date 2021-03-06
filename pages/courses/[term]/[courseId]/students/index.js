import Navbar from "components/Navbar"
import StudentList from "components/List/StudentList"
import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { getCourseStudents } from "pages/api/courses/[term]/[courseId]/users"
import { getAllMembersFromGitlab } from "pages/api/courses/[term]/[courseId]/git/getAllMembers"
import { useState, Fragment } from "react"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import groups from "pages/api/courses/[term]/[courseId]/groups"
import { Button, FormControlLabel, Grid, Switch, TextField } from "@mui/material"
import DatePicker from "@mui/lab/DatePicker"


export const Students = ({ initialUsers }) => {
  const router = useRouter()
  const { courseId, term } = router.query
  const [users, setUsers] = useState(initialUsers)
  const [sinceTime, setSinceTime] = useState(new Date((new Date()).valueOf() - 31536000000))
  const [untilTime, setUntilTime] = useState(new Date((new Date()).valueOf() + 86400000))

  return (
    <>
      <Navbar pageTitle={"All students"} courseId={courseId} term={term} />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={10} md={10}>
          <Grid
            container
            direction="column"
          >
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignContent="center"
              item
            >
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignContent="center"
                item
              >
                <Grid
                  item
                  xs={6}
                  md={3}
                >
                  <DatePicker
                    renderInput={(props) =>
                      <TextField
                        {...props}
                        margin="normal"
                        helperText=""
                      />}
                    label="DatePicker"
                    value={sinceTime}
                    onChange={(newValue) => {
                      setSinceTime(newValue)
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  md={3}
                >
                  <DatePicker
                    renderInput={(props) =>
                      <TextField
                        {...props}
                        margin="normal"
                        helperText=""
                      />}
                    label="DatePicker"
                    value={untilTime}
                    onChange={(newValue) => {
                      setUntilTime(newValue)
                    }}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignContent="center"
                item
              >
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignContent="center"
                  item
                  xs={12}
                  md={3}
                >
                </Grid>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignContent="center"
                  item
                  xs={12}
                  md={6}
                >
                  <Grid
                    item
                    xs={3}
                    md={4}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        const date = new Date()
                        date.setDate(date.getDate()-1)
                        setSinceTime(date)
                        const dateUntil = new Date()
                        setUntilTime(dateUntil)
                      }}
                    >
                Last day
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    md={4}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        const date = new Date()
                        date.setDate(date.getDate()-7)
                        setSinceTime(date)
                        const dateUntil = new Date()
                        setUntilTime(dateUntil)
                      }}
                    >
                Last week
                    </Button>

                  </Grid>
                  <Grid
                    item
                    xs={3}
                    md={4}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        const date = new Date()
                        date.setMonth(date.getMonth()-1)
                        setSinceTime(date)
                        const dateUntil = new Date()
                        setUntilTime(dateUntil)
                      }}
                    >
                Last month
                    </Button>
                  </Grid>

                </Grid>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignContent="center"
                  item
                  xs={12}
                  md={3}
                >
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <h1>Students only in GitLab (should be empty)</h1>
        {users.gitlab && <StudentList elements={users.gitlab} />}
        <h1>Students both in Blackboard and GitLab</h1>
        {users.both && <StudentList elements={users.both} />}
        <h1>Students only in Blackboard student list</h1>
        {users.blackboard && <StudentList elements={users.blackboard} />}
      </Grid>
    </>

  )
}

export const getServerSideProps = (async (context) => {
  const params = context.params

  const bbGitConnection = await getBBGitConnection(context.req, params)

  let courseStudents = await getCourseStudents(context.req, params)

  courseStudents.push({
    availability: { available: "Yes" },
    courseId: "_56_1",
    courseRoleId: "Student",
    created: "2020-12-04T13:47:11.996Z",
    dataSourceId: "_2_1",
    id: "_999_1",
    modified: "2020-12-04T13:47:11.996Z",
    userId: "_105_1",
    user: {
      availability: { available: "Yes" },
      avatar: { viewUrl: "https://ntnu-saastest.blackboard.com/public/v1/users/_70_1/avatar", source: "Default" },
      created: "2020-12-04T13:35:33.923Z",
      educationLevel: "Unknown",
      gender: "Unknown",
      id: "_70_1",
      modified: "2021-02-19T11:22:24.954Z",
      name: { given: "Petter Gr??", family: "Rein" },
      userName: "pettegre",
    },
  })

  console.log("getserversideprops 1st student", courseStudents[0])

  let groupMembers = await getAllMembersFromGitlab(context.req, params)
  if (groupMembers.message) {
    console.log(groupMembers.message)
  }
  console.log("getserversideprops groupmembers", groupMembers)

  const initialUsers = {
    blackboard: courseStudents,
    gitlab: groupMembers ? groupMembers : [],
    both: [],
  }

  if (!groupMembers.message) {
    // This block should probably be refactored
    // Add users present in both Gitlab and Blackboard to bothlist
    const usersPresentInBoth = initialUsers.gitlab.filter(gitlabUser => initialUsers.blackboard.find(blackboardUser => blackboardUser.user.userName === gitlabUser.userName))
    initialUsers.both = usersPresentInBoth
    // Remove users in both from GitLab list
    initialUsers.gitlab = initialUsers.gitlab.filter(gitlabUser => usersPresentInBoth.find(bothUser => (gitlabUser.userName === bothUser.userName) === false))
    initialUsers.blackboard = initialUsers.blackboard.filter(blackboardUser => usersPresentInBoth.find(bothUser => (blackboardUser.user.userName === bothUser.userName) === false))
  }

  if (!courseStudents) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  if (initialUsers.blackboard.length > 0 && bbGitConnection.pat) initialUsers.blackboard.forEach(student => student.notInGitlab = true)

  if (groupMembers.message) initialUsers.gitlab = []

  // TODO: Remove mock actitivty
  if(!groupMembers.message) {
    initialUsers.both[0].activity = {
      commits: 294 ,
      pullRequests: 50,
      wikiEdits: 17,
    }
  }
  return {
    props: { initialUsers, bbGitConnection },
  }
})

export default withAuth(Students)
