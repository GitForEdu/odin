// Helpers
import { cachedFetch } from "utils/cache"

const mergeContributorDicts = (dictEmail, dictUserName) => {
  const arrayEmail = Object.values(dictEmail)
  const arrayUserName = Object.values(dictUserName)
  const contributorStats = {}

  arrayEmail.forEach(user => {
    const userNameIndex = arrayUserName.findIndex(userUserName => userUserName.name === user.name)
    if (userNameIndex >= 0) {
      const userNameStats = arrayUserName[userNameIndex]
      contributorStats[userNameStats.userName] = {
        userName: userNameStats.userName,
        name: user.name,
        commits: user.commits,
        lines: user.lines,
        additions: user.additions,
        deletions: user.deletions,
        mergeRequests: userNameStats.mergeRequests,
        issues: userNameStats.issues,
      }
      arrayUserName.splice(userNameIndex, 1)
    }
    else {
      contributorStats[user.name] = {
        userName: undefined,
        name: user.name,
        commits: user.commits,
        lines: user.lines,
        additions: user.additions,
        deletions: user.deletions,
        mergeRequests: [],
        issues: [],
      }
    }
  })

  arrayUserName.forEach(user => {
    contributorStats[user.userName] = {
      userName: user.userName,
      name: user.name,
      commits: 0,
      lines: 0,
      additions:0,
      deletions: 0,
      mergeRequests: user.mergeRequests,
      issues: user.issues,
    }
  })

  return contributorStats
}

// Stats

const getGroupProjects = async (path, courseNameGit, groupId, pat) => {
  const projects = await cachedFetch(`${path}/api/v4/groups/${courseNameGit}/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => r.json)
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
  const response = await cachedFetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  })

  let commits = await response.json

  if (/<([^>]+)>; rel="next"/g.test(response.headers.get("link"))) {
    page = new URL(/<([^>]+)>; rel="next"/g.exec(response.headers.get("link"))[1]).searchParams.get("page")
    commits = commits.concat(await getProjectCommits(path, projectId, pat, since, until, page))
  }

  // remove mergeCommits
  return commits.filter(commit => commit.parent_ids.length < 2)
}

const getProjectBranches = async (path, projectId, pat) => {
  let fetchUrl = `${path}/api/v4/projects/${projectId}/repository/branches`
  const branches = await cachedFetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => {
    return r.json
  })

  return branches
}

const getProjectWikiPages = async (path, projectId, pat) => {
  let fetchUrl = `${path}/api/v4/projects/${projectId}/wikis`
  const wikiPages = await cachedFetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => {
    return r.json
  })

  return wikiPages
}

const getProjectFiles = async (path, projectId, pat, fileBlame, page) => {
  let fetchUrl = `${path}/api/v4/projects/${projectId}/repository/tree?recursive=true&per_page=100&page=${page}`
  const response = await cachedFetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  })

  let files = await response.json

  if (/<([^>]+)>; rel="next"/g.test(response.headers.get("link"))) {
    page = new URL(/<([^>]+)>; rel="next"/g.exec(response.headers.get("link"))[1]).searchParams.get("page")
    files = files.concat(await getProjectFiles(path, projectId, pat, fileBlame, page))
  }

  files = files.filter(file => file.type === "blob")
  if (fileBlame === "true") {
    files = Promise.all(files.map(file => {
      return getFileBlameData(path, pat, projectId, file.path).then(r => {
        return { ...file, blameData: r }
      })
    }))
  }

  return files
}

const getFileBlameData = async (path, pat, projectId, pathToFile ) => {
  let fetchUrl = `${path}/api/v4/projects/${projectId}/repository/files/${encodeURIComponent(pathToFile)}/blame?ref=master`
  const fileBlame = await cachedFetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
  }).then(r => {
    return r.json
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
              name
            }
          }
        }
      }
      mergeRequests {
        nodes {
          createdAt
          state
          commitCount
          author {
            username
            publicEmail
            name
          }
        }
        totalTimeToMerge
      }
      milestones {
        nodes {
          createdAt
          state
        }
      }
      groupMembers {
        nodes {
          id
        }
      }
    }
  }
  `

  const groupStats = await cachedFetch(`${path}/api/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "PRIVATE-TOKEN": pat,
    },
    body: JSON.stringify({ query }),
  }).then(r => r.json).then(d => {
    const groupInfo = d.data.group

    const projects = groupInfo.projects.nodes
    let milestones = groupInfo.milestones.nodes
    let mergeRequests = groupInfo.mergeRequests.nodes
    if (until && since) {
      const sinceTime = since.valueOf()
      const untilTime = until.valueOf()
      milestones = groupInfo.milestones.nodes.filter(milestone => {
        const date = new Date(milestone.createdAt).valueOf()
        return date <= untilTime && date >= sinceTime
      })
      mergeRequests = groupInfo.mergeRequests.nodes.filter(mergeRequest => {
        const date = new Date(mergeRequest.createdAt.valueOf())
        return date <= untilTime && date >= sinceTime

      })
    }
    else if (until) {
      const untilTime = until.valueOf()
      milestones = groupInfo.milestones.nodes.filter(milestone => {
        const date = new Date(milestone.createdAt).valueOf()
        return date <= untilTime
      })
      mergeRequests = groupInfo.mergeRequests.nodes.filter(mergeRequest => {
        const date = new Date(mergeRequest.createdAt.valueOf())
        return date <= untilTime

      })
    }
    else if (since) {
      const sinceTime = since.valueOf()
      milestones = groupInfo.milestones.nodes.filter(milestone => {
        const date = new Date(milestone.createdAt).valueOf()
        return date >= sinceTime
      })
      mergeRequests = groupInfo.mergeRequests.nodes.filter(mergeRequest => {
        const date = new Date(mergeRequest.createdAt.valueOf())
        return date >= sinceTime

      })
    }
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

    return { name: groupInfo.name, issues: issues, issuesCount: issuesCount, issuesOpen: issuesOpen, issuesClosed, projects: projects, milestones: milestones, totalWikiSize: totalWikiSize, mergeRequests: mergeRequests, members: groupInfo.groupMembers.nodes }
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

  const contributorStatsEmail = {}

  const contributorStatsUserName = {}

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

  groupStats.mergeRequests.forEach(mergeRequest => {
    const commiterUsername = mergeRequest.author.username
    const commiterName = mergeRequest.author.name

    if (contributorStatsUserName[commiterUsername]) {
      contributorStatsUserName[commiterUsername].mergeRequests = [...contributorStatsUserName[commiterUsername].mergeRequests, mergeRequest]
    }
    else {
      contributorStatsUserName[commiterUsername] = {
        name: commiterName,
        userName: commiterUsername,
        mergeRequests: [mergeRequest],
        issues: [],
      }
    }
  })

  groupStats.issues.forEach(issue => {
    issue.assignees.nodes.forEach(assigne => {
      const assigneUsername = assigne.username
      const assigneName = assigne.name

      if (contributorStatsUserName[assigneUsername]) {
        const tmpArray = contributorStatsUserName[assigneUsername].issues
        tmpArray.push({ createdAt: issue.createdAt, state: issue.state })
        contributorStatsUserName[assigneUsername].issues = tmpArray
      }
      else {
        contributorStatsUserName[assigneUsername] = {
          name: assigneName,
          userName: assigneUsername,
          issues: [{ createdAt: issue.createdAt, state: issue.state }],
          mergeRequests: [],
        }
      }
    })
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

    if (contributorStatsEmail[committerEmail]) {
      contributorStatsEmail[committerEmail].additions = contributorStatsEmail[committerEmail].additions + additions
      contributorStatsEmail[committerEmail].deletions = contributorStatsEmail[committerEmail].deletions + deletions
      contributorStatsEmail[committerEmail].commits = contributorStatsEmail[committerEmail].commits + 1
    }
    else {
      contributorStatsEmail[committerEmail] = {
        name: commiterName,
        userName: committerEmail.split("@")[0],
        commits: 1,
        lines: 0,
        additions: additions,
        deletions: deletions,
        mergeRequests: [],
      }
    }
  })

  if (fileBlame === "true") {
    projectFiles.forEach(file => {
      file.blameData.forEach(bData => {
        const committerEmail = bData.commit.committer_email
        const commiterName = bData.commit.committer_name
        const lines = bData.lines.length

        projectStats.linesOfCode = projectStats.linesOfCode + lines

        if (contributorStatsEmail[committerEmail]) {
          contributorStatsEmail[committerEmail].lines = contributorStatsEmail[committerEmail].lines + lines
        }
        else {
          contributorStatsEmail[committerEmail] = {
            name: commiterName,
            userName: committerEmail.split("@")[0],
            commits: 0,
            lines: lines,
            additions: 0,
            deletions: 0,
            mergeRequests: [],
          }
        }
      })
    })
  }

  const contributorStats = mergeContributorDicts(contributorStatsEmail, contributorStatsUserName)

  return { ...groupStats, commits: commits, commitsCount: commits.length, branches: branches, wikiPages: wikiPages, contributorStats: contributorStats, commitStats: commitStats, projectStats: projectStats }
}

export {
  getGroupProjects,
  getGroupKeyStats
}