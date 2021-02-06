import List from "components/List"
import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import { useState, useEffect } from "react"
import { getCourseUsers } from "pages/api/courses/[term]/[courseId]/users"
import { StyledInputField } from "components/TextField"

const makeRandomGroups = (students, numberOfGroups, studentsPerGroup, mode = "overflowGroups") => {
  console.log(numberOfGroups, studentsPerGroup, mode)
  let studentList = [...students]
  let numberOfStudents = students.length
  let groups = numberOfGroups
  const perfectFit = numberOfStudents === (numberOfGroups * studentsPerGroup)

  const groupsOfStudents = []

  for (let i = 0; i < groups; i++) {
    const localGroup = []
    for (let j = 0; j < studentsPerGroup; j++) {
      if (studentList.length > 0) {
        const indexStudent = Math.floor(Math.random() * studentList.length)
        const randomStudent = studentList[indexStudent]
        localGroup.push(randomStudent)
        studentList.splice(indexStudent, 1)
      }
    }
    groupsOfStudents.push(localGroup)
  }

  if(!perfectFit && mode === "overflowStudentsPerGroup") {
    if (studentList.length !== 0) {
      console.log(studentList.length)
      for (let i = 0; i < studentList.length; i++) {
        groupsOfStudents[i].push(studentList[i])
      }
      studentList.splice(0, studentList.length)
    }
  }
  if(studentList.length !== 0) {
    console.log("oh fuck, something is wrong")
  }
  return groupsOfStudents
}

export const Group = ({ courseGroups, courseUsers }) => {
  const router = useRouter()
  const { courseId, term } = router.query
  const [numberOfStudentsPerGroup, setNumberOfStudentsPerGroup] = useState(5)
  const [groupMode, setGroupMode] = useState("overflowStudentsPerGroup")
  const [numberOfGroups, setNumberOfGroups] = useState(groupMode === "overflowGroups" ? Math.ceil(courseUsers.results.length / numberOfStudentsPerGroup) : Math.floor(courseUsers.results.length / numberOfStudentsPerGroup))

  const handleChangeNumberOfGroups = (event) => {
    const newNumberOfGroups = parseInt(event.target.value)
    const tmpNumber = Math.floor(courseUsers.results.length / newNumberOfGroups)
    const newNumberOfStudentsPerGroup = tmpNumber ? tmpNumber : 1
    setGroupMode("overflowStudentsPerGroup")
    setNumberOfStudentsPerGroup(newNumberOfStudentsPerGroup)
    setNumberOfGroups(newNumberOfGroups)
  }

  const handleChangeNumberOfStudentsPerGroup = (event) => {
    const newNumberOfStudentsPerGroup = parseInt(event.target.value)
    const newNumberOfGroups = Math.ceil(courseUsers.results.length / newNumberOfStudentsPerGroup)
    setGroupMode("overflowGroups")
    setNumberOfStudentsPerGroup(newNumberOfStudentsPerGroup)
    setNumberOfGroups(newNumberOfGroups)
  }


  console.log(makeRandomGroups(courseUsers.results, numberOfGroups, numberOfStudentsPerGroup, groupMode))

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