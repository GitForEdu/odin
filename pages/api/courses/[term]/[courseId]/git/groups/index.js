import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/client"
import { createGroupGit, deleteGroupGit, getGroupGit, getGroupsGit, getGroupsWithStudentsGit } from "utils/gitlab"
import isAuthorized from "middelwares/authorized"

const prisma = new PrismaClient()


export async function GetGroups (req, params) {
  const session = await getSession({ req })

  const userName = session.username
  const courseId = params.courseId
  const term = params.term
  const courseFull = `${courseId}-${term}`

  const connection = await prisma.bbGitConnection.findUnique({
    where: { courseId: courseFull },
  })

  // console.log("connection? ", connection)

  if (connection) {
    const userConnection = await prisma.userGitConnection.findUnique({
      where: { userName_gitURL: { userName: userName, gitURL: connection.gitURL } },
    })
    if (userConnection) {
      const groupsGit = await getGroupsGit(connection.gitURL, connection.repoName, userConnection.pat)
      // console.log(groupsGit)
      return groupsGit
    }
  }
  console.log("ingen connection")
}

export async function GetGroupsWithMembers (req, params) {
  const session = await getSession({ req })

  const userName = session.username
  const courseId = params.courseId
  const term = params.term
  const courseFull = `${courseId}-${term}`

  const connection = await prisma.bbGitConnection.findUnique({
    where: { courseId: courseFull },
  })

  // console.log("connection? ", connection)

  if (connection) {
    const userConnection = await prisma.userGitConnection.findUnique({
      where: { userName_gitURL: { userName: userName, gitURL: connection.gitURL } },
    })
    if (userConnection) {
      const response = await getGroupsWithStudentsGit(connection.gitURL, connection.repoName, userConnection.pat)
      if (!response.message) {
        return await Promise.all(response).then(groupsGit => groupsGit)
      }
      return response
    }
  }
  console.log("ingen connection")
}

async function DeleteGroups (req, params) {
  const session = await getSession({ req })

  const userName = session.username
  const courseId = params.courseId
  const term = params.term
  const courseFull = `${courseId}-${term}`

  const body = req.body

  const groupIds = body.groupIds

  const connection = await prisma.bbGitConnection.findUnique({
    where: { courseId: courseFull },
  })

  // console.log("connection? ", connection)

  if (connection) {
    const userConnection = await prisma.userGitConnection.findUnique({
      where: { userName_gitURL: { userName: userName, gitURL: connection.gitURL } },
    })
    if (userConnection) {
      const deleteGroupsResponse = groupIds.map(groupId => {
        return deleteGroupGit(connection.gitURL, userConnection.pat, groupId)
      })

      // console.log(deleteGroupResponse)
      return Promise.all(deleteGroupsResponse)
    }
  }
  console.log("ingen connection")
}


async function CreateGroups(req, params) {
  const session = await getSession({ req })

  const userName = session.username
  const courseId = params.courseId
  const term = params.term
  const courseFull = `${courseId}-${term}`

  const body = req.body

  const groupNames = body.groupNames

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
      const parentGroupInfo = await getGroupGit(connection.gitURL, connection.repoName, userConnection.pat)
      if (parentGroupInfo.id) {
        const createdGroups = groupNames.map(groupName => {
          return createGroupGit(connection.gitURL, groupName, userConnection.pat, parentGroupInfo.id)
        })
        return Promise.all(createdGroups)
      }
      else {
        return { error: "tried to add groups to a non exsiting parent group on Git" }
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

async function groups(req, res) {
  if (req.method === "DELETE") {
    const deletedGroups = await DeleteGroups(req, req.query)

    res.json(deletedGroups)
  }
  if (req.method === "POST") {
    const createdGroups = await CreateGroups(req, req.query)

    res.json(createdGroups)
  }

  res.json(await GetGroups(req, req.query))
}

export default isAuthorized(groups)