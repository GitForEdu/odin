import isAuthorized from "middelwares/authorized"
import { addStudentToGroupWithUserNameBB, getCourseGroupsBB, removeStudentInGroupWithUserNameBB } from "utils/blackboard"
import getAccessToken from "utils/bb_token_cache"


async function RemoveStudentsInGroup (req, params) {
  const courseId = params.courseId

  const body = req.body

  const studentsToRemove = body.students

  // TODO: check if user is instructor
  const bbToken = await getAccessToken()
  const bbGroups = await getCourseGroupsBB(courseId, bbToken)
  const addedStudents = studentsToRemove.map(student => {
    const studentsGroup = bbGroups.find(subGroup => subGroup.name === student.groupName)
    if (studentsGroup.id) {
      return removeStudentInGroupWithUserNameBB(courseId, studentsGroup.id, student.userName, bbToken)
    }
    else {
      return { error: "cannot find students group on blackboard", student: { ...student } }
    }
  })
  return Promise.all(addedStudents)
}


async function AddStudentsToGroup(req, params) {
  const courseId = params.courseId

  const body = req.body

  const studentsToAdd = body.students

  // TODO: check if user is instructor
  const bbToken = await getAccessToken()
  const bbGroups = await getCourseGroupsBB(courseId, bbToken)
  const addedStudents = studentsToAdd.map(student => {
    const studentsGroup = bbGroups.find(subGroup => subGroup.name === student.groupName)
    if (studentsGroup.id) {
      return addStudentToGroupWithUserNameBB(courseId, studentsGroup.id, student.userName, bbToken)
    }
    else {
      return { error: "cannot find students group on blackboard", student: { ...student } }
    }
  })
  return Promise.all(addedStudents)
}

async function students(req, res) {
  if (req.method === "DELETE") {
    const removedStudentsFromGroup = await RemoveStudentsInGroup(req, req.query)

    res.json(removedStudentsFromGroup)
  }
  if (req.method === "POST") {
    const addedStudentsToGroup = await AddStudentsToGroup(req, req.query)

    res.json(addedStudentsToGroup)
  }

}

export default isAuthorized(students)