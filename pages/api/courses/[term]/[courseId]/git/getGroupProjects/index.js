import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/client"
import { getGroupProjects as gitlabGroupMemberFunction } from "utils/gitlab"


export async function getGroupProjectsFromGitlab(req, res) {
  // console.log("getGroupMembers called with query", req.query)
  const groupMembersFromGitlab = await gitlabGroupMemberFunction(req, req.query)

  // console.log("getGroupMembers called: ", groupMembersFromGitlab)
  res.json(groupMembersFromGitlab)
}

const prisma = new PrismaClient()

export async function getGroupMembersFromGitlab (req, params) {
  const session = await getSession({ req })

  const userName = session.username
  const courseId = params.courseId
  const term = params.term
  const courseFull = `${courseId}-${term}`

  const connection = await prisma.bbGitConnection.findUnique({
    where: { courseId: courseFull },
  })

  // console.log("connection? ", connection)

  if (connection) {
    const userConnection = await prisma.userGitConnection.findUnique({
      where: { userName_gitURL: { userName: userName, gitURL: connection.gitURL } },
    })
    if (userConnection) {
      const courseMembers = await getCourseUsersGit(connection.gitURL, connection.repoName, userConnection.pat)
      // console.log(courseMembers)
      return courseMembers
    }
    else {
      return { message: "ingen connection" }
    }
  }
  console.log("ingen connection")
  return { message: "ingen connection" }
}