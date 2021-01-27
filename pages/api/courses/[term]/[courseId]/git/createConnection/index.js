import { PrismaClient } from "@prisma/client"
import isAuthorized from "middelwares/authorized"
import { getSession } from "next-auth/client"


const prisma = new PrismaClient()

export async function getBBGitConnection(req, params) {
  const session = await getSession({ req })
  const userName = session.username

  const courseId = params.courseId

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
      return { ...connection, pat: true }
    }
    else {
      return { ...connection, pat: false }
    }
  }
  else {
    return { error: "errorGetBBGitConn" }
  }
}

export async function createBBGitConnection(req, params) {
  const session = await getSession({ req })
  const userName = session.username

  const courseId = params.courseId

  const term = params.term

  const courseFull = `${courseId}-${term}`

  const body = req.body

  const legalGitName = courseFull.replace(/^-|((\.|\.atom|\.git)$)/, "")

  const connection = await prisma.bbGitConnection.create({
    data: { courseId: courseId, gitURL: body.gitURL, repoName: legalGitName },
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

async function git(req, res) {
  if (req.method === "GET") {
    const found = await getBBGitConnection(req, req.query)
    res.json(found)
  }

  if (req.method === "POST") {
    const connection = await createBBGitConnection(req, req.query)
    res.json(connection)
  }
}

export default isAuthorized(git)