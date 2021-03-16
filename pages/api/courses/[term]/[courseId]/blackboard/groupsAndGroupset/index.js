import getAccessToken from "utils/bb_token_cache"
import { createGroupsetBB, createGroupInGroupsetBB, addStudentToGroupWithUserIdBB } from "utils/blackboard"
import isAuthorized from "middelwares/authorized"


const createGroupsFunc = async (groupsToCreate, groupSet, courseId, bbToken) => {
  const bbGroups = groupsToCreate.map(groupToCreate => {
    const bbGroup = createGroupInGroupsetBB(courseId, groupSet.id, groupToCreate.id, bbToken).then(group => {
      const members = groupToCreate.members
      const resultMembersAdd = members.map(student => {
        if(group.id) {
          return addStudentToGroupWithUserIdBB(courseId, group.id, student.userId, bbToken)
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

async function createBBGroups(req, params) {
  const courseId = params.courseId

  const body = req.body

  const groupsToCreate = body.groups

  // TODO: check if user is instructor
  const bbToken = await getAccessToken()
  const groupSet = await createGroupsetBB(courseId, bbToken)
  if (groupSet.id) {
    return createGroupsFunc(groupsToCreate, groupSet, courseId, bbToken)
  }
  else {
    console.log("Feil i laging av blackboard grupper", groupSet)
    return { error: "feil i laging av blackboard grupper" }
  }
}

async function groupsAndGroupset(req, res) {
  if (req.method === "POST") {
    const infoCreationGroups = await createBBGroups(req, req.query)

    console.log(infoCreationGroups)

    res.json(infoCreationGroups)
  }
}


export default isAuthorized(groupsAndGroupset)