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

  const checkIfConnExsitsAllready = await prisma.bbGitConnection.findUnique({
    where: { courseId: courseFull },
  })

  if (!checkIfConnExsitsAllready) {
    const connection = await prisma.bbGitConnection.create({
      data: { courseId: courseFull, gitURL: body.gitURL, repoName: legalGitName },
    })

    if (connection) {
      const userConnection = await prisma.userGitConnection.findUnique({
        where: { userName_gitURL: { userName: userName, gitURL: connection.gitURL } },
      })
      if(!userConnection) {
        const userConnection = await prisma.userGitConnection.create({
          data: { pat: body.pat, userName: userName, gitURL: body.gitURL },
        })
        if (userConnection) {
          return connection
        }
        else {
          return { ...connection, pat: false }
        }
      }
      else {
        // userConnection was found, no need to create
        return connection
      }
    }
    else {
      // Cannot create connection in db for some reason
      return { error: "errorCreateBBBGitConn" }
    }
  }
  else {
    return { error: "connection allready exsist in db" }
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