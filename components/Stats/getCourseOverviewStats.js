import fetcher from "utils/fetcher"


const calcultateGitStats = async (term, courseId, courseGroupsBB, courseGroupsGit, sinceTime, untilTime) => {
  console.log(term, courseId, courseGroupsBB, courseGroupsGit, sinceTime, untilTime)
  const stats = await fetcher(
    `/api/courses/${term}/${courseId}/git/groups/stats?since=${sinceTime.getFullYear()}.${sinceTime.getMonth()}.${sinceTime.getDate()}&until=${untilTime.getFullYear()}.${untilTime.getMonth()}.${untilTime.getDate() + 1}&fileBlame=false`,
    {},
    "GET"
  )

  let membersBB = 0

  courseGroupsBB.forEach(groupBB => {
    membersBB = membersBB + groupBB.members.length
  })
  const averageMembersBB = membersBB / courseGroupsBB.length

  let commits = 0
  let issues = []
  let mergeRequests = []
  let additions = 0
  let deletions = 0
  let branches = 0
  let projects = 0
  let membersGit = 0
  let groupMostCommitsCount = null
  let groupMostCommits = ""
  let groupFewestCommits = ""
  let groupFewestCommitsCount = null
  let groupMostIssuesCount = null
  let groupMostIssues = ""
  let groupFewestIssues = ""
  let groupFewestIssuesCount = null

  stats.groupsStats.forEach(groupStats => {
    commits = commits + groupStats.commits.length
    issues = [...issues, ...groupStats.issues]
    mergeRequests = [...mergeRequests, ...groupStats.mergeRequests]
    additions = additions + groupStats.projectStats.additions
    deletions = deletions + groupStats.projectStats.deletions
    branches = branches + groupStats.branches.length
    projects = projects + groupStats.projects.length
    membersGit = membersGit + groupStats.members.length

    if ((groupStats.commits.length > groupMostCommitsCount) || (groupStats.commits.length && !groupFewestCommitsCount)) {
      groupMostCommitsCount = groupStats.commits.length
      groupMostCommits = groupStats.name
    }
    if ((groupStats.commits.length < groupFewestCommitsCount) || (groupStats.commits.length && !groupFewestCommitsCount)) {
      groupFewestCommitsCount = groupStats.commits.length
      groupFewestCommits = groupStats.name
    }
    if ((groupStats.issues.length > groupMostIssuesCount) || (groupStats.issues.length && !groupFewestIssuesCount)) {
      groupMostIssuesCount = groupStats.issues.length
      groupMostIssues = groupStats.name
    }
    if ((groupStats.issues.length < groupFewestIssuesCount) || (groupStats.issues.length && !groupFewestIssuesCount)) {
      groupFewestIssuesCount = groupStats.issues.length
      groupFewestIssues = groupStats.name
    }
  })

  const groups = stats.groupsStats.length
  const averageCommits = commits / groups
  const averageIssues = issues.length / groups
  const averageMergeRequests = mergeRequests.length / groups
  const averageAdditions = additions / groups
  const averageDeletions = deletions / groups
  const averageBranches = branches / groups
  const averageProjects = projects / groups
  const averageMembersGit = membersGit / groups
  const averageOpenIssues = issues.filter(issue => issue.state === "opened").length / groups
  const averageOpenMergeRequests = mergeRequests.filter(mergeRequests => mergeRequests.state === "opened").length / groups

  return {
    commits: commits,
    averageCommits: averageCommits,
    issues: issues,
    averageIssues: averageIssues.toFixed(2),
    mergeRequests: mergeRequests,
    averageMergeRequests: averageMergeRequests.toFixed(2),
    additions: additions,
    averageAdditions: averageAdditions.toFixed(2),
    deletions: deletions,
    averageDeletions: averageDeletions.toFixed(2),
    branches: branches,
    averageBranches: averageBranches.toFixed(2),
    projects: projects,
    averageProjects: averageProjects.toFixed(2),
    averageMembersBB: averageMembersBB.toFixed(2),
    averageMembersGit: averageMembersGit.toFixed(2),
    groupFewestCommits: groupFewestCommits,
    groupFewestCommitsCount: groupFewestCommitsCount,
    groupMostCommits: groupMostCommits,
    groupMostCommitsCount: groupMostCommitsCount,
    groupFewestIssues: groupFewestIssues,
    groupFewestIssuesCount: groupFewestIssuesCount,
    groupMostIssues: groupMostIssues,
    groupMostIssuesCount: groupMostIssuesCount,
    averageOpenIssues: averageOpenIssues.toFixed(2),
    averageOpenMergeRequests: averageOpenMergeRequests.toFixed(2),
    groups: stats.groupsStats,
  }
}

export default calcultateGitStats