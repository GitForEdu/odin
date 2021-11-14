import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import getbbUserInfo from "./bbInfo"


const auth = (req, res) => NextAuth(req, res, {
  events: {
    error(err) {
      // You can use this to log errors to an external logging service or similar
      console.error(err)
    },
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url
      }
      // If the redirect url is not absolute, prepend with base URL
      return new URL(url, baseUrl).toString()
    },
    async jwt({ token, user, account, profile }) {

      // If true, this is a signin
      if (user && account) {
        let username = ""
        if (account.provider == "dataporten") {
          // Map this how you want. What is returned here, will be saved in an encrypted cookie. (Browser limit ~4096 bytes)
          const userId = profile["dataporten-userid_sec"][0]
          const regex = /(?<=:)(\w+)(?=@)/g
          username = userId.match(regex)[0]
        }
        if (account.provider == "github") {
          // TODO: Get email for logged in Github user
          // https://stackoverflow.com/questions/35373995/github-user-email-is-null-despite-useremail-scope
          username = profile.login
        }
        
        const bbUserInfo = await getbbUserInfo(username)

        // const blackBoardId = await getBlackBoardId()
        return {
          accessToken: account.accessToken,
          accessTokenExpires: Date.now() + 287000000,
          name: user.name,
          // blackBoardId,
          username,
          bbUserId: bbUserInfo.bbUserId,
          bbUserCourses: bbUserInfo.bbUserCourses,
        }
      }

      if (token.accessTokenExpires - Date.now() < 5000) {
        return { error: "AccessTokenExpired" }
      }

      return token
    },
    async session({ token }) { // If the user calls getSession or useSession, return the token returned from the jwt callback
      return token
    },
  },
  providers: [
    {
      id: "dataporten",
      name: "Dataporten",
      wellKnown: `${process.env.ISSUER}/.well-known/openid-configuration`,
      type: "oauth",
      authorization: {
        params: {
          scope: process.env.SCOPES
        },
      },
      checks: ["pkce", "state"],
      idToken: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
      clientId: process.env.DATAPORTEN_CLIENT_ID,
      clientSecret: process.env.DATAPORTEN_CLIENT_SECRET,
    },
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
  ],
})

export default auth