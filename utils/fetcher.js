const fetcher = (url, data = undefined, method = "GET") =>
  fetch(window.location.origin + url, {
    method: method ? method : data ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(r => r.json())

export default fetcher