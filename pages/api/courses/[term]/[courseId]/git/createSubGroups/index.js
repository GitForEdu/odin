import { PrismaClient } from "@prisma/client"
import isAuthorized from "middelwares/authorized"
import { getSession } from "next-auth/client"
import { createGroup, getGroupInfo } from "utils/gitlab"

const prisma = new PrismaClient()

export async function createSubGroups(req, params) {
  const session = await getSession({ req })

  const userName = session.userName

  const courseId = params.courseId

  const term = params.term

  const courseFull = `${courseId}-${term}`

  const body = req.body

  const bbGroups = body.groups

  const platform = "GitLab" // TODO: do magic add find out if gitlab, github bitbucket etc.....

  const legalGitName = courseFull.replace(/^-|((\.|\.atom|\.git)$)/, "")

  // TODO: check if user is instructor
  const connection = await prisma.bbGitConnection.findUnique({
    where: { courseId: courseFull },
  })
  if (connection) {
    const userConnection = await prisma.userGitConnection.findUnique({
      where: { userName_gitURL: { userName: userName, gitURL: connection.gitURL } },
    })
    if (userConnection) {
      if (platform === "GitLab") {
        const parentGroupInfo = getGroupInfo(connection.gitURL, legalGitName)
        if (parentGroupInfo.id) {
          return Promise.all(bbGroups.map(bbGroup => {
            const newGitGroup = createGroup(connection.gitURL, bbGroup.name, userConnection.pat, parentGroupInfo.id)
            console.log(newGitGroup)
            return newGitGroup
          }))
        }
      }
    }
  }
}

async function git(req, res) {
  if (req.method === "POST") {
    const connection = await createSubGroups(req, req.query)
    res.json(connection)
  }
}

export default isAuthorized(git)