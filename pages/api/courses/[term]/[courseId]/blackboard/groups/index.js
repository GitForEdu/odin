import getAccessToken from "utils/bb_token_cache"
import { deleteGroupBB, createGroupInGroupsetBB, getCourseGroupsWithGroupsetBB } from "utils/blackboard"
import isAuthorized from "middelwares/authorized"


const createGroupsFunc = async (groupNames, groupSet, courseId, bbToken) => {
  const bbGroups = groupNames.map(groupName => {
    const bbGroup = createGroupInGroupsetBB(courseId, groupSet.id, groupName, bbToken)
    return bbGroup
  })
  return Promise.all(bbGroups)
}

async function createBBGroups(req, params) {
  const courseId = params.courseId

  const body = req.body

  const groupNames = body.groupNames

  // TODO: check if user is instructor
  const bbToken = await getAccessToken()
  const groupSet = getCourseGroupsWithGroupsetBB(courseId, bbToken).filter(group => group.isGroupSet)[0]
  if (groupSet.id) {
    return createGroupsFunc(groupNames, groupSet, courseId, bbToken)
  }
  else {
    console.log("Feil i laging av blackboard grupper", groupSet)
    return { error: "feil i laging av blackboard grupper" }
  }
}

async function deleteGroups(req, params) {
  const courseId = params.courseId

  const body = req.body

  const groupIds = body.groupIds


  // TODO: check if user is instructor
  const bbToken = await getAccessToken()

  const deletedGroups = groupIds.map(groupId => {
    return deleteGroupBB(courseId, groupId, bbToken)
  })

  return Promise.all(deletedGroups)
}

async function groups(req, res) {
  if (req.method === "DELETE") {
    const deletedGroups = await deleteGroups(req, req.query)

    console.log(deletedGroups)

    res.json(deletedGroups)
  }
  if (req.method === "POST") {
    const infoCreationGroups = await createBBGroups(req, req.query)

    console.log(infoCreationGroups)

    res.json(infoCreationGroups)
  }
}


export default isAuthorized(groups)