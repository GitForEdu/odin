import Navbar from "components/Navbar"
import GroupList from "components/List/GroupList"
import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import { useEffect, useState } from "react"
import fetcher from "utils/fetcher"
import { Button, Checkbox, FormControlLabel, Grid, makeStyles, Modal, TextField, Typography } from "@material-ui/core"
import Link from "next/link"
import { GetGroups } from "pages/api/courses/[term]/[courseId]/git/groups"
import DatePicker from "@material-ui/lab/DatePicker"
import EnhancedTable from "components/List/GroupListTable"
import CloseIcon from "@material-ui/icons/Close"


const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

const mergeBBGitKeyStats = async (term, courseId, courseGroupsBB, courseGroupsGit, sinceTime, untilTime) => {
  const groupKeyStats = await fetcher(
    `/api/courses/${term}/${courseId}/git/groups/getGroupsKeyStats?since=${sinceTime.getFullYear()}.${sinceTime.getMonth()}.${sinceTime.getDate()}&until=${untilTime.getFullYear()}.${untilTime.getMonth()}.${untilTime.getDate() + 1}&groupPaths=${courseGroupsGit.map(group => encodeURIComponent(group.full_path)).join(",")}`,
    {},
    "GET"
  )

  // const courseGroups = courseGroupsBB.map(group => {
  //   const groupGitInfo = groupKeyStats.find(groupGit => groupGit.name === group.name)
  //   return { ...groupGitInfo, ...group }
  // })

  return groupKeyStats
}

const cellList = [
  { label: "Issues", type: "numeric", dataLabel: "issues" },
  { label: "Commits", type: "numeric", dataLabel: "commits" },
  { label: "Members", type: "numeric", dataLabel: "members" },
  { label: "Branches", type: "numeric", dataLabel: "branches" },
  { label: "Merge Requests", type: "numeric", dataLabel: "mergeRequests" },
  { label: "Projects", type: "numeric", dataLabel: "projects" },
  { label: "Milestones", type: "numeric", dataLabel: "milestones" },
  { label: "Wiki Pages", type: "numeric", dataLabel: "wikiPages" },
  { label: "Wiki Size", type: "numeric", dataLabel: "wikiSize" },
  { label: "Unassgined Issues", type: "numeric", dataLabel: "unassginedIssues" },
  { label: "Time of first commit", type: "date", dataLabel: "firstCommit" },
  { label: "Time of last commit", type: "date", dataLabel: "lastCommit" },
  { label: "Last Activity in a project", type: "date", dataLabel: "lastActivity" },
  { label: "Lines of code", type: "numeric", dataLabel: "linesOfCode" },
  { label: "Number of files", type: "numeric", dataLabel: "numberOfFiles" },
  { label: "Additions", type: "numeric", dataLabel: "additions" },
  { label: "Deletions", type: "numeric", dataLabel: "deletions" },
]

const ModalColumns = ({ classes, columnSelectors, handleModal }) => (
  <div
    className={classes.paper}
  >
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="flex-start"
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleModal}
        >
          <CloseIcon />
        </Button>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        {columnSelectors}
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="flex-end"
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleModal}
        >
          Set filters
        </Button>
      </Grid>
    </Grid>
  </div>
)

export const Group = ({ courseGroupsBB, courseGroupsGit, bbGitConnection }) => {
  const router = useRouter()
  const { courseId, term } = router.query
  const [sinceTime, setSinceTime] = useState(new Date((new Date()).valueOf() - 31536000000))
  const [untilTime, setUntilTime] = useState(new Date((new Date()).valueOf() + 86400000))
  const [loadingCreateSubGroups, setLoadingCreateSubGroups] = useState(false)
  const [courseGroups, setCourseGroups] = useState([])
  const [cells, setCells] = useState([{ label: "Issues", type: "numeric", dataLabel: "issues" }, { label: "Members", type: "numeric", dataLabel: "members" }])
  const [modalState, setModalState] = useState(false)
  const classes = useStyles()

  const handleModal = () => {
    setModalState(!modalState)
  }


  useEffect(() => {
    if(courseGroupsGit.length > 0) {
      mergeBBGitKeyStats(term, courseId, courseGroupsBB, courseGroupsGit, sinceTime, untilTime).then(data => {
        setCourseGroups(data)
      })
    }
  }, [courseGroupsBB, courseGroupsGit, courseId, sinceTime, term, untilTime])

  const createSubGroups = async () => {
    if (courseGroupsBB && courseGroupsBB.length !== 0) {
      setLoadingCreateSubGroups(true)
      const data = await fetcher(
        `/api/courses/${term}/${courseId}/git/createSubGroups`,
        {
          groups: courseGroupsBB,
        },
        "POST"
      )
      setLoadingCreateSubGroups(false)
      // console.log(data)
      if (data) {
        router.push(`/courses/${term}/${courseId}/groups`)
      }
    }
  }

  const handleChangeCheckbox = (event) => {
    const tmpCells = [...cells]
    const findIndex = cells.findIndex(cell => cell.label === event.target.name)
    if (findIndex >= 0) {
      tmpCells.splice(findIndex, 1)
    }
    else {
      tmpCells.push(cellList.find(cell => cell.label === event.target.name))
    }
    setCells(tmpCells)
  }

  const columnSelectors
     = cellList.map((cellElement, index) => (
       <Grid
         key={index}
         container
         direction="row"
         justifyContent="flex-start"
         alignItems="flex-start"

         item
         xs={6}
       >
         <FormControlLabel
           control={
             <Checkbox
               checked={cells.findIndex(cell => cell.label === cellElement.label) >= 0}
               onChange={handleChangeCheckbox}
               name={cellElement.label}
               color="selected"
             />
           }
           label={cellElement.label}
         />
       </Grid>
     ))


  return (
    <>
      <Navbar pageTitle={"All groups"} courseId={courseId} term={term} />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={10} md={10}>
          {courseGroupsBB.length === 0
            ? <>
              <h1>No groups found on Blackboard</h1>
              <Link href={`/courses/${term}/${courseId}/groups/create`} passHref>
                <Button
                  variant="contained"
                  color="primary"
                >
              Go to group creation page
                </Button>
              </Link>
            </>
            : courseGroupsGit.length === 0
              ? <>
                <h1>No groups found on GitLab</h1>
                {bbGitConnection.pat
                  && <Button
                    variant="contained"
                    color="primary"
                    onClick={createSubGroups}
                    disabled={loadingCreateSubGroups}
                  >
                  Create groups on GitLab
                  </Button>}
              </>
              : courseGroupsBB.length === courseGroupsGit.length
                ? <>
                  <h1>Amount of groups on BB and Blackboard does not match</h1>
                  {bbGitConnection.pat
                  && <Link href={`/courses/${term}/${courseId}/groups/diff`} passHref>
                    <Button
                      variant="contained"
                      color="primary"
                    >
                Go to group diff page
                    </Button>
                  </Link>
                  }
                </>
                : (courseGroups && courseGroups.length !== 0)
        && <>
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
                  item
                  xs={3}
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
                  item
                  xs={3}
                  md={3}
                ></Grid>
              </Grid>
              <Grid
                container
                item
              >
                <Modal
                  style={{ display:"flex", alignItems:"center", justifyContent:"center" }}
                  open={modalState}
                  onClose={handleModal}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                  <ModalColumns classes={classes} columnSelectors={columnSelectors} handleModal={handleModal}/>
                </Modal>
                <EnhancedTable groups={courseGroups} cells={cells} handleModal={handleModal}/>

              </Grid>
            </Grid>
          </Grid>
          <Link href={`/courses/${term}/${courseId}/groups/delete`} passHref>
            <Button
              variant="contained"
              color="primary"
            >
        Delete groups on Blackboard
            </Button>
          </Link>
          <Link href={`/courses/${term}/${courseId}/git/groups/delete`} passHref>
            <Button
              variant="contained"
              color="primary"
            >
            Delete groups on Gitlab
            </Button>
          </Link>
          <Link href={`/courses/${term}/${courseId}/groups/diff`} passHref>
            <Button
              variant="contained"
              color="primary"
            >
            Edit groups
            </Button>
          </Link>
        </>}
        </Grid>
      </Grid>
    </>
  )
}

export const getServerSideProps = (async (context) => {
  const params = context.params

  const courseGroupsBB = await getCourseGroups(context.req, params)

  console.log(courseGroupsBB.length)

  const courseGroupsGit = (await GetGroups(context.req, params)).subGroups

  console.log(courseGroupsGit.length)

  const bbGitConnection = await getBBGitConnection(context.req, params)

  if (!courseGroupsBB || !bbGitConnection) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: { courseGroupsBB, courseGroupsGit, bbGitConnection },
  }
})


export default withAuth(Group)