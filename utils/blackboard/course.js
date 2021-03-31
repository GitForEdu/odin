// GET

/*
* Get course on Blackboard
*
* Params
* courseId: the id of the course following blackboard syntaks (_56_1 in test env)
* bbToken: token to communicate with blackboard
*
* Return
* A course
*/
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

/*
* Get courses on Blackboard
*
* Params
* bbToken: token to communicate with blackboard
*
* Return
* A list of courses
*/
const getCoursesBB = (bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v3/courses`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json()).then(data => {
    if(data.results) {
      return data.results
    }
    return data
  })

  return response
}

export {
  getCourseBB,
  getCoursesBB
}