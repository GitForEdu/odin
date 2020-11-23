

const UserInfo = (id_token, access_token) => {
  return fetch(process.env.REACT_APP_API_URL + "userinfo", {
    method: "GET",
    headers:  {
      "Authorization": "Bearer " + id_token,
      "access-token": access_token,
      "Accept": "application/json",
    },
  })
    .then(response => {
      if (!response.ok) {
        console.log(response)
      }
      return response.json()
    })
    .then(json => {
      return json
    })
    .catch(error => {
      console.log(error)
    })
}

export { UserInfo }