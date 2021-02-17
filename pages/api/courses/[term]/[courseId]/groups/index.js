import isAuthorized from "middelwares/authorized"
import getAccessToken from "utils/bb_token_cache"
import { getSession } from "next-auth/client"
import { getCourseGroupsBB, getCourseGroupUsersBB, getUserWithUserIdBB } from "utils/blackboard"

// function createFullCourseId(courseid, term) {
//   const year = "20" + term.substring(1,3)
//   const academicTerm = term.substring(0,1)
//   return `194_${courseid}_1_${year}_${academicTerm}_1`
// }

export async function getCourseGroups(req, params) {
  const session = await getSession({ req })
  const bbToken = await getAccessToken()

  const courseId = params.courseId
  //const courseId = createFullCourseId(params.courseid, params.term)
  const userCourses = session.bbUserCourses

  const indexCourse = userCourses.findIndex(course => course.id === courseId)

  if (indexCourse !== -1 && userCourses[indexCourse].role === "Instructor") {
    const courseGroups = await getCourseGroupsBB(courseId, bbToken)
    const courseGroupsWithUsers = Promise.all(courseGroups.map(courseGroup => {
      return getCourseGroupUsersBB(courseId, courseGroup.id, bbToken).then(courseGroupUsers => {
        return Promise.all(courseGroupUsers.map(user => {
          return getUserWithUserIdBB(user.userId, bbToken).then(r => {
            return r})
        })).then(r => {
          return { ...courseGroup, members: r }
        })
      })
    })).then(r => {
      return r
    })
    return courseGroupsWithUsers
  }
  else {
    return []
  }
}


async function groups(req, res) {
  const query = req.query
  const courseGroups = await getCourseGroups(req, query)

  res.json(courseGroups)
}

//https://github.com/vercel/next.js/tree/canary/examples/api-routes-middleware
// https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
export default isAuthorized(groups)