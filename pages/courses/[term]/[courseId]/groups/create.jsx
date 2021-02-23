import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import { useState, useEffect } from "react"
import { getCourseUsers } from "pages/api/courses/[term]/[courseId]/users"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import fetcher from "utils/fetcher"
import { CSVReader } from "react-papaparse"
import { Button, TextField } from "@material-ui/core"
import { theme } from "utils/theme"
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}))

const CSVReaderStyles = {
  dropArea: {
    borderColor: theme.palette.primary.main,
    borderRadius: 0,
    margin: "0rem",
    width: "100%",
  },
  dropAreaActive: {
    borderColor: theme.palette.action.main,
  },
  dropFile: {
    width: 100,
    height: 120,
    background: "#ccc",
  },
  fileSizeInfo: {
    color: "#fff",
    backgroundColor: "#000",
    borderRadius: 3,
    lineHeight: 1,
    marginBottom: "0.5em",
    padding: "0 0.4em",
  },
  fileNameInfo: {
    color: "#fff",
    backgroundColor: "#eee",
    borderRadius: 3,
    fontSize: 14,
    lineHeight: 1,
    padding: "0 0.4em",
  },
  removeButton: {
    color: "red",
  },
  progressBar: {
    backgroundColor: "green",
  },
}


const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: 8 * 2,
  margin: "0 0 8px 0",

  // change background colour if dragging
  background: isDragging ? theme.palette.selected.main : theme.palette.primary.main,

  // styles we need to apply on draggables
  ...draggableStyle,
})

const getListStyle = isDraggingOver => ({
  padding: 8,
  width: 250,
})

const makeRandomGroups = (students, numberOfGroups, studentsPerGroup, mode = "overflowGroups") => {
  console.log(numberOfGroups, studentsPerGroup, mode)
  let studentList = [...students]
  let numberOfStudents = students.length
  let groups = numberOfGroups
  const perfectFit = numberOfStudents === (numberOfGroups * studentsPerGroup)

  const groupsOfStudents = []

  for (let i = 0; i < groups; i++) {
    const localGroup = {
      id: i,
      members: [],
    }
    for (let j = 0; j < studentsPerGroup; j++) {
      if (studentList.length > 0) {
        const indexStudent = Math.floor(Math.random() * studentList.length)
        const randomStudent = studentList[indexStudent]
        localGroup.members.push(randomStudent)
        studentList.splice(indexStudent, 1)
      }
    }
    groupsOfStudents.push(localGroup)
  }

  if(!perfectFit && mode === "overflowStudentsPerGroup") {
    if (studentList.length !== 0) {
      // console.log(studentList.length)
      for (let i = 0; i < studentList.length; i++) {
        groupsOfStudents[i].members.push(studentList[i])
      }
      studentList.splice(0, studentList.length)
    }
  }
  if(studentList.length !== 0) {
    console.log("oh fuck, something is wrong")
  }
  return groupsOfStudents
}

const reorderSubList = (list, startIndex, endIndex, listOfList) => {
  const listTemp = Array.from(list.members)
  const [removed] = listTemp.splice(startIndex, 1)
  listTemp.splice(endIndex, 0, removed)

  listOfList[list.id].members = listTemp

  return listOfList
}

const moveElementToOtherSubList = (source, destination, droppableSource, droppableDestination, listOfList) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  listOfList[droppableSource.droppableId].members = sourceClone
  listOfList[droppableDestination.droppableId].members = destClone

  return listOfList
}

const Dropable = (id, students) => {
  const stringId = id.toString()
  return(
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      item
      xs={4}
    >
      <Droppable droppableId={stringId}>
        {(provided, snapshot) => (
          <div
            style={getListStyle(snapshot.isDraggingOver)}
            ref={provided.innerRef}>
            {id}
            {students.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id}
                index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}

                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}>
                    {item.user.userName}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Grid>
  )
}

export const Group = ({ courseUsers }) => {
  const classes = useStyles()
  // console.log("coursesusers:", courseUsers)
  const router = useRouter()
  const { courseId, term } = router.query
  const [numberOfStudentsPerGroup, setNumberOfStudentsPerGroup] = useState(5)
  const [groupMode, setGroupMode] = useState("overflowStudentsPerGroup")
  const [numberOfGroups, setNumberOfGroups] = useState(groupMode === "overflowGroups" ? Math.ceil(courseUsers.length / numberOfStudentsPerGroup) : Math.floor(courseUsers.length / numberOfStudentsPerGroup))
  const [loadingCreateGroups, setLoadingCreateGroups] = useState(false)
  const [groups, setGroups] = useState([])
  const [files, setFiles] = useState({
    groups: null,
    groupMembers: null,
  })

  const handleGroups = filedata => {
    setFiles({
      ...files,
      groups: filedata,
    })
  }

  const handleGroupMembers = filedata => {
    setFiles({
      ...files,
      groupMembers: filedata,
    })
  }

  const handleChangeNumberOfGroups = (event) => {
    const newNumberOfGroups = parseInt(event.target.value)
    const tmpNumber = Math.floor(courseUsers.length / newNumberOfGroups)
    const newNumberOfStudentsPerGroup = tmpNumber ? tmpNumber : 1
    setGroupMode("overflowStudentsPerGroup")
    setNumberOfStudentsPerGroup(newNumberOfStudentsPerGroup)
    setNumberOfGroups(newNumberOfGroups)
  }

  const handleChangeNumberOfStudentsPerGroup = (event) => {
    const newNumberOfStudentsPerGroup = parseInt(event.target.value)
    const newNumberOfGroups = Math.ceil(courseUsers.length / newNumberOfStudentsPerGroup)
    setGroupMode("overflowGroups")
    setNumberOfStudentsPerGroup(newNumberOfStudentsPerGroup)
    setNumberOfGroups(newNumberOfGroups)
  }

  const onDragEnd = result => {
    const { source, destination } = result

    // dropped outside the list
    if (!destination) {
      return
    }

    // interal moved element
    if (source.droppableId === destination.droppableId) {
      const listOfList = reorderSubList(
        groups[source.droppableId],
        source.index,
        destination.index,
        groups
      )

      setGroups([...listOfList])

    }
    // moved into new sublist
    else {
      const listOfList = moveElementToOtherSubList(
        groups[source.droppableId].members,
        groups[destination.droppableId].members,
        source,
        destination,
        groups
      )

      setGroups([...listOfList])
    }
  }

  const createSubGroups = async () => {
    if (groups && groups.length !== 0) {
      setLoadingCreateGroups(true)
      const data = await fetcher(
        `/api/courses/${term}/${courseId}/blackboard/createGroups`,
        {
          groups: groups,
        }
      )
      setLoadingCreateGroups(false)
      console.log("create groups bb", data)
      if (!data.error) {
        router.push(`/courses/${term}/${courseId}/groups`)
      }
    }
  }

  useEffect(() => {
    // console.log("Filendring:", files)
    if (!files.groups || !files.groupMembers) {
      console.log("Mangler groups eller groupMembers")
      return
    }

    const newGroups = []
    files.groups.forEach(group => {
      group.data["Group Code"]
        ? newGroups.push({
          id: group.data["Group Code"],
          title: group.data["Title"],
          description: group.data["Description"],
          groupSet: group.data["Group Set"],
          available: group.data["Available"] === "J" ? true : false,
          selfEnroll: (group.data["Self Enroll"] === "J" ? true : false),
          maxEnrollment: group.data["Max Enrollment"],
          members: [],
        })
        : console.log("Fant ugyldig gruppe:", group.data)
    })

    files.groupMembers.forEach(user => {
      if (user.data["Group Code"]) {
        const foundGroup = newGroups.find(group => group.id === user.data["Group Code"])
        foundGroup.members.push({
          userName: user.data["User Name"],
          userId: user.data["User Name"],
          firstName: user.data["First Name"],
          lastName: user.data["Last Name"],
        })
      }
    })

    // console.log("Finished groups ", newGroups)
    setGroups(newGroups)
  }, [files])

  const handleClickCreateRandomGroups = () => {
    const randomGroups = makeRandomGroups(courseUsers, numberOfGroups, numberOfStudentsPerGroup, groupMode)
    setGroups(randomGroups)
  }


  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={3}
          item
          xs={12}
        >
          <Grid item xs={12}>
            <h2>Upload CSV with groups</h2>
          </Grid>
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
              <CSVReader
                onDrop={handleGroups}
                style={CSVReaderStyles}
                config={{ header: true }}
              >
                <span>Click to upload group info CSV with data headers</span>
              </CSVReader>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            item
            xs={12}>
            <Grid
              item
              xs={4}
            >
              <CSVReader
                onDrop={handleGroupMembers}
                style={CSVReaderStyles}
                config={{ header: true }}
              >
                <span>Click to upload group members CSV with data headers</span>
              </CSVReader>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <h2>or</h2>
        </Grid>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          item
          xs={12}
        >
          <Grid item xs={12}>
            <h2>Create random groups</h2>
          </Grid>
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
              alignItems="center"
              item
              xs={4}
            >
              <Grid
                item xs={6}>
                <TextField
                  variant="outlined"
                  color="primary"
                  id="numberOfStudentsPerGroup"
                  label="Students per group"
                  value={numberOfStudentsPerGroup}
                  onChange={handleChangeNumberOfStudentsPerGroup}
                  type="number"
                  InputProps={{
                    inputProps: {
                      min: 1,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  color="primary"
                  id="numberOfGroups"
                  label="Number of groups"
                  value={numberOfGroups}
                  onChange={handleChangeNumberOfGroups}
                  type="number"
                  InputProps={{
                    inputProps: {
                      min: 1,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleClickCreateRandomGroups()}
            >
              Create random groups
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <h2>Groups...</h2>
        </Grid>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          item
          xs={12}
        >
          {
            groups && groups.length !== 0
            && <>
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={3}
                item
                xs={12}
              >
                <DragDropContext onDragEnd={onDragEnd}>
                  {groups.map(group => Dropable(group.id, group.members))}
                </DragDropContext>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={createSubGroups}
                  disabled={loadingCreateGroups}
                >
                Create groups on Blackboard
                </Button>
              </Grid>
            </>
          }
        </Grid>
      </Grid>
    </div>
  )
}


export const getServerSideProps = (async (context) => {
  const params = context.params

  const courseUsers = await getCourseUsers(context.req, params)

  const bbGitConnection = await getBBGitConnection(context.req, params)

  if (!bbGitConnection || !courseUsers) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: { bbGitConnection, courseUsers },
  }
})


export default withAuth(Group)