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

async function courses(req, res) {
  const bbCourses = getCourses()
  res.json([ ...bbCourses ])
}

//https://github.com/vercel/next.js/tree/canary/examples/api-routes-middleware
// https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
export default isAuthorized(courses)