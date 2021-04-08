import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Button, FormControlLabel, Grid, Switch, TextField, Typography, useMediaQuery } from "@material-ui/core"
import Link from "next/link"
import DatePicker from "@material-ui/lab/DatePicker"

import Navbar from "components/Navbar"
import StudentList from "components/List/GroupsStudentList"
import withAuth from "components/withAuth"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import { getCourseGroup } from "pages/api/courses/[term]/[courseId]/blackboard/groups/[groupId]"
import fetcher from "utils/fetcher"
import { getGroupWithMembersGit } from "pages/api/courses/[term]/[courseId]/git/groups/[groupId]"
import { formatDate } from "utils/format"

const getButtonStyle = bigScreen => {
  const baseStyle = {
    width: "90%",
  }
  if (bigScreen) {
    return ({
      ...baseStyle,
    })
  }
  else {
    return ({
      ...baseStyle,
      width: "30%",
    })
  }
}

const mergeUsersAndStats = (group, courseGroupGit) => {
  const membersBB = group.members
  const membersGit = courseGroupGit.members
  const contributorsStats = Object.values(group.groupKeyStats.contributorStats)

  const mergedMembers = []

  membersBB.forEach(member => {
    const memberGitIndex = membersGit.findIndex(memberGit => memberGit.userName === member.userName)
    if (memberGitIndex >= 0) {
      mergedMembers.push(member)
      membersGit.splice(memberGitIndex, 1)
    }
    else {
      mergedMembers.push(member)
    }
  })

  membersGit.forEach(member => {
    mergedMembers.push(member)
  })

  mergedMembers.forEach(member => {
    const memberIndex = contributorsStats.findIndex(contributorStats => contributorStats.userName === member.userName)
    if (memberIndex >= 0) {
      const stats = contributorsStats[memberIndex]
      const memberMergedIndex = mergedMembers.findIndex(mergedMember => mergedMember.userName === member.userName)
      mergedMembers[memberMergedIndex] = {
        ...stats,
        ...member,
      }
      contributorsStats.splice(memberIndex, 1)
    }
  })

  contributorsStats.forEach(member => {
    const name = member.name.split(" ")
    mergedMembers.push({
      userName: member.userName,
      name: {
        given: name[0],
        family: name[name.length - 1],
      },
      commits: member.commits,
      lines: member.lines,
      additions: member.additions,
      deletions: member.deletions,
      mergeRequests: member.mergeRequests,
    })
  })

  group.members = mergedMembers

  return group
}

const mergeBBGitKeyStats = async (term, courseId, groupId, courseGroupsBB, courseGroupGit, sinceTime, untilTime) => {
  const groupKeyStats = await fetcher(
    `/api/courses/${term}/${courseId}/git/groups/${groupId}/getGroupKeyStats?since=${sinceTime.toISOString()}&until=${untilTime.toISOString()}&groupPath=${courseGroupGit.full_path}&fileblame=true`,
    {},
    "GET"
  )
  return { ...courseGroupsBB, groupKeyStats }
}

const getGroupsstats = async (term, courseId, sinceTime, untilTime) => {
  const groupsStats = await fetcher(
    `/api/courses/${term}/${courseId}/git/groups/stats?since=${sinceTime.toISOString()}&until=${untilTime.toISOString()}&fileblame=true`,
    {},
    "GET"
  )
  return groupsStats
}

export const Group = ({ courseGroupBB, courseGroupGit, bbGitConnection }) => {
  const matches = useMediaQuery("(max-width:400px)")
  const router = useRouter()
  const { courseId, term, groupId } = router.query
  const [sinceTime, setSinceTime] = useState(new Date("2020-01-01T00:00:00.000Z"))
  const [untilTime, setUntilTime] = useState(new Date((new Date()).valueOf() + 86400000))
  const [courseGroup, setCourseGroups] = useState()
  const [compareGroupSwitch, setCompareGroupSwitch] = useState(false)
  const [expandAll, setExpandAll] = useState(false)
  const [groupsStats, setGroupsStats] = useState()

  const handleChangeGroupsStats = () => {
    setCompareGroupSwitch(!compareGroupSwitch)
  }

  const handleChangeExpandAll = () => {
    setExpandAll(!expandAll)
  }

  useEffect(() => {
    if (compareGroupSwitch) {
      getGroupsstats(term, courseId, sinceTime, untilTime).then(data => {
        setGroupsStats(data)
      })
    }
  }, [compareGroupSwitch, courseId, term, sinceTime, untilTime])

  useEffect(() => {
    mergeBBGitKeyStats(term, courseId, groupId, courseGroupBB, courseGroupGit, sinceTime, untilTime).then(data => {
      setCourseGroups(mergeUsersAndStats(data, courseGroupGit))
    })
  }, [courseGroupBB, courseGroupGit, courseId, groupId, sinceTime, term, untilTime])

  return (
    <>
      <Navbar pageTitle={`Information - ${courseGroupBB.name}` || "Group information"} courseId={courseId} term={term} />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={10} md={10}>
          <Grid
            container
            direction="column"
          >
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignContent="center"
              item
            >
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignContent="center"
                item
              >
                <Grid
                  item
                  xs={6}
                  md={3}
                >
                  <DatePicker
                    renderInput={(props) =>
                      <TextField
                        {...props}
                        margin="normal"
                        helperText=""
                      />}
                    label="DatePicker"
                    value={sinceTime}
                    onChange={(newValue) => {
                      setSinceTime(newValue)
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  md={3}
                >
                  <DatePicker
                    renderInput={(props) =>
                      <TextField
                        {...props}
                        margin="normal"
                        helperText=""
                      />}
                    label="DatePicker"
                    value={untilTime}
                    onChange={(newValue) => {
                      setUntilTime(newValue)
                    }}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignContent="center"
                item
              >
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignContent="center"
                  item
                  xs={12}
                  md={3}
                >
                  <FormControlLabel
                    labelPlacement="start"
                    control={
                      <Switch
                        checked={expandAll}
                        onChange={handleChangeExpandAll}
                        name="switchExpandMembers"
                        color="primary"
                      />
                    }
                    label="Expand all members"
                  />
                </Grid>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignContent="center"
                  item
                  xs={12}
                  md={6}
                >
                  <Grid
                    item
                    xs={3}
                    md={4}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        const date = new Date()
                        date.setDate(date.getDate()-1)
                        setSinceTime(date)
                        const dateUntil = new Date()
                        setUntilTime(dateUntil)
                      }}
                    >
                Last day
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    md={4}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        const date = new Date()
                        date.setDate(date.getDate()-7)
                        setSinceTime(date)
                        const dateUntil = new Date()
                        setUntilTime(dateUntil)
                      }}
                    >
                Last week
                    </Button>

                  </Grid>
                  <Grid
                    item
                    xs={3}
                    md={4}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        const date = new Date()
                        date.setMonth(date.getMonth()-1)
                        setSinceTime(date)
                        const dateUntil = new Date()
                        setUntilTime(dateUntil)
                      }}
                    >
                Last month
                    </Button>
                  </Grid>

                </Grid>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignContent="center"
                  item
                  xs={12}
                  md={3}
                >
                  <FormControlLabel
                    labelPlacement="start"
                    control={
                      <Switch
                        checked={compareGroupSwitch}
                        onChange={handleChangeGroupsStats}
                        name="switchCompareGroups"
                        color="primary"
                      />
                    }
                    label="Compare to groups"
                  />
                </Grid>
              </Grid>
            </Grid>
            {courseGroup !== undefined
            && <>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{
                  padding: "2rem",
                }}
                spacing={2}
              >
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  item
                  xs={12}
                  md={3}
                >
                  <Typography>
                  Projects: {courseGroup.groupKeyStats.projects.length}
                  </Typography>
                  <Typography>
                  Commits: {courseGroup.groupKeyStats.commits.length}
                  </Typography>
                  <Typography>
                  Branches: {courseGroup.groupKeyStats.branches.length}
                  </Typography>
                </Grid>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  item
                  xs={12}
                  md={3}
                >
                  <Typography>
                  Issues: {courseGroup.groupKeyStats.issues.length}
                  </Typography>
                  <Typography>
                  Issues open: {courseGroup.groupKeyStats.issues.filter(issue => issue.state === "opened").length}
                  </Typography>
                  <Typography>
                  Issues closed: {courseGroup.groupKeyStats.issues.filter(issue => issue.state === "closed").length}
                  </Typography>
                </Grid>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  item
                  xs={12}
                  md={3}
                >
                  <Typography>
                  Pull requests: {courseGroup.groupKeyStats.mergeRequests.length}
                  </Typography>
                  <Typography>
                  Pull requests open: {courseGroup.groupKeyStats.mergeRequests.filter(mr => mr.state === "opened").length}
                  </Typography>
                  <Typography>
                  Pull requests closed: {courseGroup.groupKeyStats.mergeRequests.filter(mr => mr.state === "closed").length}
                  </Typography>
                </Grid>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  item
                  xs={12}
                  md={3}
                >
                  <Typography>
                  Last activity: {formatDate(courseGroup.groupKeyStats.projectStats.lastActivity)}
                  </Typography>
                  <Typography>
                  Additions: {courseGroup.groupKeyStats.projectStats.additions}
                  </Typography>
                  <Typography>
                  Deletions: {courseGroup.groupKeyStats.projectStats.deletions}
                  </Typography>
                </Grid>
              </Grid>
              {groupsStats
              && <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{
                  padding: "2rem",
                }}
                spacing={2}
              >
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  item
                  xs={12}
                  md={3}
                >
                  <Typography>
                  Projects: {groupsStats.averageProjects}
                  </Typography>
                  <Typography>
                  Commits: {groupsStats.averageCommits}
                  </Typography>
                  <Typography>
                  Branches: {groupsStats.averageBranches}
                  </Typography>
                </Grid>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  item
                  xs={12}
                  md={3}
                >
                  <Typography>
                  Issues: {groupsStats.averageIssues}
                  </Typography>
                  <Typography>
                  Issues open: {groupsStats.averageIssuesOpen}
                  </Typography>
                  <Typography>
                  Issues closed: {groupsStats.averageIssuesClosed}
                  </Typography>
                </Grid>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  item
                  xs={12}
                  md={3}
                >
                  <Typography>
                  Pull requests: {groupsStats.averageMergeRequests}
                  </Typography>
                  <Typography>
                  Pull requests open: {groupsStats.averageMergeRequestsOpen}
                  </Typography>
                  <Typography>
                  Pull requests closed: {groupsStats.averageMergeRequestsClosed}
                  </Typography>
                </Grid>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  item
                  xs={12}
                  md={3}
                >
                  <Typography>
                  Last activity: {formatDate(groupsStats.lastActivity)}
                  </Typography>
                  <Typography>
                  Additions: {groupsStats.averageAdditions}
                  </Typography>
                  <Typography>
                  Deletions: {groupsStats.averageDeletions}
                  </Typography>
                </Grid>
              </Grid>}
              <StudentList elements={courseGroup.members} expandAll={expandAll} />
            </>}
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export const getServerSideProps = (async (context) => {
  const params = context.params

  const courseGroupBB = await getCourseGroup(context.req, params)

  const courseGroupGit = await getGroupWithMembersGit(context.req, params)

  const bbGitConnection = await getBBGitConnection(context.req, params)

  if (!courseGroupBB || !bbGitConnection) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: { courseGroupBB, courseGroupGit, bbGitConnection },
  }
})

export default withAuth(Group)