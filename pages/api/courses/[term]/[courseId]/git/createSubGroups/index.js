import { PrismaClient } from "@prisma/client"
import isAuthorized from "middelwares/authorized"
import { getSession } from "next-auth/client"
import { createGroup, getGroupInfo, addUsersToGroup, getUserInfo } from "utils/gitlab"


const prisma = new PrismaClient()

const createSubGroupsFunc = async (connection, userConnection, groupsToCreate, parentGroupInfo) => {
  const createdGroups = await Promise.all(groupsToCreate.map(groupToCreate => {
    const newGitGroup = createGroup(connection.gitURL, groupToCreate.name, userConnection.pat, parentGroupInfo.id)
    return newGitGroup
  }))
  const filledGroups = Promise.all(createdGroups.map(newleyCreatedGroup => {
    if (!newleyCreatedGroup.message) {
      const groupToAddMembers = groupsToCreate.find(groupToCreate => groupToCreate.id === newleyCreatedGroup.name)
      if (groupToAddMembers && groupToAddMembers.members) {
        const members = groupToAddMembers.members
        let membersNotFoundGitLab = []
        let membersFoundGitLab = []
        const statusSubGroup = Promise.all(members.map(member => {
          const memeberFoundOnGitlab = getUserInfo(connection.gitURL, userConnection.pat, member.userName).then(userInfo => {
            if (userInfo.id) {
              membersFoundGitLab.push(userInfo.id)
            }
            else {
              membersNotFoundGitLab.push(member.userName)
            }
          })
          return memeberFoundOnGitlab
        })).then(() => {
          const statusAddMembersToGroup = addUsersToGroup(connection.gitURL, newleyCreatedGroup.id, userConnection.pat, membersFoundGitLab, 30).then((status) => ({ group: groupToAddMembers, usersNotFoundGitLab: membersNotFoundGitLab, status: status }))
          return statusAddMembersToGroup
        })
        return statusSubGroup
      }
      else {
        // no members info on group
        return { error: "failed to get info about group members" }
      }
    }
    else {
      return { error: "failed to create subGroup", message: newleyCreatedGroup.message }
    }
  }))
  return filledGroups
}

export async function createSubGroups(req, params) {
  const session = await getSession({ req })

  const userName = session.username

  const courseId = params.courseId

  const term = params.term

  const courseFull = `${courseId}-${term}`

  const legalGitName = courseFull.replace(/^-|((\.|\.atom|\.git)$)/, "")

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
          return createSubGroupsFunc(connection, userConnection, groupsToCreate, parentGroupInfo)
        }
        else {
          // Parent group for course was not found for some reason, try to create it
          const parentGroupNew = await createGroup(connection.gitURL, legalGitName, userConnection.pat, undefined)
          if (parentGroupNew.id) {
            return createSubGroupsFunc(connection, userConnection, groupsToCreate, parentGroupNew)
          }
          // Failed to create parent group on Git
          return parentGroupNew
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
    const infoCreationGroups = await createSubGroups(req, req.query)

    res.json(infoCreationGroups)
  }
}

export default isAuthorized(git)