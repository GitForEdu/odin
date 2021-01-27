const fetcher = (url, data = undefined) =>
  fetch(window.location.origin + url, {
    method: data ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(r => r.json())

export default fetcher