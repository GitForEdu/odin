import getAccessToken from "utils/bb_token_cache"
import { deleteGroupBB, createGroupInGroupSet } from "utils/blackboard"

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

export async function Groups(req, res) {
  if (req.method === "DELETE") {
    const deletedGroups = await deleteGroups(req, req.query)

    console.log(deletedGroups)

    res.json(deletedGroups)
  }
}