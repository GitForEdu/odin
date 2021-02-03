import isAuthorized from "middelwares/authorized"
import getAccessToken from "utils/bb_token_cache"
import { getCoursesBB } from "utils/blackboard"


export async function getCourses() {
  const bbToken = await getAccessToken()
  const courses = getCoursesBB(bbToken)
  return courses
}

async function courses(req, res, session) {
  const bbCourses = await getCourses()
  let filteredCourses = []
  session.bbUserCourses.forEach(userCourse => {
    const indexCourse = bbCourses.findIndex(course => course.id === userCourse.id)
    if (indexCourse !== -1) {
      filteredCourses.push(bbCourses[indexCourse])
    }
  })
  res.json(filteredCourses)
}

//https://github.com/vercel/next.js/tree/canary/examples/api-routes-middleware
// https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
export default isAuthorized(courses)