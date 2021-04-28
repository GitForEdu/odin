import { remapUserObjectToFitBlackboard } from "./student"
import { cachedFetch } from "utils/cache"

// GET stuff for gitlab group

/*
* Params
* path: The path to the gitlab instance (gitlab.idi.ntnu.no)
* groupId: int ID or URL encoded path of group (_56_1/Group_0)
* pat: Personal Access Token
*
* Return
* A group object. Contains id, name, path with more
*/
const getGroupGit = async (path, groupId, pat) => {
  const response = await cachedFetch(`${path}/api/v4/groups/${groupId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  })

  return response.json
}

/*
* Params
* path: The path to the gitlab instance (gitlab.idi.ntnu.no)
* groupId: int ID or URL encoded path of group (_56_1/Group_0)
* pat: Personal Access Token
*
* Return
* A group object. Contains id, name, path with more
* Also fetch the members of the group and add them to the object.
* filter out owners to get the students
* rename username into userName
* split name into object with given and family name
*/
const getGroupWithStudentsGit = async (path, groupId, pat) => {
  const group = await getGroupGit(path, groupId, pat)

  const groupMembers = await cachedFetch(`${path}/api/v4/groups/${group.id}/members`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(rr => rr.json)

  const fixedGroupMembers = groupMembers.filter(member => member.access_level !== 50).map(member_2 => {
    return remapUserObjectToFitBlackboard(member_2)
  })

  return {
    ...group,
    members: fixedGroupMembers,
  }
}

/*
* Params
* path: The path to the gitlab instance (gitlab.idi.ntnu.no)
* groupId: int ID or URL encoded path of parent group (_56_1/Group_0)
* pat: Personal Access Token
*
* Return
* A list of group objects. Contains id, name, path with more
* Also fetch the members of the group and add them to the object.
* filter out owners to get the students
* rename username into userName
* split name into object with given and family namee
*/
const getGroupsGit = async (path, courseNameGit, pat, page) => {
  const parentGroup = await getGroupGit(path, courseNameGit, pat)

  const response = await cachedFetch(`${path}/api/v4/groups/${parentGroup.id}/subgroups?per_page=100&page=${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  })

  let subGroups = await response.json

  if (/<([^>]+)>; rel="next"/g.test(response.headers.get("link"))) {
    page = new URL(/<([^>]+)>; rel="next"/g.exec(response.headers.get("link"))[1]).searchParams.get("page")
    subGroups = subGroups.concat(await getGroupsGit(path, courseNameGit, pat, page))
  }

  return { ...parentGroup, subGroups: subGroups }
}


/*
* Params
* path: The path to the gitlab instance (gitlab.idi.ntnu.no)
* groupId: int ID or URL encoded path of parent group (_56_1/Group_0)
* pat: Personal Access Token
*
* Return
* A list of group objects. Contains id, name, path with more
*/
const getGroupsWithStudentsGit = async (path, courseNameGit, pat, page) => {
  const parentGroup = await getGroupGit(path, courseNameGit, pat)

  const response = await cachedFetch(`${path}/api/v4/groups/${parentGroup.id}/subgroups?per_page=100&page=${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  })

  let subGroups = await response.json

  if (/<([^>]+)>; rel="next"/g.test(response.headers.get("link"))) {
    page = new URL(/<([^>]+)>; rel="next"/g.exec(response.headers.get("link"))[1]).searchParams.get("page")
    subGroups = subGroups.concat(await getGroupsGit(path, courseNameGit, pat, page))
  }

  if (!parentGroup.message) {
    const subGroupsWithMembers = subGroups.map(group => {
      return cachedFetch(`${path}/api/v4/groups/${group.id}/members`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "PRIVATE-TOKEN": pat,
        },
      }).then(r => r.json).then(groupMembers => {
        const fixedGroupMembers = groupMembers.filter(member => member.access_level !== 50).map(member_2 => {
          return remapUserObjectToFitBlackboard(member_2)
        })
        return {
          ...group,
          members: fixedGroupMembers,
        }
      })
    })
    return Promise.all(subGroupsWithMembers)
  }
  return parentGroup
}

// POST

/*
* Create either a main group or subGroup of parentId is provided
*
* Params
* path: The path to the gitlab instance (gitlab.idi.ntnu.no)
* courseNameGit: the name you want for your subGroup
* pat: Personal Access Token
* parentId: the id of the parentGroup
*
* Return
* A group object. Contains id, name, path with more
*/
const createGroupGit = async (path, courseNameGit, pat, parentId) => {
  let payload = {
    name: courseNameGit,
    path: courseNameGit.replace(" ", "_"),
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

// DELETE

/*
* Delete either a main group or subGroup of parentId is provided
*
* Params
* path: The path to the gitlab instance (gitlab.idi.ntnu.no)
* pat: Personal Access Token
* groupId: the id of the group to delete
*
* Return
* 200?
*/
const deleteGroupGit = async (path, pat, groupId) => {
  const response = await fetch(`${path}/api/v4/groups/${groupId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => r.json())

  return response
}

export {
  getGroupGit,
  getGroupWithStudentsGit,
  getGroupsGit,
  getGroupsWithStudentsGit,
  createGroupGit,
  deleteGroupGit
}