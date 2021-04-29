import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { FormControlLabel, Grid, Switch, Typography } from "@material-ui/core"
import Navbar from "components/Navbar"
import StudentList from "components/List/GroupsStudentList"
import withAuth from "components/withAuth"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import fetcher from "utils/fetcher"
import { getGroupWithMembersGit } from "pages/api/courses/[term]/[courseId]/git/groups/[groupId]"
import DatePickerBar from "components/DatePickerBar"
import GroupStatsBoard from "components/Stats/GroupStats/GroupStatsBoard"
import GroupCompareStats from "components/Stats/GroupStats/GroupCompareStats"
import GroupStatsGraphs from "components/Stats/GroupStats/GroupStatsGraphs"


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
    `/api/courses/${term}/${courseId}/git/groups/${groupId}/getGroupKeyStats?since=${sinceTime.getFullYear()}.${sinceTime.getMonth()}.${sinceTime.getDate()}&until=${untilTime.getFullYear()}.${untilTime.getMonth()}.${untilTime.getDate() + 1}&groupPath=${courseGroupGit.full_path}&fileBlame=true`,
    {},
    "GET"
  )
  return { ...courseGroupsBB, groupKeyStats }
}

const getGroupsstats = async (term, courseId, sinceTime, untilTime) => {
  const groupsStats = await fetcher(
    `/api/courses/${term}/${courseId}/git/groups/stats?since=${sinceTime.getFullYear()}.${sinceTime.getMonth()}.${sinceTime.getDate()}&until=${untilTime.getFullYear()}.${untilTime.getMonth()}.${untilTime.getDate() + 1}&fileBlame=false`,
    {},
    "GET"
  )
  return groupsStats
}

export const Group = ({ courseGroupBB, courseGroupGit, bbGitConnection }) => {
  const router = useRouter()
  const { courseId, term, groupId } = router.query
  // 1 year back
  const [sinceTime, setSinceTime] = useState(new Date((new Date()).valueOf() - 31536000000))
  // 1 day forward
  const [untilTime, setUntilTime] = useState(new Date((new Date()).valueOf() + 86400000))
  const [courseGroup, setCourseGroups] = useState()
  const [compareGroupSwitch, setCompareGroupSwitch] = useState(false)
  const [expandAll, setExpandAll] = useState(false)
  const [groupsStats, setGroupsStats] = useState()
  const [loading, setLoading] = useState(true)
  const [loadingGroupsStats, setLoadingGroupsStats] = useState(true)

  const handleChangeGroupsStats = () => {
    setCompareGroupSwitch(!compareGroupSwitch)
  }

  const handleChangeExpandAll = () => {
    setExpandAll(!expandAll)
  }

  useEffect(() => {
    setLoadingGroupsStats(true)
    if (compareGroupSwitch) {
      getGroupsstats(term, courseId, sinceTime, untilTime).then(data => {
        setGroupsStats(data)
        setLoadingGroupsStats(false)
      })
    }
    else {
      setGroupsStats()
    }
  }, [compareGroupSwitch, courseId, term, sinceTime, untilTime])

  useEffect(() => {
    setLoading(true)
    mergeBBGitKeyStats(term, courseId, groupId, courseGroupBB, courseGroupGit, sinceTime, untilTime).then(data => {
      const mergedStats = mergeUsersAndStats(data, courseGroupGit)
      setCourseGroups(mergedStats)
      setLoading(false)
    })
  }, [courseGroupBB, courseGroupGit, courseId, groupId, sinceTime, term, untilTime])

  return (
    <>
      <Navbar pageTitle={`Information - ${courseGroupGit.name}` || "Group information"} courseId={courseId} term={term} />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{
          padding: "0 0 2rem 0",
        }}
      >
        <Grid item xs={10} md={10}>
          <Grid
            container
            direction="column"
          >
            <DatePickerBar
              sinceTime={sinceTime}
              untilTime={untilTime}
              setSinceTime={setSinceTime}
              setUntilTime={setUntilTime}
              leftComponent={
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
              }
              rightComponent={
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
              }
            />
            <GroupStatsBoard courseGroup={courseGroup} loading={loading}/>
            {compareGroupSwitch && <GroupCompareStats group={courseGroup} groupsStats={groupsStats} loading={loadingGroupsStats}/>}
            <GroupStatsGraphs group={courseGroup} loading={loading}/>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
              item
              xs={12}
              md={3}
              style={{
                padding: "0rem 0rem 1rem 0rem",
              }}
            >
              <Typography>
                  Members of this group
              </Typography>
            </Grid>
            <StudentList group={courseGroup} expandAll={expandAll} loading={loading}/>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export const getServerSideProps = (async (context) => {
  const params = context.params

  // TODO fix this:
  const courseGroupBB = {}//await getCourseGroup(context.req, params)
  courseGroupBB.members = []

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