import getAccessToken from "utils/bb_token_cache"
import { deleteGroupBB, deleteGroupsetBB } from "utils/blackboard"
import isAuthorized from "middelwares/authorized"


async function deleteGroup(req, params) {
  const courseId = params.courseId

  const body = req.body

  const groupToDelete = body.group


  // TODO: check if user is instructor
  const bbToken = await getAccessToken()

  if(groupToDelete.isGroupSet) {
    return deleteGroupsetBB(courseId, groupToDelete.id, bbToken)
  }
  else {
    return deleteGroupBB(courseId, groupToDelete.id, bbToken)
  }
}

async function group(req, res) {
  if (req.method === "DELETE") {
    const infoDeleteGroup = await deleteGroup(req, req.query)

    console.log(infoDeleteGroup)

    res.json(infoDeleteGroup)
  }
}


export default isAuthorized(group)