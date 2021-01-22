import { PrismaClient } from "@prisma/client"
import isAuthorized from "middelwares/authorized"


const prisma = new PrismaClient()

export async function getBBGitConnection(req, params) {
  const courseId = params.courseId

  const connection = await prisma.bbGitConnection.findUnique({
    where: { courseid: courseId },
  })

  return connection ? connection : {}
}

export async function createBBGitConnection(req, params) {
  const courseId = params.courseId

  const body = req.body

  const connection = await prisma.bbGitConnection.create({
    data: { courseid: courseId, gitURL: body.gitURL, pat: body.pat },
  })

  return connection ? connection : {}
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

export default git