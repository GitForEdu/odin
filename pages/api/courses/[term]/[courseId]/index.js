import isAuthorized from "middelwares/authorized"
import getAccessToken from "utils/bb_token_cache"
import { getCourseBB } from "utils/blackboard"
// function createFullCourseId(courseid, term) {
//   const year = "20" + term.substring(1,3)
//   const academicTerm = term.substring(0,1)
//   return `194_${courseid}_1_${year}_${academicTerm}_1`
// }


async function course(req, res, session) {
  const query = req.query

  // const courseId = createFullCourseId(query.courseid, query.term)
  const courseId = query.courseid
  const bbToken = await getAccessToken()

  const bbCourse = await getCourseBB(courseId, bbToken)

  if (bbCourse.message) {
    res.json(bbCourse)
  }
  else {
    const userCourses = session.bbUserCourses
    if (userCourses.findIndex(userCourse => userCourse.id === bbCourse.id) !== -1) {
      res.json({ ...bbCourse })
    }
    else {
      res.json({})
    }
  }
}

//https://github.com/vercel/next.js/tree/canary/examples/api-routes-middleware
// https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
export default isAuthorized(course)