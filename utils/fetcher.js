const fetcher = (url, data = undefined, method = "GET") => {
  let headerBody = {
    method: method ? method : data ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
  if (method !== "GET") {
    headerBody.body = JSON.stringify(data)
  }
  return fetch(window.location.origin + url, headerBody).then(r => r.json())
}

export default fetcher