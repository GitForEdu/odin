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
import Highcharts from "highcharts"
import HighchartsExporting from "highcharts/modules/exporting"
import HighchartsReact from "highcharts-react-official"
import DarkUnica from "highcharts/themes/dark-unica"

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts)
  DarkUnica(Highcharts)
}

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

const optionsCommits = (contributorStats) => {

  const data = Object.entries(contributorStats).filter(([key, value]) => value.commits > 0).map(
    ([key, value]) => ({
      name: value.name,
      y: value.commits,
    })
  )
  return ({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: "Commits % member",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    exporting: {
      enabled: false,
    },
    series: [{
      name: "Commits",
      colorByPoint: true,
      data: data,
    }],
  })
}

const optionsMergeRequests = (contributorStats) => {

  const data = Object.entries(contributorStats).filter(([key, value]) => value.mergeRequests.length > 0).map(
    ([key, value]) => ({
      name: value.name,
      y: value.mergeRequests.length,
    })
  )
  return ({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: "MergeRequests % member",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    exporting: {
      enabled: false,
    },
    series: [{
      name: "MergeRequests",
      colorByPoint: true,
      data: data,
    }],
  })
}

const optionsIssues = (contributorStats) => {

  const data = Object.entries(contributorStats).filter(([key, value]) => value.issues.length > 0).map(
    ([key, value]) => ({
      name: value.name,
      y: value.issues.length,
    })
  )
  return ({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: "Issues assigned % member",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    exporting: {
      enabled: false,
    },
    series: [{
      name: "Issues",
      colorByPoint: true,
      data: data,
    }],
  })
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
    else {
      setGroupsStats()
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
        style={{
          padding: "0 0 2rem 0",
        }}
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
                direction="column"
                justifyContent="center"
                alignItems="flex-start"
                item
                xs={12}
                md={3}
                style={{
                  backgroundColor: "#424242",
                  padding: "1rem 0rem 1rem 0.5rem",
                }}
              >
                <Typography>
                  Stats for this group
                </Typography>
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{
                  margin: "0rem 0rem 1rem 0rem",
                  padding: "0rem 0rem 1rem 0rem",
                  backgroundColor: "#424242",
                }}
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
                  <Typography
                    style={{
                      padding: "0rem 0rem 0rem 2rem",
                    }}
                  >
                  Projects: {courseGroup.groupKeyStats.projects.length}
                  </Typography>
                  <Typography
                    style={{
                      padding: "0rem 0rem 0rem 2rem",
                    }}
                  >
                  Commits: {courseGroup.groupKeyStats.commits.length}
                  </Typography>
                  <Typography
                    style={{
                      padding: "0rem 0rem 0rem 2rem",
                    }}
                  >
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
                  <Typography
                    style={{
                      padding: "0rem 0rem 0rem 2rem",
                    }}
                  >
                  Issues: {courseGroup.groupKeyStats.issues.length}
                  </Typography>
                  <Typography
                    style={{
                      padding: "0rem 0rem 0rem 2rem",
                    }}
                  >
                  Issues open: {courseGroup.groupKeyStats.issues.filter(issue => issue.state === "opened").length}
                  </Typography>
                  <Typography
                    style={{
                      padding: "0rem 0rem 0rem 2rem",
                    }}
                  >
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
                  <Typography
                    style={{
                      padding: "0rem 0rem 0rem 2rem",
                    }}
                  >
                  Pull requests: {courseGroup.groupKeyStats.mergeRequests.length}
                  </Typography>
                  <Typography
                    style={{
                      padding: "0rem 0rem 0rem 2rem",
                    }}
                  >
                  Pull requests open: {courseGroup.groupKeyStats.mergeRequests.filter(mr => mr.state === "opened").length}
                  </Typography>
                  <Typography
                    style={{
                      padding: "0rem 0rem 0rem 2rem",
                    }}
                  >
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
                  <Typography
                    style={{
                      padding: "0rem 0rem 0rem 2rem",
                    }}
                  >
                  Last activity: {formatDate(courseGroup.groupKeyStats.projectStats.lastActivity)}
                  </Typography>
                  <Typography
                    style={{
                      padding: "0rem 0rem 0rem 2rem",
                    }}
                  >
                  Additions: {courseGroup.groupKeyStats.projectStats.additions}
                  </Typography>
                  <Typography
                    style={{
                      padding: "0rem 0rem 0rem 2rem",
                    }}
                  >
                  Deletions: {courseGroup.groupKeyStats.projectStats.deletions}
                  </Typography>
                </Grid>
              </Grid>
              {groupsStats
              && <>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  item
                  xs={12}
                  md={3}
                  style={{
                    backgroundColor: "#424242",
                    padding: "1rem 0rem 1rem 0.5rem",
                  }}
                >
                  <Typography>
                  Average stats for other groups
                  </Typography>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  style={{
                    margin: "0rem 0rem 1rem 0rem",
                    padding: "0rem 0rem 1rem 0rem",
                    backgroundColor: "#424242",
                  }}
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
                    <Typography
                      style={{
                        padding: "0rem 0rem 0rem 2rem",
                      }}
                    >
                  Projects: {groupsStats.averageProjects}
                    </Typography>
                    <Typography
                      style={{
                        padding: "0rem 0rem 0rem 2rem",
                      }}
                    >
                  Commits: {groupsStats.averageCommits}
                    </Typography>
                    <Typography
                      style={{
                        padding: "0rem 0rem 0rem 2rem",
                      }}
                    >
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
                    <Typography
                      style={{
                        padding: "0rem 0rem 0rem 2rem",
                      }}
                    >
                  Issues: {groupsStats.averageIssues}
                    </Typography>
                    <Typography
                      style={{
                        padding: "0rem 0rem 0rem 2rem",
                      }}
                    >
                  Issues open: {groupsStats.averageIssuesOpen}
                    </Typography>
                    <Typography
                      style={{
                        padding: "0rem 0rem 0rem 2rem",
                      }}
                    >
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
                    <Typography
                      style={{
                        padding: "0rem 0rem 0rem 2rem",
                      }}
                    >
                  Pull requests: {groupsStats.averageMergeRequests}
                    </Typography>
                    <Typography
                      style={{
                        padding: "0rem 0rem 0rem 2rem",
                      }}
                    >
                  Pull requests open: {groupsStats.averageMergeRequestsOpen}
                    </Typography>
                    <Typography
                      style={{
                        padding: "0rem 0rem 0rem 2rem",
                      }}
                    >
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
                    <Typography
                      style={{
                        padding: "0rem 0rem 0rem 2rem",
                      }}
                    >
                  Last activity: {formatDate(groupsStats.lastActivity)}
                    </Typography>
                    <Typography
                      style={{
                        padding: "0rem 0rem 0rem 2rem",
                      }}
                    >
                  Additions: {groupsStats.averageAdditions}
                    </Typography>
                    <Typography
                      style={{
                        padding: "0rem 0rem 0rem 2rem",
                      }}
                    >
                  Deletions: {groupsStats.averageDeletions}
                    </Typography>
                  </Grid>
                </Grid>
              </>
              }
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                item
                xs={12}
                md={3}
                style={{
                  padding: "0rem 0rem 1rem 0rem",
                }}
              >
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  item
                  xs={12}
                  md={3}
                  style={{
                    overflow: "hidden",
                  }}
                >
                  <HighchartsReact
                    highcharts={Highcharts}
                    containerProps={{ style: { width: "100%", height: "100%" } }}
                    options={optionsCommits(courseGroup.groupKeyStats.contributorStats)}
                  />
                </Grid>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  item
                  xs={12}
                  md={3}
                  style={{
                    overflow: "hidden",
                  }}
                >
                  <HighchartsReact
                    highcharts={Highcharts}
                    containerProps={{ style: { width: "100%", height: "100%" } }}
                    options={optionsMergeRequests(courseGroup.groupKeyStats.contributorStats)}
                  />
                </Grid>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  item
                  xs={12}
                  md={3}
                  style={{
                    overflow: "hidden",
                  }}
                >
                  <HighchartsReact
                    highcharts={Highcharts}
                    containerProps={{ style: { width: "100%", height: "100%" } }}
                    options={optionsIssues(courseGroup.groupKeyStats.contributorStats)}
                  />
                </Grid>
              </Grid>
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
              <StudentList elements={courseGroup.members} expandAll={expandAll} groupStats={courseGroup.groupKeyStats} />
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