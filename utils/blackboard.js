

const getCourseGroupsBB = (courseId, bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v1/courses/${courseId}/groups`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json()).then(data => data.results)
  return response
}

const getCourseUsersBB = (courseId, bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v1/courses/${courseId}/users`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json())
  return response
}

const getCourseBB = (courseId, bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v3/courses/${courseId}`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json())
  return response
}

const getCoursesBB = (bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v3/courses`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json()).then(data => data.results)

  return response
}

const getUserBB = (userName, bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v1/users/userName:${userName}`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json())

  return response
}

export { getCourseGroupsBB, getCourseUsersBB, getCourseBB, getCoursesBB, getUserBB }
