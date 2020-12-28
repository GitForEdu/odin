import NodeCache from "node-cache"
import encodeToUrl from "utils/encodeToUrl"


const cache = new NodeCache()

/**
 * Retrieves an access_token from IDS for building purposes,
 * using client_credentials (client secret) authorization type.
 */
export default async function getAccessToken() {
  try {

    const cachedAccessToken = cache.get("access_token")
    // Try returning the cached token
    if (cachedAccessToken) {
      return cachedAccessToken
    }

    /**
     * If no access token was present in the cache, fetch a new one
     * @note Do not need to use refresh tokens, since we are server-side
     * @see https://tools.ietf.org/html/rfc6749#section-4.4.3
     */

    const accessToken = await getServerSideAccessToken()

    // Update the cache with a time-to-live
    cache.set("access_token", accessToken.access_token, accessToken.expires_in)

    return accessToken.access_token
  } catch (error) {
    throw error
  }
}


async function getServerSideAccessToken() {
  const url = `https://${process.env.BB_URL}/learn/api/public/v1/oauth2/token`

  const response = await fetch(url, {
    body: encodeToUrl({
      client_id: process.env.BB_CLIENT_ID,
      client_secret: process.env.BB_CLIENT_SECRET,
      grant_type: "client_credentials",
      scope: "",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "post",
  })

  const accessToken = await response.json()

  if (response.ok) {
    return {
      ...accessToken,
      // Give a 10 sec buffer
      expires_in: accessToken.expires_in - 10,
    }
  }

  throw {
    message: "AccessTokenError",
    accessToken,
  }
}
