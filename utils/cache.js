import NodeCache from "node-cache"

const cacheFetches = new NodeCache()

const cacheOwnCalls = new NodeCache()


export async function cachedFetch(url, init) {
  try {
    const key = `${url}_token=${init.headers["PRIVATE-TOKEN"]}`
    const cachedResponse = cacheFetches.get(key)

    // Try returning the cached response
    if (cachedResponse) {
      console.log(cacheFetches.getStats())
      return cachedResponse
    }

    const response = await fetch(url, init)

    const headers = response.headers
    const json = await response.json()
    const res = { headers, json }

    // Update the cache with a time-to-live
    cacheFetches.set(key, res, 3600)

    return res
  } catch (error) {
    throw error
  }
}

export async function cacheCalls(req, userName, func, funcParams) {
  const key = `${req.url}_userName=${userName}`
  const cachedResponse = cacheOwnCalls.get(key)

  // Try returning the cached response
  if (cachedResponse) {
    return cachedResponse
  }
  const response = await func(...funcParams)

  // Update the cache with a time-to-live
  cacheOwnCalls.set(key, response, 3600)

  return response
}
