import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import { useState, useEffect } from "react"
import { getCourseUsers } from "pages/api/courses/[term]/[courseId]/users"
import { StyledInputField } from "components/TextField"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import fetcher from "utils/fetcher"
import StyledButton from "components/Button"


const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: 8 * 2,
  margin: "0 0 8px 0",

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
})

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: 8,
  width: 250,
})

const makeRandomGroups = (students, numberOfGroups, studentsPerGroup, mode = "overflowGroups") => {
  // console.log(numberOfGroups, studentsPerGroup, mode, "sutdets", students)
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
                  {item.id}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

export const Group = ({ courseGroups, courseUsers }) => {
  // console.log("coursesusers:", courseUsers)
  const router = useRouter()
  const { courseId, term } = router.query
  const [numberOfStudentsPerGroup, setNumberOfStudentsPerGroup] = useState(5)
  const [groupMode, setGroupMode] = useState("overflowStudentsPerGroup")
  const [numberOfGroups, setNumberOfGroups] = useState(groupMode === "overflowGroups" ? Math.ceil(courseUsers.length / numberOfStudentsPerGroup) : Math.floor(courseUsers.length / numberOfStudentsPerGroup))
  const [loading, setLoading] = useState(true)
  const [loadingCreateGroups, setLoadingCreateGroups] = useState(false)

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

  const [randomGroups, setRandomGroups] = useState([])

  const onDragEnd = result => {
    const { source, destination } = result

    // dropped outside the list
    if (!destination) {
      return
    }

    // interal moved element
    if (source.droppableId === destination.droppableId) {
      const listOfList = reorderSubList(
        randomGroups[source.droppableId],
        source.index,
        destination.index,
        randomGroups
      )

      setRandomGroups([...listOfList])

    }
    // moved into new sublist
    else {
      const listOfList = moveElementToOtherSubList(
        randomGroups[source.droppableId].members,
        randomGroups[destination.droppableId].members,
        source,
        destination,
        randomGroups
      )

      setRandomGroups([...listOfList])
    }
  }

  const createSubGroups = async () => {
    if (randomGroups && randomGroups.length !== 0) {
      setLoadingCreateGroups(true)
      const data = await fetcher(
        `/api/courses/${term}/${courseId}/blackboard/createGroups`,
        {
          groups: randomGroups,
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
    setRandomGroups(makeRandomGroups(courseUsers, numberOfGroups, numberOfStudentsPerGroup, groupMode))
    setLoading(false)
  }, [courseUsers, groupMode, numberOfGroups, numberOfStudentsPerGroup])


  return (
    <>
      <StyledInputField
        id="numberOfStudentsPerGroup"
        label="numberOfStudentsPerGroup"
        value={numberOfStudentsPerGroup}
        onChange={handleChangeNumberOfStudentsPerGroup}
        type="number"
        InputProps={{
          inputProps: {
            min: 1,
          },
        }}
      />
      <StyledInputField
        id="numberOfGroups"
        label="numberOfGroups"
        value={numberOfGroups}
        onChange={handleChangeNumberOfGroups}
        type="number"
        InputProps={{
          inputProps: {
            min: 1,
          },
        }}
      />
      {!loading
      && <DragDropContext onDragEnd={onDragEnd}>
        {randomGroups.map(group => Dropable(group.id, group.members))}
      </DragDropContext>}
      {(!loading && randomGroups && randomGroups.length !== 0) && <StyledButton
        onClick={createSubGroups}
        disabled={loadingCreateGroups}
      >
        Create groups on GitLab
      </StyledButton>}
    </>
  )
}


export const getServerSideProps = (async (context) => {
  const params = context.params

  const courseGroups = await getCourseGroups(context.req, params)

  const courseUsers = await getCourseUsers(context.req, params)

  const bbGitConnection = await getBBGitConnection(context.req, params)

  if (!courseGroups || !bbGitConnection || !courseUsers) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: { courseGroups, bbGitConnection, courseUsers },
  }
})


export default withAuth(Group)