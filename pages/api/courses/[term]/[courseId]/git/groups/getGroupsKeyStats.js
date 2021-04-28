import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/client"
import { getGroupKeyStats } from "utils/gitlab"
import isAuthorized from "middelwares/authorized"
import { cacheCalls } from "utils/cache"


const prisma = new PrismaClient()

export async function GetGroupsKeyStats(req, params) {

  const session = await getSession({ req })

  const userName = session.username
  const courseId = params.courseId
  const term = params.term
  const groupPaths = params.groupPaths.split(",")
  const since = params.since
  let sinceTime = ""
  if (since) {
    const splitSince = since.split(".")
    sinceTime = new Date(splitSince[0], splitSince[1], splitSince[2])
  }
  const until = params.until
  let untilTime = ""
  if (until) {
    const splitUntil = until.split(".")
    untilTime = new Date(splitUntil[0], splitUntil[1], splitUntil[2])
  }

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
      const deleteGroupsResponse = groupPaths.map(groupPath => {
        return cacheCalls(req, userName, getGroupKeyStats, [connection.gitURL, userConnection.pat, groupPath, sinceTime, untilTime, fileBlame])
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