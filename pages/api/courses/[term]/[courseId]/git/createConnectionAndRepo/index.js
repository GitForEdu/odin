import { PrismaClient } from "@prisma/client"
import isAuthorized from "middelwares/authorized"
import { getSession } from "next-auth/client"
import getAccessToken from "utils/bb_token_cache"
import { getCourseUsersExpandedBB } from "utils/blackboard"
import { addUsersToGroupGit, createGroupGit, getUserGit } from "utils/gitlab"

const prisma = new PrismaClient()

export async function createBBGitRepoConnection(req, params) {
  const session = await getSession({ req })
  const bbToken = await getAccessToken()
  const userName = session.username

  const courseId = params.courseId

  const term = params.term

  const courseFull = `${courseId}-${term}`

  const body = req.body

  const platform = "GitLab" // TODO: do magic add find out if gitlab, github bitbucket etc.....

  let group = undefined

  const legalGitName = courseFull.replace(/^-|((\.|\.atom|\.git)$)/, "")

  const checkIfConnExsitsAllready = await prisma.bbGitConnection.findUnique({
    where: { courseId: courseFull },
  })

  if(!checkIfConnExsitsAllready) {
    if (platform === "GitLab") {
      group = await createGroupGit(body.gitURL, legalGitName, body.pat, undefined)
    }
    if (group.id) {
      // Create conn if not exsists allready and the group was created on Gitlab
      const connection = await prisma.bbGitConnection.create({
        data: { courseId: courseFull, gitURL: body.gitURL, repoName: legalGitName },
      })

      // add rest of ta's to main group
      const courseUsers = (await getCourseUsersExpandedBB(courseId, bbToken)).filter(user => user.courseRoleId !== "Student")
      courseUsers.push({ userName: "torestef" })
      courseUsers.push({ userName: "pettegre" })

      await Promise.all(courseUsers.map(member => {
        return getUserGit(connection.gitURL, body.pat, member.userName)
      })).then(members => {
        console.log(members)
        addUsersToGroupGit(connection.gitURL, group.id, body.pat, members, 50)
      })

      if (connection) {
        const userConnection = await prisma.userGitConnection.findUnique({
          where: { userName_gitURL: { userName: userName, gitURL: connection.gitURL } },
        })
        if(!userConnection) {
          // Also save userconnection now, if it not allready was there
          const newUserConnection = await prisma.userGitConnection.create({
            data: { pat: body.pat, userName: userName, gitURL: body.gitURL },
          })
          if (newUserConnection) {
            return connection
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
    if (group.message) {
      // TODO: Check if it was because group allready exsits, and maybe we have access to it and we still can create conn?
      // Cannot create parent group on GitLab
      return group
    }
  }
  else {
    return { error: "connection allready exsist in db" }
  }
}

async function git(req, res) {
  if (req.method === "POST") {
    const connection = await createBBGitRepoConnection(req, req.query)
    res.json(connection)
  }
}

export default isAuthorized(git)