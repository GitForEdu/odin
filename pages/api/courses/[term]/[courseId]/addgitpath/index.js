import { PrismaClient } from "@prisma/client"
import isAuthorized from "middelwares/authorized"
import { getSession } from "next-auth/client"


const prisma = new PrismaClient()

export async function createGitPat(req, params) {
  const session = await getSession({ req })
  const userName = session.username

  const courseId = params.courseId

  const body = req.body

  const connection = await prisma.bbGitConnection.findUnique({
    where: { courseId: courseId },
  })

  if (connection) {
    const userConnection = await prisma.userGitConnection.create({
      data: { pat: body.pat, userName: userName, gitURL: connection.gitURL },
    })
    if (userConnection) {
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