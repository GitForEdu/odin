import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/client"
import { getGroupKeyStats } from "utils/gitlab"
import isAuthorized from "middelwares/authorized"


const prisma = new PrismaClient()

export async function GetGroupKeyStats(req, params) {

  const session = await getSession({ req })

  const userName = session.username
  const courseId = params.courseId
  const term = params.term
  const groupPath = params.groupPath
  const since = params.since
  const until = params.until
  const fileBlame = params.fileBlame
  const courseFull = `${courseId}-${term}`

  const connection = await prisma.bbGitConnection.findUnique({
    where: { courseId: courseFull },
  })
  if (connection) {
    const userConnection = await prisma.userGitConnection.findUnique({
      where: { userName_gitURL: { userName: userName, gitURL: connection.gitURL } },
    })
    if (userConnection) {
      return await getGroupKeyStats(connection.gitURL, userConnection.pat, groupPath, since, until, fileBlame)
    }
  }

  return {}
}


async function groupKeyStats(req, res) {
  res.json(await GetGroupKeyStats(req, req.query))
}

export default isAuthorized(groupKeyStats)