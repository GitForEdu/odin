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

  const groupsToCreate = body.groups

  const platform = "GitLab" // TODO: do magic add find out if gitlab, github bitbucket etc.....

  // TODO: check if user is instructor
  const connection = await prisma.bbGitConnection.findUnique({
    where: { courseId: courseFull },
  })
  if (connection) {
    // Get user connection to create repo / it is expected that is exsist if this route is called
    const userConnection = await prisma.userGitConnection.findUnique({
      where: { userName_gitURL: { userName: userName, gitURL: connection.gitURL } },
    })
    if (userConnection) {
      if (platform === "GitLab") {
        const parentGroupInfo = await getGroupInfo(connection.gitURL, connection.repoName, userConnection.pat)
        if (parentGroupInfo.id) {
          const createdGroups = await Promise.all(groupsToCreate.map(groupToCreate => {
            const newGitGroup = createGroup(connection.gitURL, groupToCreate.code, userConnection.pat, parentGroupInfo.id)
            return newGitGroup
          }))
          const filledGroups = Promise.all(createdGroups.map(newleyCreatedGroup => {
            if (!newleyCreatedGroup.message) {
              const groupToAddMembers = groupsToCreate.find(groupToCreate => groupToCreate.code === newleyCreatedGroup.name)
              if(groupToAddMembers && groupToAddMembers.members) {
                const members = groupToAddMembers.members
                const newMembers = Promise.all(members.map(member => {
                  const newMemberInGroup = getUserInfo(connection.gitURL, userConnection.pat, member.userName).then(userInfo => {
                    if(userInfo.id) {
                      return addUserToGroup(connection.gitURL, newleyCreatedGroup.id, userConnection.pat, userInfo.id, 30)
                    }
                    else {
                      // failed to get userInfo from gitlab
                      return userInfo
                    }
                  })
                  return newMemberInGroup
                }))
                return newMembers
              }
              else {
                // no members info on group
                return { error: "failed to get info about group members" }
              }
            }
            else {
              return { error: "failed to create subGroup" }
            }
          }))
          return filledGroups
        }
        else {
          // TODO: it is possible that the parent group is not created yet. If not use info from bbConn to create parent Repo
          // Failed to get parent group info from Git
          return parentGroupInfo
        }
      }
    }
    else {
      return { error: "Cannot find user PAT for instance" }
    }
  }
  else {
    return { error: "Cannot find bbGit connection in db!!!" }
  }
}

async function git(req, res) {
  if (req.method === "POST") {
    const connection = await createSubGroups(req, req.query)

    res.json(connection)
  }
}

export default isAuthorized(git)