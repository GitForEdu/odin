import isAuthorized from "middelwares/authorized"


async function users(req, res, session) {

  const response = await fetch(`${process.env.BB_API}/learn/api/public/v1/users`)
  const bbUsers = await response.json()
  res.json([...bbUsers])
}

//https://github.com/vercel/next.js/tree/canary/examples/api-routes-middleware
// https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
export default isAuthorized(users)