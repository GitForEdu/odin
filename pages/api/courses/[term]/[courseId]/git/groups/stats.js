import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/client"
import { getGroupKeyStats, getGroupsGit } from "utils/gitlab"
import isAuthorized from "middelwares/authorized"


const prisma = new PrismaClient()

export async function getGroupsStats(req, params) {

  const session = await getSession({ req })

  const userName = session.username
  const courseId = params.courseId
  const term = params.term
  const since = params.since
  const until = params.until
  const fileBlame = params.fileBlame
  const courseFull = `${courseId}-${term}`

  const connection = await prisma.bbGitConnection.findUnique({
    where: { courseId: courseFull },
  })
  if (connection) {
    const userConnection = await prisma.userGitConnection.findUnique({
      where: { userName_gitURL: { userName: userName, gitURL: connection.gitURL } },
    })
    if (userConnection) {
      const groups = (await getGroupsGit(connection.gitURL, connection.repoName, userConnection.pat)).subGroups
      const groupPaths = groups.map(group => group.full_path)

      const groupsStatsPromises = groupPaths.map(groupPath => {
        return getGroupKeyStats(connection.gitURL, userConnection.pat, groupPath, since, until, fileBlame)
      })

      const groupsStatsResponse = await Promise.all(groupsStatsPromises)

      let commits = 0
      let issues = 0
      let unassginedIssues = 0
      let issuesOpen = 0
      let issuesClosed = 0
      let mergeRequests = 0
      let mergeRequestsOpen = 0
      let mergeRequestsClosed = 0
      let additions = 0
      let deletions = 0
      let branches = 0
      let projects = 0
      let milestones = 0
      let lastActivity

      groupsStatsResponse.forEach(groupStats => {
        if (!lastActivity || lastActivity > groupStats.projectStats.lastActivity) {
          lastActivity = groupStats.projectStats.lastActivity
        }
        commits = commits + groupStats.commits.length
        issues = issues + groupStats.issues.length
        unassginedIssues = unassginedIssues + groupStats.issues.map(issue => issue.assignees.nodes.length).filter(assigneesCount => assigneesCount === 0).length
        issuesOpen = issuesOpen + groupStats.issuesOpen
        issuesClosed = issuesClosed + groupStats.issuesClosed
        mergeRequests = mergeRequests + groupStats.mergeRequests.length
        mergeRequestsOpen = mergeRequestsOpen + groupStats.mergeRequests.map(mr => mr.state === "opened").length
        mergeRequestsClosed = mergeRequestsClosed + groupStats.mergeRequests.map(mr => mr.state === "closed").length
        additions = additions + groupStats.projectStats.additions
        deletions = deletions + groupStats.projectStats.deletions
        branches = branches + groupStats.branches.length
        projects = projects + groupStats.projects.length
        milestones = milestones + groupStats.milestones.length
      })

      const numberOfGroups = groupsStatsResponse.length
      const averageCommits = commits / numberOfGroups
      const averageIssues = issues / numberOfGroups
      const averageUnassginedIssues = unassginedIssues / numberOfGroups
      const averageIssuesOpen = issuesOpen / numberOfGroups
      const averageIssuesClosed = issuesClosed / numberOfGroups
      const averageMergeRequests = mergeRequests / numberOfGroups
      const averageMergeRequestsOpen = mergeRequestsOpen / numberOfGroups
      const averageMergeRequestsClosed = mergeRequestsClosed / numberOfGroups
      const averageAdditions = additions / numberOfGroups
      const averageDeletions = deletions / numberOfGroups
      const averageBranches = branches / numberOfGroups
      const averageProjects = projects / numberOfGroups
      const averageMilestones = milestones / numberOfGroups

      return {
        averageCommits: averageCommits.toFixed(2),
        averageIssues: averageIssues.toFixed(2),
        averageUnassginedIssues: averageUnassginedIssues.toFixed(2),
        averageIssuesOpen: averageIssuesOpen.toFixed(2),
        averageIssuesClosed: averageIssuesClosed.toFixed(2),
        averageMergeRequests: averageMergeRequests.toFixed(2),
        averageMergeRequestsOpen: averageMergeRequestsOpen.toFixed(2),
        averageMergeRequestsClosed: averageMergeRequestsClosed.toFixed(2),
        averageAdditions: averageAdditions.toFixed(2),
        averageDeletions: averageDeletions.toFixed(2),
        averageBranches: averageBranches.toFixed(2),
        averageProjects: averageProjects.toFixed(2),
        averageMilestones: averageMilestones.toFixed(2),
        lastActivity: lastActivity,
      }
    }
  }

  return {}
}


async function groupsStats(req, res) {
  res.json(await getGroupsStats(req, req.query))
}

export default isAuthorized(groupsStats)