import { PrismaClient } from "@prisma/client"
import isAuthorized from "middelwares/authorized"
import { getSession } from "next-auth/react"


const prisma = new PrismaClient()

export async function createGitPat(req, params) {
  const session = await getSession({ req })
  const userName = session.username

  const courseId = params.courseId

  const term = params.term

  const courseFull = `${courseId}-${term}`

  const body = req.body

  const connection = await prisma.bbGitConnection.findUnique({
    where: { courseId: courseFull },
  })

  if (connection) {
    const userConnection = await prisma.userGitConnection.findUnique({
      where: { userName_gitURL: { userName: userName, gitURL: connection.gitURL } },
    })
    if (!userConnection) {
      const userConnection = await prisma.userGitConnection.create({
        data: { pat: body.pat, userName: userName, gitURL: connection.gitURL },
      })
      if (userConnection) {
        return connection
      }
    }
    else {
      // userConnection was allready in db for some reason
      return connection
    }
  }
  else {
    return { error: "error: createGitPAT" }
  }
}


async function addgitpat(req, res) {
  if (req.method === "POST") {
    const connection = await createGitPat(req, req.query)
    res.json(connection)
  }
}

export default isAuthorized(addgitpat)