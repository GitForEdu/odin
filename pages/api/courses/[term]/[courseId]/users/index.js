import isAuthorized from "middelwares/authorized"
import getAccessToken from "utils/bb_token_cache"
import { getSession } from "next-auth/client"
import { getCourseUsersBB, getUserWithUserIdBB } from "utils/blackboard"


// function createFullCourseId(courseid, term) {
//   const year = "20" + term.substring(1,3)
//   const academicTerm = term.substring(0,1)
//   return `194_${courseid}_1_${year}_${academicTerm}_1`
// }

export async function getCourseUsers(req, params) {
  const session = await getSession({ req })
  const bbToken = await getAccessToken()

  const courseId = params.courseId
  //const courseId = createFullCourseId(params.courseid, params.term)
  const userCourses = session.bbUserCourses

  const indexCourse = userCourses.findIndex(course => course.id === courseId)

  if (indexCourse !== -1 && userCourses[indexCourse].role === "Instructor") {
    const courseUsers = await getCourseUsersBB(courseId, bbToken)
    const moreUserInfo = courseUsers.map(user => {
      return getUserWithUserIdBB(user.userId, bbToken)

    })
    const usersWithMoreInfo = Promise.all(moreUserInfo).then(data => {
      return courseUsers.map(user => {
        const userInfo = data.find(userInfoTmp => userInfoTmp.id === user.userId)
        return { ...userInfo, ...user }
      })
    })
    return usersWithMoreInfo
  }
  else {
    return {}
  }
}


async function users(req, res) {
  const query = req.query
  const courseUsers = await getCourseUsers(req, query)

  res.json(courseUsers)
}

//https://github.com/vercel/next.js/tree/canary/examples/api-routes-middleware
// https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
export default isAuthorized(users)