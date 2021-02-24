import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/client"
import { deleteGroup } from "utils/gitlab"
import isAuthorized from "middelwares/authorized"


async function deleteGroupGit(req, res) {
  // console.log("deleteGroupGit called with query", req.query)
  const deletedGroup = await deleteGroupGitLab(req, req.query)

  // console.log("deleteGroup called: ", deletedGroup)
  res.json(deletedGroup)
}

const prisma = new PrismaClient()

async function deleteGroupGitLab (req, params) {
  const session = await getSession({ req })

  const userName = session.username
  const courseId = params.courseId
  const term = params.term
  const courseFull = `${courseId}-${term}`

  const body = req.body

  const groupId = body.groupId

  const connection = await prisma.bbGitConnection.findUnique({
    where: { courseId: courseFull },
  })

  // console.log("connection? ", connection)

  if (connection) {
    const userConnection = await prisma.userGitConnection.findUnique({
      where: { userName_gitURL: { userName: userName, gitURL: connection.gitURL } },
    })
    if (userConnection) {
      const deleteGroupResponse = await deleteGroup(connection.gitURL, userConnection.pat, groupId)
      // console.log(deleteGroupResponse)
      return deleteGroupResponse
    }
  }
  console.log("ingen connection")
}

export default isAuthorized(deleteGroupGit)