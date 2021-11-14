import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/react"
import { getGroupWithStudentsGit } from "utils/gitlab"
import isAuthorized from "middelwares/authorized"

const prisma = new PrismaClient()

export async function getGroupWithMembersGit (req, params) {
  const session = await getSession({ req })

  const userName = session.username
  const courseId = params.courseId
  const groupId = params.groupId
  const term = params.term
  const courseFull = `${courseId}-${term}`

  const connection = await prisma.bbGitConnection.findUnique({
    where: { courseId: courseFull },
  })

  if (connection) {
    const userConnection = await prisma.userGitConnection.findUnique({
      where: { userName_gitURL: { userName: userName, gitURL: connection.gitURL } },
    })
    if (userConnection) {
      const response = await getGroupWithStudentsGit(connection.gitURL, encodeURIComponent(`${connection.repoName}/${groupId}`), userConnection.pat)
      return response
    }
  }
  console.log("ingen connection")
}


async function group(req, res) {
  res.json(await getGroupWithMembersGit(req, req.query))
}

export default isAuthorized(group)