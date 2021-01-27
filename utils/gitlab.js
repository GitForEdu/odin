

const createGroup = async (path, name, pat, parentId) => {
  let payload = {
    name: name,
    path: name,
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
  })

  return await response.json()
}

const getGroupInfo = async (path, name, pat) => {
  const response = await fetch(`${path}/api/v4/groups/${name}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  })

  return await response.json()
}


export { createGroup, getGroupInfo }