// Helpers
import { cachedFetch } from "utils/cache"

const remapUserObjectToFitBlackboard = (user) => {
  const { name, username, ...memberExploded } = user
  const nameArray = name.split(" ")
  let givenName = name
  let familyName = ""
  if (nameArray.length > 1) {
    givenName = nameArray[0]
    familyName = nameArray[nameArray.length - 1]
  }
  return { ...memberExploded, userName: username, name: { given: givenName, family: familyName } }
}


// GET

/*
* Get a user on the gitlab instance, use userName to search
*
* Params
* path: The path to the gitlab instance (gitlab.idi.ntnu.no)
* pat: Personal Access Token
* userName: userName of user you want to find
*
* Return
* A user object. Contains id, name,
*/
const getUserGit = async (path, pat, userName) => {
  const response = cachedFetch(`${path}/api/v4/users?username=${userName}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => r.json).then(searchResultUser => {
    let user = undefined
    searchResultUser.forEach(usersFoundInSearch => {
      if (usersFoundInSearch.username === userName) {
        user = usersFoundInSearch
      }
    })
    if (user) {
      return remapUserObjectToFitBlackboard(user)
    }
    return { message: "Cannot find exact user with GitLab search" }
  })
  return response
}

/*
* Get all users in the course on the gitlab instance
*
* Params
* path: The path to the gitlab instance (gitlab.idi.ntnu.no)
* groupId: int ID or URL encoded path of parent group (_56_1/Group_0)
* pat: Personal Access Token
*
* Return
* A list of user objects. Contains id, name,
*/
const getCourseUsersGit = async (path, groupId, pat) => {
  const members = await cachedFetch(`${path}/api/v4/groups/${groupId}/members`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => r.json)

  if (!members.message) {
    const listOfMembers = members.map(member => {
      return remapUserObjectToFitBlackboard(member)
    })

    return listOfMembers
  }
  else {
    return members
  }
}

/*
* Get all students in the course on the gitlab instance
*
* Params
* path: The path to the gitlab instance (gitlab.idi.ntnu.no)
* groupId: int ID or URL encoded path of parent group (_56_1/Group_0)
* pat: Personal Access Token
*
* Return
* A list of user objects. Contains id, name
*/
const getCourseStudentsGit = async (path, groupId, pat) => {
  const members = getCourseUsersGit(path, groupId, pat)

  return members.filter(member => member.access_level !== 50)
}

// POST / Create

/*
  Access_Level:
  - No access: 0
  - Minimanl access: 5
  - Guest: 10
  - Reporter: 20
  - Developer: 30
  - Maintainer: 40
  - Owner: 50 (Valid only for groups)
*/

/*
* Add a user to a group on the gitlab instance
*
* Params
* path: The path to the gitlab instance (gitlab.idi.ntnu.no)
* groupId: int ID or URL encoded path of parent group (_56_1/Group_0)
* pat: Personal Access Token
* userName: userName of user you want to add
* access_level: which role / how much control the user shall have in the group
*
* Return
* only 200
*/
const addUserToGroupGit = async (path, groupId, pat, userName, access_level) => {
  let payload = {
    user_id: userName,
    access_level: access_level,
  }

  const response = fetch(`${path}/api/v4/groups/${groupId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
    body: JSON.stringify(payload),
  }).then(r => r.json())

  return response
}

/*
* Add users to a group on the gitlab instance
*
* Params
* path: The path to the gitlab instance (gitlab.idi.ntnu.no)
* groupId: int ID or URL encoded path of parent group (_56_1/Group_0)
* pat: Personal Access Token
* userNames: userNames of users you want to add as a array
* access_level: which role / how much control the users shall have in the group
*
* Return
* only 200?
*/
const addUsersToGroupGit = async (path, groupId, pat, userNames, access_level) => {
  if (userNames.length > 0) {
    let payload = {
      user_id: userNames.toString(),
      access_level: access_level,
    }

    const response = fetch(`${path}/api/v4/groups/${groupId}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "PRIVATE-TOKEN": pat,
      },
      body: JSON.stringify(payload),
    }).then(r => r.json())

    return response
  }
  else {
    return { message: "no members / no members found, none added to group", status: "success" }
  }
}

// DELETE

/*
* Removes a user from a group on the gitlab instance
*
* Params
* path: The path to the gitlab instance (gitlab.idi.ntnu.no)
* groupId: int ID or URL encoded path of parent group (_56_1/Group_0)
* pat: Personal Access Token
* userId: The user ID of the member or multiple IDs separated by commas. Gitlab own id of userName (not userName)

* Return
* only 200?
*/
const removeUserInGroupGit = async (path, groupId, pat, userId) => {
  const response = fetch(`${path}/api/v4/groups/${groupId}/members/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => r)

  return response
}


export {
  remapUserObjectToFitBlackboard,
  getUserGit,
  getCourseUsersGit,
  getCourseStudentsGit,
  addUserToGroupGit,
  addUsersToGroupGit,
  removeUserInGroupGit
}