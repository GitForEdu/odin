import { PrismaClient } from "@prisma/client"
import isAuthorized from "middelwares/authorized"
import { getSession } from "next-auth/client"
import { createGroup, getGroupInfo, addUserToGroup, getUserInfo } from "utils/gitlab"

const prisma = new PrismaClient()

export async function createSubGroups(req, params) {
  const session = await getSession({ req })

  const userName = session.username

  const courseId = params.courseId

  const term = params.term

  const courseFull = `${courseId}-${term}`

  const body = req.body

  const bbGroups = body.groups

  const platform = "GitLab" // TODO: do magic add find out if gitlab, github bitbucket etc.....

  // TODO: check if user is instructor
  const connection = await prisma.bbGitConnection.findUnique({
    where: { courseId: courseFull },
  })
  if (connection) {
    console.log(connection)
    console.log("bb git conn found")
    const userConnection = await prisma.userGitConnection.findUnique({
      where: { userName_gitURL: { userName: userName, gitURL: connection.gitURL } },
    })
    if (userConnection) {
      console.log(userConnection)
      console.log("bb git user conn found")
      if (platform === "GitLab") {
        const parentGroupInfo = await getGroupInfo(connection.gitURL, connection.repoName, userConnection.pat)
        if (parentGroupInfo.id) {
          const groups = await Promise.all(bbGroups.map(bbGroup => {
            const newGitGroup = createGroup(connection.gitURL, bbGroup.code, userConnection.pat, parentGroupInfo.id)
            return newGitGroup
          }))
          const filledGroups = Promise.all(groups.map(group => {
            const membersInBBGroup = bbGroups.find(bbgroup => bbgroup.code === group.name).members
            const newMembers = Promise.all(membersInBBGroup.map(member => {
              const newMemberInGroup = getUserInfo(connection.gitURL, userConnection.pat, member.userName).then(userInfo => {
                if(userInfo.length === 1) {
                  return addUserToGroup(connection.gitURL, group.id, userConnection.pat, userInfo[0].id, 30)
                }
                return { error: "user not found" }
              })
              return newMemberInGroup
            }))
            return newMembers
          }))
          return filledGroups
        }
      }
    }
  }
}

async function git(req, res) {
  if (req.method === "POST") {
    const connection = await createSubGroups(req, req.query)
    console.log(connection)
    res.json(connection)
  }
}

export default isAuthorized(git)