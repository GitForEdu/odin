import isAuthorized from "middelwares/authorized"
import { deleteGroupBB, deleteGroupSetBB } from "utils/blackboard"
import getAccessToken from "utils/bb_token_cache"


export async function deleteBBGroup(req, params) {
  const courseId = params.courseId

  const body = req.body

  const group = body.group


  // TODO: check if user is instructor
  const bbToken = await getAccessToken()

  if(group.isGroupSet) {
    return deleteGroupSetBB(courseId, group.id, bbToken)
  }
  else {
    return deleteGroupBB(courseId, group.id, bbToken)
  }
}

async function bb(req, res) {
  if (req.method === "POST") {
    const infoDeleteGroup = await deleteBBGroup(req, req.query)

    console.log(infoDeleteGroup)

    res.json(infoDeleteGroup)
  }
}

export default isAuthorized(bb)