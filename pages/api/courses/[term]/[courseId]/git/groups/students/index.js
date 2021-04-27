import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/client"
import { addUserToGroupGit, getGroupsGit, getUserGit, removeUserInGroupGit } from "utils/gitlab"
import isAuthorized from "middelwares/authorized"

const prisma = new PrismaClient()


async function RemoveStudentsInGroup (req, params) {
  const session = await getSession({ req })

  const userName = session.username
  const courseId = params.courseId
  const term = params.term
  const courseFull = `${courseId}-${term}`

  const body = req.body

  const studentsToRemove = body.students

  // TODO: check if user is instructor
  const connection = await prisma.bbGitConnection.findUnique({
    where: { courseId: courseFull },
  })
  if (connection) {
    // Get user connection to create repo / it is expected that is exsist if this route is called
    const userConnection = await prisma.userGitConnection.findUnique({
      where: { userName_gitURL: { userName: userName, gitURL: connection.gitURL } },
    })
    if (userConnection) {
      const parentGroupInfoWithSubGroups = await getGroupsGit(connection.gitURL, encodeURIComponent(connection.repoName), userConnection.pat, 0)
      if (parentGroupInfoWithSubGroups.id) {
        const addedStudents = studentsToRemove.map(student => {
          const studentsGroup = parentGroupInfoWithSubGroups.subGroups.find(subGroup => subGroup.name === student.groupName)
          if (studentsGroup.id) {
            const studentAdded = getUserGit(connection.gitURL, userConnection.pat, student.userName).then(userInfo => {
              if (userInfo.id) {
                return removeUserInGroupGit(connection.gitURL, studentsGroup.id, userConnection.pat, userInfo.id)
              }
              else {
                return { error: "cannot find student on git", student: { ...student } }
              }
            })
            return studentAdded
          }
          else {
            return { error: "cannot find students group om git", student: { ...student } }
          }
        })
        return Promise.all(addedStudents)
      }
      else {
        return { error: "tried to add students to a non exsiting parent group on Git" }
      }
    }
    else {
      return { error: "Cannot find user PAT for instance" }
    }
  }
  else {
    return { error: "Cannot find bbGit connection in db!!!" }
  }
}


async function AddStudentsToGroup(req, params) {
  const session = await getSession({ req })

  const userName = session.username
  const courseId = params.courseId
  const term = params.term
  const courseFull = `${courseId}-${term}`

  const body = req.body

  const studentsToAdd = body.students

  // TODO: check if user is instructor
  const connection = await prisma.bbGitConnection.findUnique({
    where: { courseId: courseFull },
  })
  if (connection) {
    // Get user connection to create repo / it is expected that is exsist if this route is called
    const userConnection = await prisma.userGitConnection.findUnique({
      where: { userName_gitURL: { userName: userName, gitURL: connection.gitURL } },
    })
    if (userConnection) {
      const parentGroupInfoWithSubGroups = await getGroupsGit(connection.gitURL, encodeURIComponent(connection.repoName), userConnection.pat, 0)
      if (parentGroupInfoWithSubGroups.id) {
        const addedStudents = studentsToAdd.map(student => {
          const studentsGroup = parentGroupInfoWithSubGroups.subGroups.find(subGroup => subGroup.name === student.groupName)
          if (studentsGroup.id) {
            const studentAdded = getUserGit(connection.gitURL, userConnection.pat, student.userName).then(userInfo => {
              if (userInfo.id) {
                return addUserToGroupGit(connection.gitURL,studentsGroup.id, userConnection.pat, userInfo.id, 40)
              }
              else {
                return { error: "cannot find student on git", student: { ...student } }
              }
            })
            return studentAdded
          }
          else {
            return { error: "cannot find students group om git", student: { ...student } }
          }
        })
        return Promise.all(addedStudents)
      }
      else {
        return { error: "tried to add students to a non exsiting parent group on Git" }
      }
    }
    else {
      return { error: "Cannot find user PAT for instance" }
    }
  }
  else {
    return { error: "Cannot find bbGit connection in db!!!" }
  }
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