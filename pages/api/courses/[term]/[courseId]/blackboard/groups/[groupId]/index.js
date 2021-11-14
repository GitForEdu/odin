import isAuthorized from "middelwares/authorized"
import getAccessToken from "utils/bb_token_cache"
import { getSession } from "next-auth/react"
import { getCourseGroupUsersBB, getUserWithUserIdBB } from "utils/blackboard"
import { getCourseGroupBB } from "utils/blackboard"

// function createFullCourseId(courseid, term) {
//   const year = "20" + term.substring(1,3)
//   const academicTerm = term.substring(0,1)
//   return `194_${courseid}_1_${year}_${academicTerm}_1`
// }

export async function getCourseGroup(req, params) {
  const session = await getSession({ req })
  const bbToken = await getAccessToken()

  const courseId = params.courseId
  const term = params.term
  const groupId = params.groupId
  const externalId = `externalId:${courseId}-${term}:${groupId}`
  //const courseId = createFullCourseId(params.courseid, params.term)
  const userCourses = session.bbUserCourses

  const indexCourse = userCourses.findIndex(course => course.id === courseId)

  if (indexCourse !== -1 && userCourses[indexCourse].role === "Instructor") {
    const groupBB = await getCourseGroupBB(courseId, externalId, bbToken)
    return getCourseGroupUsersBB(courseId, externalId, bbToken).then(courseGroupUsers => {
      return Promise.all(courseGroupUsers.map(user => {
        return getUserWithUserIdBB(user.userId, bbToken).then(r => {
          return r})
      })).then(r => {
        return { ...groupBB, members: r }
      })
    })
  }
  else {
    return {}
  }
}

async function group(req, res) {
  const query = req.query
  const courseGroup = await getCourseGroup(req, query)

  res.json(courseGroup)
}

//https://github.com/vercel/next.js/tree/canary/examples/api-routes-middleware
// https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
export default isAuthorized(group)