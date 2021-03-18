import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/client"
import { getGroupKeyStats } from "utils/gitlab"
import isAuthorized from "middelwares/authorized"


const prisma = new PrismaClient()

export async function GetGroupsKeyStats (req, params) {

  const session = await getSession({ req })

  const userName = session.username
  const courseId = params.courseId
  const term = params.term
  const groupPaths = params.groupPaths.split(",")
  const since = params.since
  const until = params.until
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
      const deleteGroupsResponse = groupPaths.map(groupPath => {
        return getGroupKeyStats(connection.gitURL, userConnection.pat, groupPath, since, until)
      })

      return Promise.all(deleteGroupsResponse)
    }
  }

  return {}
}


async function groupsKeyStats(req, res) {
  res.json(await GetGroupsKeyStats(req, req.query))
}

export default isAuthorized(groupsKeyStats)