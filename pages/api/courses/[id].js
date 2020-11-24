import isAuthorized from "middelwares/authorized"


function courses(req, res, session) {
  res.json({ session, query: req.query })
}

//https://github.com/vercel/next.js/tree/canary/examples/api-routes-middleware
// https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
export default isAuthorized(courses)