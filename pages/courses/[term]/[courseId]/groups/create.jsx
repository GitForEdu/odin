import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import { useState, useEffect } from "react"
import { getCourseStudents } from "pages/api/courses/[term]/[courseId]/users"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import fetcher from "utils/fetcher"
import { CSVReader } from "react-papaparse"
import { Button, TextField, Typography } from "@material-ui/core"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import Navbar from "components/Navbar"


const CSVReaderStyles = (theme) => ({
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
    width: "6.25rem",
    height: "7.5rem",
    background: "#ccc",
  },
  fileSizeInfo: {
    color: "#fff",
    backgroundColor: "#000",
    borderRadius: "0.1875rem",
    lineHeight: "0.0625rem",
    marginBottom: "0.5rem",
    padding: "0 0.4rem",
  },
  fileNameInfo: {
    color: "#fff",
    backgroundColor: "#eee",
    borderRadius: 3,
    fontSize: 14,
    lineHeight: 1,
    padding: "0 0.4rem",
  },
  removeButton: {
    color: "red",
  },
  progressBar: {
    backgroundColor: "green",
  },
})


const getItemStyle = (theme, isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: "1rem",
  margin: "0 0 0.5rem 0",

  // change background colour if dragging
  background: isDragging ? theme.palette.selected.main : theme.palette.primary.main,

  // styles we need to apply on draggables
  ...draggableStyle,
})

const getListStyle = isDraggingOver => ({
  padding: "0.5rem",
  width: "16rem",
})

const makeRandomGroups = (students, numberOfGroups, studentsPerGroup, mode = "overflowGroups") => {
  let studentList = [...students]
  let numberOfStudents = students.length
  let groups = numberOfGroups
  const perfectFit = numberOfStudents === (numberOfGroups * studentsPerGroup)

  const groupsOfStudents = []

  for (let i = 0; i < groups; i++) {
    const localGroup = {
      id: i,
      name: `Group ${i}`,
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

const reorderSubList = (list, startIndex, endIndex) => {
  const listTemp = Array.from(list.members)
  const [removed] = listTemp.splice(startIndex, 1)
  listTemp.splice(endIndex, 0, removed)

  return listTemp
}

const moveElementToOtherSubList = (sourceMembers, destinationMemberes, droppableSource, droppableDestination, listOfList) => {
  const sourceMembersClone = Array.from(sourceMembers)
  const destinationMemberesClone = Array.from(destinationMemberes)
  const [removed] = sourceMembersClone.splice(droppableSource.index, 1)

  destinationMemberesClone.splice(droppableDestination.index, 0, removed)

  listOfList[droppableSource.droppableId].members = sourceMembersClone
  listOfList[droppableDestination.droppableId].members = destinationMemberesClone

  return listOfList
}

const GroupListElement = (theme, group) => {
  return(
    <Grid
      key={group.name}
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      item
      xs={6}
      md={4}
    >
      <Droppable droppableId={group.id.toString()}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {group.name}
            {group.members.map((member, index) => (
              <Draggable
                key={member.id}
                draggableId={member.id}
                index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      theme,
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}>
                    <Typography>
                      {`${member.user.name.given} ${member.user.name.family}`}
                    </Typography>

                    <Typography>
                      {`${member.user.userName}`}
                    </Typography>
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

export const Group = ({ courseStudents }) => {
  const theme = useTheme()
  // console.log("courseStudents:", courseStudents)
  const router = useRouter()
  const { courseId, term } = router.query
  const [numberOfStudentsPerGroup, setNumberOfStudentsPerGroup] = useState(5)
  const [groupMode, setGroupMode] = useState("overflowStudentsPerGroup")
  const [numberOfGroups, setNumberOfGroups] = useState(groupMode === "overflowGroups" ? Math.ceil(courseStudents.length / numberOfStudentsPerGroup) : Math.floor(courseStudents.length / numberOfStudentsPerGroup))
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
    const tmpNumber = Math.floor(courseStudents.length / newNumberOfGroups)
    const newNumberOfStudentsPerGroup = tmpNumber ? tmpNumber : 1
    setGroupMode("overflowStudentsPerGroup")
    setNumberOfStudentsPerGroup(newNumberOfStudentsPerGroup)
    setNumberOfGroups(newNumberOfGroups)
  }

  const handleChangeNumberOfStudentsPerGroup = (event) => {
    const newNumberOfStudentsPerGroup = parseInt(event.target.value)
    const newNumberOfGroups = Math.ceil(courseStudents.length / newNumberOfStudentsPerGroup)
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
      const reorderedSubList = reorderSubList(
        groups[source.droppableId],
        source.index,
        destination.index
      )

      groups[source.droppableId].members = reorderedSubList

      setGroups([...groups])

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
    const randomGroups = makeRandomGroups(courseStudents, numberOfGroups, numberOfStudentsPerGroup, groupMode)
    setGroups(randomGroups)
  }


  return (
    <>
      <Navbar pageTitle={"Create groups"} courseId={courseId} term={term} />
      {/* Main/Page Grid Container */}
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {/* Upload CSV Container */}
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={3}
          item
          xs={10} lg={6} xl={4}
        >
          <Grid item xs={12}>
            <h2>Upload CSV with groups</h2>
          </Grid>
          <Grid container item>
            <CSVReader
              onDrop={handleGroups}
              style={CSVReaderStyles(theme)}
              config={{ header: true }}
            >
              <span>Click to upload group info CSV with data headers</span>
            </CSVReader>
          </Grid>
          <Grid container item>
            <CSVReader
              onDrop={handleGroupMembers}
              style={CSVReaderStyles(theme)}
              config={{ header: true }}
            >
              <span>Click to upload group members CSV with data headers</span>
            </CSVReader>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <h2>or</h2>
        </Grid>
        {/* Create random input Container */}
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          item
          xs={12}
        >
          <Grid item xs={12}>
            <h2>Create random groups from the studentlist of Blackboard</h2>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            item
          >
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              item
              xs={12}
              sm={4}
              md={4}
              xl={2}
            >
              <Grid item xs={6}>
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
        </Grid>
        <Grid item xs={8} lg={4} xl={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleClickCreateRandomGroups()}
          >
              Create random groups
          </Button>
        </Grid>
        {/* Groups Container */}
        <Grid item xs={12}>
          <h2>Groups... (supports drag & drop)</h2>
        </Grid>

        {
          groups && groups.length !== 0
            && <>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={3}
                item
                xs={12}
                xl={6}
              >
                <DragDropContext onDragEnd={onDragEnd}>
                  {groups.map(group => GroupListElement(theme, group))}
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
    </>
  )
}


export const getServerSideProps = (async (context) => {
  const params = context.params

  let courseStudents = await getCourseStudents(context.req, params)

  const bbGitConnection = await getBBGitConnection(context.req, params)

  if (!bbGitConnection || !courseStudents) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: { bbGitConnection, courseStudents },
  }
})


export default withAuth(Group)