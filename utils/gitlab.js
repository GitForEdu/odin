

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

const getGroupGit = async (path, groupId, pat) => {
  const response = fetch(`${path}/api/v4/groups/${groupId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => r.json())

  return response
}

const getUserGit = async (path, pat, userName) => {
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


const getCourseUsersGit = async (path, groupId, pat) => {
  // console.log("getCourseMembersGitlab called with path", path, "groupID", groupID, "PAT", pat)
  const response = await fetch(`${path}/api/v4/groups/${groupId}/members`, {
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

    // const subGroups = await fetch(`${path}/api/v4/groups/${groupID}/subgroups`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "PRIVATE-TOKEN": pat,
    //   },
    // }).then(r => r.json())

    // const subGroupMembers = await Promise.all(subGroups.map(subgroup => {
    //   return fetch(`${path}/api/v4/groups/${subgroup.id}/members`, {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "PRIVATE-TOKEN": pat,
    //     },
    //   }).then(r => r.json()).then(groupMembers => {
    //     return {
    //       group: subgroup,
    //       groupMembers: groupMembers,
    //     }
    //   })
    // }))

    // console.log("CourseMembers Gitlab", courseMembers)
    // console.log("Called for subgroups", subGroups)
    // console.log("Subgroupmembers", subGroupMembers)

    return jsonList
  }
  else {
    return response
  }
}

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

const getGroupsGit = async (path, courseNameGit, pat) => {
  const response = await fetch(`${path}/api/v4/groups/${courseNameGit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  })

  const parentGroup = await response.json()

  const subGroups = await fetch(`${path}/api/v4/groups/${parentGroup.id}/subgroups`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => r.json())

  return { ...parentGroup, subGroups: subGroups }
}

const getGroupsWithStudentsGit = async (path, courseNameGit, pat) => {
  const parentGroup = await fetch(`${path}/api/v4/groups/${courseNameGit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => r.json())

  if (!parentGroup.message) {
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
        const fixedGroupMembers = groupMembers.filter(member => member.access_level !== 50).map(member => {
          const { name, username, ...memberExploded } = member
          const nameArray = name.split(" ")
          let givenName = name
          let familyName = ""
          if (nameArray.length > 1) {
            givenName = nameArray[0]
            familyName = nameArray[nameArray.length - 1]
          }
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
  return parentGroup
}

const getGroupProjects = async (path, courseNameGit, groupId, pat) => {
  const projects = await fetch(`${path}/api/v4/groups/${courseNameGit}/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => r.json())
  console.log("projects", projects)

  return projects
}

const getProjectCommits = async (path, projectId, pat, since, until, page) => {
  let fetchUrl = `${path}/api/v4/projects/${projectId}/repository/commits?ref_name=master&with_stats=true&all=false&per_page=100&page=${page}`
  if (since) {
    fetchUrl = fetchUrl + `&since="${since}"`
  }
  if (until) {
    fetchUrl = fetchUrl + `&until="${until}"`
  }
  const response = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  })

  let commits = await response.json()

  if (/<([^>]+)>; rel="next"/g.test(response.headers.get("link"))) {
    page = new URL(/<([^>]+)>; rel="next"/g.exec(response.headers.get("link"))[1]).searchParams.get("page")
    commits = commits.concat(await getProjectCommits(path, projectId, pat, since, until, page))
  }

  return commits.filter(commit => commit.parent_ids.length < 2)
}

const getProjectBranches = async (path, projectId, pat) => {
  let fetchUrl = `${path}/api/v4/projects/${projectId}/repository/branches`
  const branches = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => {
    return r.json()
  })

  return branches
}

const getProjectWikiPages = async (path, projectId, pat) => {
  let fetchUrl = `${path}/api/v4/projects/${projectId}/wikis`
  const wikiPages = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => {
    return r.json()
  })

  return wikiPages
}

const getProjectFiles = async (path, projectId, pat, fileBlame, page) => {
  let fetchUrl = `${path}/api/v4/projects/${projectId}/repository/tree?recursive=true&per_page=100&page=${page}`
  const response = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  })

  let files = await response.json()

  if (/<([^>]+)>; rel="next"/g.test(response.headers.get("link"))) {
    page = new URL(/<([^>]+)>; rel="next"/g.exec(response.headers.get("link"))[1]).searchParams.get("page")
    files = files.concat(await getProjectFiles(path, projectId, pat, page))
  }

  files = files.filter(file => file.type === "blob")
  if (fileBlame) {
    files = await Promise.all(files.map(file => {
      return getFileBlameData(path, pat, projectId, file.path).then(r => {
        return { ...file, blameData: r }
      })
    }))
  }

  return files
}

const getFileBlameData = async (path, pat, projectId, pathToFile ) => {
  let fetchUrl = `${path}/api/v4/projects/${projectId}/repository/files/${encodeURIComponent(pathToFile)}/blame?ref=master`
  const fileBlame = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => {
    return r.json()
  })

  return fileBlame
}

const getGroupKeyStats = async (path, pat, fullPathGit, since, until, fileBlame) => {
  let issuesInput = ""
  if (since) {
    issuesInput = issuesInput + `createdAfter: "${since}",`
  }
  if (until) {
    issuesInput = issuesInput + `createdBefore: "${until}",`
  }
  if (issuesInput) {
    issuesInput = `(${issuesInput})`
  }
  const query = `
  {
    group(fullPath: "${fullPathGit}") {
      id
      name
      projects (includeSubgroups: true){
        nodes {
          id
          lastActivityAt
          createdAt
          statistics {
            wikiSize
          }
        }
      }
      issues${issuesInput} {
        nodes {
          createdAt
          state
          assignees {
            nodes {
              username
            }
          }
        }
      }
      mergeRequests {
        nodes {
          createdAt
          state
          commitCount
        }
        totalTimeToMerge
      }
      milestones {
        nodes {
          createdAt
          state
        }
      }
      
    }
  }
  `

  const groupStats = await fetch(`${path}/api/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
    body: JSON.stringify({ query }),
  }).then(r => r.json()).then(d => {
    const groupInfo = d.data.group

    const projects = groupInfo.projects.nodes
    const milestones = groupInfo.milestones.nodes.filter(milestone => milestone.createdAt <= until && milestone.createdAt >= since)
    const mergeRequests = groupInfo.mergeRequests.nodes.filter(mergeRequest => mergeRequest.createdAt <= until && mergeRequest.createdAt >= since)
    const issues = groupInfo.issues.nodes
    const issuesCount = issues.length
    const totalWikiSize = projects.map(project => project.statistics.wikiSize).reduce((acc, curr) => acc + curr, 0)
    //projects.push({ id: "gid://gitlab/Project/6080" })
    let issuesOpen = 0
    let issuesClosed = 0
    if (issuesCount > 0) {
      issuesOpen = issues.filter(issue => issue.state === "opened").length
      issuesClosed = issues.filter(issue => issue.state === "closed").length
    }

    return { name: groupInfo.name, issues: issues, issuesCount: issuesCount, issuesOpen: issuesOpen, issuesClosed, projects: projects, milestones: milestones, totalWikiSize: totalWikiSize, mergeRequests: mergeRequests }
  })

  const commitsPromise = Promise.all(groupStats.projects.map(project => {
    return getProjectCommits(path, project.id.replace("gid://gitlab/Project/", ""), pat, since, until, 1)
  })).then(commitsNestedArray => {
    return commitsNestedArray.flat()
  })

  const branchesPromise = Promise.all(groupStats.projects.map(project => {
    return getProjectBranches(path, project.id.replace("gid://gitlab/Project/", ""), pat, since, until)
  })).then(branchesNestedArray => {
    return branchesNestedArray.flat()
  })

  const wikiPagesPromise = Promise.all(groupStats.projects.map(project => {
    return getProjectWikiPages(path, project.id.replace("gid://gitlab/Project/", ""), pat, since, until)
  })).then(wikiPagesNestedArray => {
    return wikiPagesNestedArray.flat()
  })

  const projectFilesPromise = Promise.all(groupStats.projects.map(project => {
    return getProjectFiles(path, project.id.replace("gid://gitlab/Project/", ""), pat, fileBlame, 1)
  })).then(projectFilesNestedArray => {
    return projectFilesNestedArray.flat()
  })

  const commits = await commitsPromise
  const branches = await branchesPromise
  const wikiPages = await wikiPagesPromise
  const projectFiles = await projectFilesPromise

  const contributorStats = {}

  const commitStats = {}

  const projectStats = {
    linesOfCode: 0,
    additions: 0,
    deletions: 0,
    numberOfFiles: projectFiles.length,
  }

  groupStats.projects.forEach(project => {
    if (!projectStats.lastActivity || projectStats.lastActivity > project.lastActivityAt) {
      projectStats.lastActivity = project.lastActivityAt
    }
  })

  commits.forEach(commit => {
    const committerEmail = commit.committer_email
    const commiterName = commit.committer_name
    const additions = commit.stats.additions
    const deletions = commit.stats.deletions

    projectStats.additions = projectStats.additions + additions
    projectStats.deletions = projectStats.deletions + deletions

    if (!commitStats.last || commitStats.last < commit.created_at) {
      commitStats.last = commit.created_at
    }

    if (!commitStats.first || commitStats.first > commit.created_at) {
      commitStats.first = commit.created_at
    }

    if (contributorStats[committerEmail]) {
      contributorStats[committerEmail].additions = contributorStats[committerEmail].additions + additions
      contributorStats[committerEmail].deletions = contributorStats[committerEmail].deletions + deletions
    }
    else {
      contributorStats[committerEmail] = {
        lines: 0,
        addiadditionstion: additions,
        deletions: deletions,
        name: commiterName,
      }
    }
  })

  if (fileBlame) {
    projectFiles.forEach(file => {
      file.blameData.forEach(bData => {
        const committerEmail = bData.commit.committer_email
        const commiterName = bData.commit.committer_name
        const lines = bData.lines.length

        projectStats.linesOfCode = projectStats.linesOfCode + lines

        if (contributorStats[committerEmail]) {
          contributorStats[committerEmail].lines = contributorStats[committerEmail].lines + lines
        }
        else {
          contributorStats[committerEmail] = {
            lines: lines,
            addition: 0,
            deletions: 0,
            name: commiterName,
          }
        }
      })
    })
  }

  return { ...groupStats, commits: commits, commitsCount: commits.length, branches: branches, wikiPages: wikiPages, contributorStats: contributorStats, commitStats: commitStats, projectStats: projectStats }
}

export { createGroupGit, getGroupGit, addUserToGroupGit, getUserGit, getCourseUsersGit, addUsersToGroupGit, deleteGroupGit, getGroupsGit, getGroupsWithStudentsGit, removeUserInGroupGit, getGroupProjects, getGroupKeyStats }