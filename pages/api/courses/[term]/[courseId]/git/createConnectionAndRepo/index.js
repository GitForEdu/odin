import { PrismaClient } from "@prisma/client"
import isAuthorized from "middelwares/authorized"
import { getSession } from "next-auth/client"
import { createGroup } from "utils/gitlab"

const prisma = new PrismaClient()

export async function createBBGitRepoConnection(req, params) {
  const session = await getSession({ req })
  const userName = session.username

  const courseId = params.courseId

  const term = params.term

  const courseFull = `${courseId}-${term}`

  const body = req.body

  const platform = "GitLab" // TODO: do magic add find out if gitlab, github bitbucket etc.....

  let group = undefined

  const legalGitName = courseFull.replace(/^-|((\.|\.atom|\.git)$)/, "")

  if (platform === "GitLab") {
    group = await createGroup(body.gitURL, legalGitName, body.pat, undefined)
  }
  if (group.id) {
    const connection = await prisma.bbGitConnection.create({
      data: { courseId: courseFull, gitURL: body.gitURL, repoName: legalGitName },
    })

    if (connection) {
      const userConnection = await prisma.userGitConnection.create({
        data: { pat: body.pat, userName: userName, gitURL: body.gitURL },
      })
      if (userConnection) {
        return connection
      }
    }
    else {
      return { error: "errorCreateBBBGitConn" }
    }
  }
  if(group.message === "Failed to save group {:path=>[\"has already been taken\"]}") {
    return { error: "group allready exsist" }
  }
}

async function git(req, res) {
  if (req.method === "POST") {
    const connection = await createBBGitRepoConnection(req, req.query)
    res.json(connection)
  }
}

export default isAuthorized(git)