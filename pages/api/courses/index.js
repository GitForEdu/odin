import isAuthorized from "middelwares/authorized"


async function courses(req, res, session) {

  const response = await fetch(`${process.env.BB_API}/learn/api/public/v3/courses`)
  const bbCourses = await response.json()
  res.json([ ...bbCourses ])
}

//https://github.com/vercel/next.js/tree/canary/examples/api-routes-middleware
// https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
export default isAuthorized(courses)