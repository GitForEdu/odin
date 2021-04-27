import NodeCache from "node-cache"

const cacheFetches = new NodeCache({

})


export default async function cachedFetch(url, init) {
  try {
    const key = `${url}_token=${init.headers["PRIVATE-TOKEN"]}`
    const cachedResponse = cacheFetches.get(key)
    // Try returning the cached response
    if (cachedResponse && init.method === "GET") {
      return cachedResponse
    }

    const response = await fetch(url, init)

    const headers = response.headers
    const json = await response.json()
    const res = { headers, json }

    // Update the cache with a time-to-live
    if (init.method === "GET") {
      cacheFetches.set(key, res, 3600)
    }
    return res
  } catch (error) {
    throw error
  }
}

