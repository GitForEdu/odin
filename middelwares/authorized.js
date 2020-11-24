import { getSession } from "next-auth/client"

const isAuthorized = handler => async (req, res) => {

  // req holds the cookies that will be decrypted by next-auth
  const session = await getSession({ req })

  if (!session || session.error === "AccessTokenExpired") {
    res.status("401").send("Unauthorized")
    return handler(req, res)
  }
  return handler(req, res, session)
}

export default isAuthorized