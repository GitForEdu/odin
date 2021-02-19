import isAuthorized from "middelwares/authorized"
import { createGroupSet, createGroupInGroupSet, addStudentToGroup } from "utils/blackboard"
import getAccessToken from "utils/bb_token_cache"


const createGroupsFunc = async (groupsToCreate, groupSet, courseId, bbToken) => {
  const bbGroups = groupsToCreate.map(groupToCreate => {
    const bbGroup = createGroupInGroupSet(courseId, groupSet.id, groupToCreate.id, bbToken).then(group => {
      const members = groupToCreate.members
      const resultMembersAdd = members.map(student => {
        if(group.id) {
          return addStudentToGroup(courseId, group.id, student.userId, bbToken)
        }
        else {
          return group
        }
      })
      return Promise.all(resultMembersAdd)
    })
    return bbGroup
  })

  return Promise.all(bbGroups)
}

export async function createBBGroups(req, params) {
  const courseId = params.courseId

  const body = req.body

  const groupsToCreate = body.groups

  const platform = "GitLab" // TODO: do magic add find out if gitlab, github bitbucket etc.....

  // TODO: check if user is instructor
  const bbToken = await getAccessToken()
  if (platform === "GitLab") {
    const groupSet = await createGroupSet(courseId, bbToken)
    if (groupSet.id) {
      return createGroupsFunc(groupsToCreate, groupSet, courseId, bbToken)
    }
    else {
      console.log("Feil i laging av blackboard grupper", groupSet)
      return { error: "feil i laging av blackboard grupper" }
    }
  }
}

async function bb(req, res) {
  if (req.method === "POST") {
    const infoCreationGroups = await createBBGroups(req, req.query)

    console.log(infoCreationGroups)

    res.json(infoCreationGroups)
  }
}

export default isAuthorized(bb)