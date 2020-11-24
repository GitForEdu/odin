import NextAuth from "next-auth"


const auth = (req, res) => NextAuth(req, res, {
  events: {
    error(err) {
      // You can use this to log errors to an external logging service or similar
      console.error(err)
    },
  },
  callbacks: {
    async redirect(url, baseUrl) {
      if (url.startsWith(baseUrl)) {
        return url
      }
      // If the redirect url is not absolute, prepend with base URL
      return new URL(url, baseUrl).toString()
    },
    async jwt(prevToken, user, account, profile) {

      // If true, this is a signin
      if (user && account) {
        // Map this how you want. What is returned here, will be saved in an encrypted cookie. (Browser limit ~4096 bytes)
        const userId = profile["dataporten-userid_sec"][0]
        const regex = /(?<=:)(\w+)(?=@)/g
        const username = userId.match(regex)[0]
        // const blackBoardId = await getBlackBoardId()
        return {
          accessToken: account.accessToken,
          accessTokenExpires: Date.now() + 20000,
          name: user.name,
          // blackBoardId,
          username,
        }
      }

      console.log(prevToken)

      if (prevToken.accessTokenExpires - Date.now() < 1000) {
        return { error: "AccessTokenExpired" }
      }

      return prevToken

    },
    async session(_, token) { // If the user calls getSession or useSession, return the token returned from the jwt callback
      return token
    },
  },
  providers: [
    {
      id: "dataporten",
      name: "Dataporten",
      type: "oauth",
      version: "2.0",
      scope: process.env.SCOPES,
      params: { grant_type: "authorization_code" },
      accessTokenUrl: `${process.env.ISSUER}/oauth/token`,
      authorizationUrl: `${process.env.ISSUER}/oauth/authorization?response_type=code`,
      profileUrl: `${process.env.ISSUER}/openid/userinfo`,
      profile(profile) {
        console.log("profile", profile)
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
  ],
})

export default auth