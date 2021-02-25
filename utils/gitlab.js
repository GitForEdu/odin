

const createGroup = async (path, name, pat, parentId) => {
  let payload = {
    name: name,
    path: name.replace(" ", "_"),
    membership_lock: false,
    visibility: "public",
    share_with_group_lock: true,
    require_two_factor_authentication: false,
    project_creation_level: "maintainer",
    auto_devops_enabled: false,
    subgroup_creation_level: "maintainer",
    request_access_enabled: true,
  }

  if(parentId) {
    payload = {
      ...payload,
      parent_id: parentId,
    }
  }

  const response = await fetch(`${path}/api/v4/groups/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
    body: JSON.stringify(payload),
  }).then(r => r.json())

  return response
}

const getGroupInfo = async (path, groupID, pat) => {
  const response = fetch(`${path}/api/v4/groups/${groupID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => r.json())

  return response
}

const getUserInfo = async (path, pat, userName) => {
  const response = fetch(`${path}/api/v4/users?username=${userName}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => r.json()).then(searchResultUser => {
    let user = undefined
    searchResultUser.forEach(usersFoundInSearch => {
      if (usersFoundInSearch.username === userName) {
        user = usersFoundInSearch
      }
    })
    if (user) {
      return user
    }
    return { message: "Cannot find exact user with GitLab search" }
  })
  return response
}

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
const addUserToGroup = async (path, groupID, pat, userName, access_level) => {
  let payload = {
    user_id: userName,
    access_level: access_level,
  }

  const response = fetch(`${path}/api/v4/groups/${groupID}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
    body: JSON.stringify(payload),
  }).then(r => r.json())

  return response
}

const addUsersToGroup = async (path, groupID, pat, userNames, access_level) => {
  if (userNames.length > 0) {
    let payload = {
      user_id: userNames.toString(),
      access_level: access_level,
    }

    const response = fetch(`${path}/api/v4/groups/${groupID}/members`, {
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


const getCourseMembersGitlab = async (path, groupID, pat) => {
  // console.log("getCourseMembersGitlab called with path", path, "groupID", groupID, "PAT", pat)
  const response = await fetch(`${path}/api/v4/groups/${groupID}/members`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => r.json())
  console.log(response)
  if (!response.message) {
    const jsonList = response.map(member => {
      const { username, ...memberObject } = member
      memberObject.userName = username
      return memberObject
    })

    const subGroups = await fetch(`${path}/api/v4/groups/${groupID}/subgroups`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "PRIVATE-TOKEN": pat,
      },
    }).then(r => r.json())

    const subGroupMembers = await Promise.all(subGroups.map(subgroup => {
      return fetch(`${path}/api/v4/groups/${subgroup.id}/members`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "PRIVATE-TOKEN": pat,
        },
      }).then(r => r.json()).then(groupMembers => {
        return {
          group: subgroup,
          groupMembers: groupMembers,
        }
      })
    }))

    // console.log("CourseMembers Gitlab", courseMembers)
    // console.log("Called for subgroups", subGroups)
    // console.log("Subgroupmembers", subGroupMembers)

    return jsonList
  }
  else {
    return response
  }
}

const deleteGroup = async (path, pat, groupId) => {
  const response = await fetch(`${path}/api/v4/groups/${groupId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => r.json())

  return response
}

const getGroupsGitLab = async (path, name, pat) => {
  const parentGroup = await fetch(`${path}/api/v4/groups/${name}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => r.json())

  const subGroups = await fetch(`${path}/api/v4/groups/${parentGroup.id}/subgroups`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => r.json())

  return { ...parentGroup, subGroups: subGroups }
}

const getGroupsGitLabWithMembers = async (path, name, pat) => {
  const parentGroup = await fetch(`${path}/api/v4/groups/${name}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => r.json())

  const subGroups = await fetch(`${path}/api/v4/groups/${parentGroup.id}/subgroups`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => r.json())

  const subGroupsWithMembers = subGroups.map(group => {
    return fetch(`${path}/api/v4/groups/${group.id}/members`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "PRIVATE-TOKEN": pat,
      },
    }).then(r => r.json()).then(groupMembers => {
      const fixedGroupMembers = groupMembers.map(member => {
        const { nameGit, username, ...memberExploded } = member
        const nameArray = nameGit.split(" ")
        const givenName = nameArray[0]
        const familyName = nameArray[1]
        return { ...memberExploded, userName: username, name: { given: givenName, family: familyName } }
      })
      return {
        ...group,
        members: fixedGroupMembers,
      }
    })
  })

  return subGroupsWithMembers
}

export { createGroup, getGroupInfo, addUserToGroup, getUserInfo, getCourseMembersGitlab, addUsersToGroup, deleteGroup, getGroupsGitLab, getGroupsGitLabWithMembers }