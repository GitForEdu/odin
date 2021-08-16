import * as groups from "./data/groups.json"

const filterOnTime = (list, until, since) => {
  if (until && since) {
    const sinceTime = since.valueOf()
    const untilTime = until.valueOf()
    return list.filter(elem => {
      const date = new Date(elem.createdAt).valueOf()
      return date <= untilTime && date >= sinceTime
    })
  }
  else if (until) {
    const untilTime = until.valueOf()
    return list.filter(elem => {
      const date = new Date(elem.createdAt).valueOf()
      return date <= untilTime
    })
  }
  else if (since) {
    const sinceTime = since.valueOf()
    return list.filter(elem => {
      const date = new Date(elem.createdAt).valueOf()
      return date >= sinceTime
    })
  }
}

const getGroup = (fullPath) => {
  const group = groups.groups.find(e => e.full_path === fullPath)
  return group
}

const getProjects = (group, args) => {
  const projects = group.projects
  return { nodes: projects }
}

const getMergeRequests = (group) => {
  const mergeRequests = group.mergeRequests
  return { nodes: mergeRequests }
}

const getMilestones = (group) => {
  const milestones = group.milestones
  return { nodes: milestones }
}

const getMembers = (group) => {
  const members = group.members
  return { nodes: members }
}

const getIssues = (group, args) => {
  const createdAfter = args.createdAfter
  const createdBefore = args.createdBefore
  const issues = filterOnTime([...group.issues], createdBefore, createdAfter)
  return { nodes: issues }
}

const getAssignees = (issue) => {
  return { nodes: issue.assignees }
}

const resolvers = {
  Query: {
    group: (_, args) => {
      return getGroup(args.fullPath)
    },
  },
  Group: {
    issues: (group, args) => {
      return getIssues(group, args)
    },
    projects: (group, args) => {
      return getProjects(group, args)
    },
    mergeRequests: (group) => {
      return getMergeRequests(group)
    },
    milestones: (group) => {
      return getMilestones(group)
    },
    groupMembers: (group) => {
      return getMembers(group)
    },
  },
  Issue: {
    assignees: (issue) => {
      return getAssignees(issue)
    },
  },
}

export default resolvers