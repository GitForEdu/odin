import isAuthorized from "middelwares/authorized"
import getAccessToken from "utils/bb_token_cache"


export async function getCourses() {
  const bbToken = await getAccessToken()
  const response = await fetch(`${process.env.BB_API}/learn/api/public/v3/courses`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  })

  return (await response.json()).results
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