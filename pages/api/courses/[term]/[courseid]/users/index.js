import isAuthorized from "middelwares/authorized"

function createFullCourseId(courseid, term) {
  const year = "20" + term.substring(1,3)
  const academicTerm = term.substring(0,1)
  return `194_${courseid}_1_${year}_${academicTerm}_1`
}


async function users(req, res, session) {
  const query = req.query

  const courseId = createFullCourseId(query.courseid, query.term)
  const response = await fetch(`${process.env.BB_API}/learn/api/public/v1/courses/${courseId}/users`)
  const bbUsers = await response.json()
  res.json([ ...bbUsers ])
}

//https://github.com/vercel/next.js/tree/canary/examples/api-routes-middleware
// https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
export default isAuthorized(users)