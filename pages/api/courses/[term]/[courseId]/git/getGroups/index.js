import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/client"
import { getGroupsGitLab } from "utils/gitlab"


export async function GetGroupsGit(req, res) {
  // console.log("GetGroupsGit called with query", req.query)
  const groupsGit = await GetGroups(req, req.query)

  // console.log("GetGroups called: ", groupsGit)
  res.json(groupsGit)
}

const prisma = new PrismaClient()

export async function GetGroups (req, params) {
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
      const groupsGit = await getGroupsGitLab(connection.gitURL, connection.repoName, userConnection.pat)
      // console.log(groupsGit)
      return groupsGit
    }
  }
  console.log("ingen connection")
}