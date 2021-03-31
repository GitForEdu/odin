// GET

/*
* Get users in course, this returns only usersId
*
* Params
* courseId: the id of the course following blackboard syntaks (_56_1 in test env)
* bbToken: token to communicate with blackboard
*
* Return
* A list of users in course
*/
const getCourseUsersBB = (courseId, bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v1/courses/${courseId}/users`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json()).then(data => {
    if (data.results) {
      return data.results
    }
    return data
  })
  return response
}

/*
* Get users in course, but with userInfo added
*
* Params
* courseId: the id of the course following blackboard syntaks (_56_1 in test env)
* bbToken: token to communicate with blackboard
*
* Return
* A list of users in course
*/
const getCourseUsersExpandedBB = (courseId, bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v1/courses/${courseId}/users?expand=user`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json()).then(data => {
    if (data.results) {
      return data.results
    }
    return data
  })
  return response
}

/*
* Get students in course, with userInfo added
*
* Params
* courseId: the id of the course following blackboard syntaks (_56_1 in test env)
* bbToken: token to communicate with blackboard
*
* Return
* A list of students in course
*/
const getCourseStudentsExpandedBB = async (courseId, bbToken) => {
  const users = await getCourseUsersExpandedBB(courseId, bbToken)
  if (Array.isArray(users)) {
    return users.filter(user => user.courseRoleId === "Student")
  }
  return users
}

/*
* Get user from blacbkoard using userId
*
* Params
* userId: the id of the user following blackboard syntaks
* bbToken: token to communicate with blackboard
*
* Return
* A user in course
*/
const getUserWithUserIdBB = (userId, bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v1/users/${userId}`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json())

  return response
}

/*
* Get user from blacbkoard using userName
*
* Params
* userName: the userName of the user
* bbToken: token to communicate with blackboard
*
* Return
* A user in course
*/
const getUserWithUserNameBB = (userName, bbToken) => {
  const response = fetch(`${process.env.BB_API}/learn/api/public/v1/users/userName:${userName}`, {
    method: "GET",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  }).then(r => r.json())

  return response
}

// POST / Create

/*
* Add a user to a group on blacbkoard using userId
*
* Params
* courseId: the id of the course following blackboard syntaks (_56_1 in test env)
* groupId: the id of the group
* userId: the id of the user following blackboard syntaks
* bbToken: token to communicate with blackboard
*
* Return
* The user added
*/
const addStudentToGroupWithUserIdBB = async (courseId, groupId, userId, bbToken) => {
  const response = await fetch(`${process.env.BB_API}/learn/api/public/v2/courses/${courseId}/groups/${groupId}/users/${userId}`, {
    method: "PUT",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/json",
    }),
  }).then(r => r.json())

  return response
}

/*
* Add a user to a group on blacbkoard using userName
*
* Params
* courseId: the id of the course following blackboard syntaks (_56_1 in test env)
* groupId: the id of the group
* userName: the userName of the user
* bbToken: token to communicate with blackboard
*
* Return
* The user added
*/
const addStudentToGroupWithUserNameBB = async (courseId, groupId, userName, bbToken) => {
  const response = await fetch(`${process.env.BB_API}/learn/api/public/v2/courses/${courseId}/groups/${groupId}/users/userName:${userName}`, {
    method: "PUT",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/json",
    }),
  }).then(r => r.json())

  return response
}

// Delete

/*
* Remove a user from a group on blacbkoard using userName
*
* Params
* courseId: the id of the course following blackboard syntaks (_56_1 in test env)
* groupId: the id of the group
* userName: the userName of the user
* bbToken: token to communicate with blackboard
*
* Return
* 200?
*/
const removeStudentInGroupWithUserNameBB = async (courseId, groupId, userName, bbToken) => {
  const response = await fetch(`${process.env.BB_API}/learn/api/public/v2/courses/${courseId}/groups/${groupId}/users/userName:${userName}`, {
    method: "DELETE",
    headers: new Headers({
      "Authorization" : `Bearer ${bbToken}`,
      "Content-Type": "application/json",
    }),
  }).then(r => r)

  return response
}

export {
  getCourseUsersBB,
  getCourseUsersExpandedBB,
  getCourseStudentsExpandedBB,
  getUserWithUserIdBB,
  getUserWithUserNameBB,
  addStudentToGroupWithUserIdBB,
  addStudentToGroupWithUserNameBB,
  removeStudentInGroupWithUserNameBB
}