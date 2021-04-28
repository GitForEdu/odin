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
import HighchartsStreamGraph from "highcharts/modules/streamgraph"
import HighchartsSolidGauge from "highcharts/modules/solid-gauge"
import HighchartsMore from "highcharts/highcharts-more.js"
import DatePickerBar from "components/DatePickerBar"


if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts)
  DarkUnica(Highcharts)
  HighchartsStreamGraph(Highcharts)
  HighchartsMore(Highcharts)
  HighchartsSolidGauge(Highcharts)
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

const optionsLines = (contributorStats) => {

  const data = Object.entries(contributorStats).filter(([key, value]) => value.lines > 0).map(
    ([key, value]) => ({
      name: value.name,
      y: value.lines,
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
      text: "Lines % member",
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
      name: "Lines",
      colorByPoint: true,
      data: data,
    }],
  })
}

const getDateFound = (stats) => {
  const dateFound = {}

  const contributors = {}

  const contributorList = Object.keys(stats.contributorStats).map((k) => stats.contributorStats[k])

  contributorList.forEach(contributor => {
    contributors[contributor.name] = 0
  })

  const commits = stats.commits.sort(function(a, b){
    return new Date(a.created_at) - new Date(b.created_at)
  })

  commits.forEach(commit => {
    const date = new Date(commit.created_at)
    const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    if (dateFound[dateKey]) {
      contributors[commit.author_name] = contributors[commit.author_name] + 1
      dateFound[dateKey][commit.author_name] = contributors[commit.author_name]
    }
    else {
      const tmpObject = {}
      contributors[commit.author_name] = contributors[commit.author_name] + 1
      contributorList.forEach(contributor => {
        tmpObject[contributor.name] = contributors[contributor.name]
      })
      console.log(tmpObject)
      dateFound[dateKey] = tmpObject
    }
  })

  return dateFound
}

const getSeries = (dateFound) => {
  const seriesTmp = {}

  const dateFoundInCommitsList = Object.keys(dateFound).map((k) => dateFound[k])

  dateFoundInCommitsList.forEach(date => {
    const personsInDateList = Object.keys(date).map((j) => j)
    personsInDateList.forEach(person => {
      if(!seriesTmp[person]) {
        seriesTmp[person] = {
          name: person,
          data: [date[person]],
        }
      }
      else {
        seriesTmp[person].data = [...seriesTmp[person].data, date[person]]
      }
    })
  })

  return Object.keys(seriesTmp).map((k) => seriesTmp[k])
}

const getCategories = (dateFound) => {
  return Object.keys(dateFound).map((date) => date)
}

const optionsCommitsArea = (series, categories) => {
  return (
    {
      chart: {
        type: "area",
      },
      title: {
        text: "Commits %",
      },
      xAxis: {
        categories: categories,
        tickmarkPlacement: "on",
        title: {
          enabled: false,
        },
      },
      yAxis: {
        labels: {
          format: "{value}%",
        },
        title: {
          enabled: false,
        },
      },
      tooltip: {
        pointFormat: "<span style=\"color:{series.color}\">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f})<br/>",
        split: true,
      },
      plotOptions: {
        area: {
          stacking: "percent",
          lineColor: "#ffffff",
          lineWidth: 1,
          marker: {
            lineWidth: 1,
            lineColor: "#ffffff",
          },
          accessibility: {
            pointDescriptionFormatter: function (point) {
              function round(x) {
                return Math.round(x * 100) / 100
              }
              return (point.index + 1) + ", " + point.category + ", "
                          + point.y + round(point.percentage) + "%, "
                          + point.series.name
            },
          },
        },
      },
      exporting: {
        enabled: false,
      },
      series: series,
    }
  )
}

const optionsStreamGraph = (series, categories) => {
  var colors = Highcharts.getOptions().colors

  return (
    {

      chart: {
        type: "streamgraph",
        marginBottom: 30,
        zoomType: "x",
      },

      // Make sure connected countries have similar colors
      colors: [
        colors[0],
        colors[1],
        colors[2],
        colors[3],
        colors[4],
        // East Germany, West Germany and Germany
        Highcharts.color(colors[5]).brighten(0.2).get(),
        Highcharts.color(colors[5]).brighten(0.1).get(),

        colors[5],
        colors[6],
        colors[7],
        colors[8],
        colors[9],
        colors[0],
        colors[1],
        colors[3],
        // Soviet Union, Russia
        Highcharts.color(colors[2]).brighten(-0.1).get(),
        Highcharts.color(colors[2]).brighten(-0.2).get(),
        Highcharts.color(colors[2]).brighten(-0.3).get(),
      ],

      title: {
        floating: true,
        align: "left",
        text: "Commit contribution",
      },

      xAxis: {
        maxPadding: 0,
        type: "category",
        crosshair: true,
        categories: categories,
        labels: {
          align: "left",
          reserveSpace: false,
          rotation: 270,
        },
        lineWidth: 0,
        margin: 20,
        tickWidth: 0,
      },

      yAxis: {
        visible: false,
        startOnTick: false,
        endOnTick: false,
      },

      legend: {
        enabled: false,
      },

      plotOptions: {
        series: {
          label: {
            minFontSize: 5,
            maxFontSize: 15,
            style: {
              color: "rgba(255,255,255,0.75)",
            },
          },
        },
      },

      // Data parsed with olympic-medals.node.js
      series: series,

      exporting: {
        enabled: false,
      },
    })
}

const optionsGaugeCommits = (stats, allGroupStats) => {
  const numberOfCommits = stats.commits.length
  const average = allGroupStats.averageCommits
  const max = allGroupStats.groupMostCommitsCount
  return (
    {
      chart: {
        type: "solidgauge",
      },

      title: {
        text: "Commits compared to group average commits",
      },

      pane: {
        center: ["50%", "85%"],
        size: "100%",
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor:
                  Highcharts.defaultOptions.legend.backgroundColor || "#EEE",
          innerRadius: "60%",
          outerRadius: "100%",
          shape: "arc",
        },
      },

      exporting: {
        enabled: false,
      },

      tooltip: {
        enabled: false,
      },

      // the value axis
      yAxis: {
        min: 0,
        max: max,
        stops: [
          [0.1, "#DF5353"], // green
          [average/max, "#DDDF0D"], // yellow
          [0.9, "#55BF3B"], // red
        ],
        lineWidth: 1,
        minorTickInterval: null,
        tickAmount: 2,
        labels: {
          y: 16,
        },
        tickPositions: [0, average, max],
        tickWidth: 3,
        tickLength: 100,
        tickColor: "#FFFFFF",
      },

      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true,
          },
        },
      },
      credits: {
        enabled: false,
      },
      series: [{
        name: "Commits",
        data: [numberOfCommits],
        dataLabels: {
          format:
                "<div style=\"text-align:center\">"
                + "<span style=\"font-size:25px\">{y}</span><br/>"
                + "<span style=\"font-size:12px;opacity:0.4\">commit in this group</span>"
                + "</div>",
        },
      }],
    }
  )
}

const optionsGaugeIssues = (stats, allGroupStats) => {
  const numberOfIssues = stats.issues.length
  const average = allGroupStats.averageIssues
  const max = allGroupStats.groupMostIssuesCount
  return (
    {
      chart: {
        type: "solidgauge",
      },

      title: {
        text: "Issues compared to group average issues",
      },

      pane: {
        center: ["50%", "85%"],
        size: "100%",
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor:
                  Highcharts.defaultOptions.legend.backgroundColor || "#EEE",
          innerRadius: "60%",
          outerRadius: "100%",
          shape: "arc",
        },
      },

      exporting: {
        enabled: false,
      },

      tooltip: {
        enabled: false,
      },

      // the value axis
      yAxis: {
        min: 0,
        max: max,
        stops: [
          [0.1, "#DF5353"], // green
          [average/max, "#DDDF0D"], // yellow
          [0.9, "#55BF3B"], // red
        ],
        lineWidth: 1,
        minorTickInterval: null,
        tickAmount: 2,
        labels: {
          y: 16,
        },
        tickPositions: [0, average, max],
        tickWidth: 3,
        tickLength: 100,
        tickColor: "#FFFFFF",
      },

      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true,
          },
        },
      },
      credits: {
        enabled: false,
      },
      series: [{
        name: "Issues",
        data: [numberOfIssues],
        dataLabels: {
          format:
                "<div style=\"text-align:center\">"
                + "<span style=\"font-size:25px\">{y}</span><br/>"
                + "<span style=\"font-size:12px;opacity:0.4\">issues in this group</span>"
                + "</div>",
        },
      }],
    }
  )
}

const optionsGaugeMergeRequests = (stats, allGroupStats) => {
  const numberOfMergeRequests = stats.mergeRequests.length
  const average = allGroupStats.averageMergeRequests
  const max = allGroupStats.groupMostMergeRequestsCount
  return (
    {
      chart: {
        type: "solidgauge",
      },

      title: {
        text: "MR's compared to group average MR's",
      },

      pane: {
        center: ["50%", "85%"],
        size: "100%",
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor:
                  Highcharts.defaultOptions.legend.backgroundColor || "#EEE",
          innerRadius: "60%",
          outerRadius: "100%",
          shape: "arc",
        },
      },

      exporting: {
        enabled: false,
      },

      tooltip: {
        enabled: false,
      },

      // the value axis
      yAxis: {
        min: 0,
        max: max,
        stops: [
          [0.1, "#DF5353"], // green
          [average/max, "#DDDF0D"], // yellow
          [0.9, "#55BF3B"], // red
        ],
        lineWidth: 1,
        minorTickInterval: null,
        tickAmount: 2,
        labels: {
          y: 16,
        },
        tickPositions: [0, average, max],
        tickWidth: 3,
        tickLength: 100,
        tickColor: "#FFFFFF",
      },

      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true,
          },
        },
      },
      credits: {
        enabled: false,
      },
      series: [{
        name: "Merge Requests",
        data: [numberOfMergeRequests],
        dataLabels: {
          format:
                "<div style=\"text-align:center\">"
                + "<span style=\"font-size:25px\">{y}</span><br/>"
                + "<span style=\"font-size:12px;opacity:0.4\">MR's in this group</span>"
                + "</div>",
        },
      }],
    }
  )
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
  const matches = useMediaQuery("(max-width:400px)")
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
  const [series, setSeries] = useState([])
  const [categories, setCategories] = useState([])

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
      const mergedStats = mergeUsersAndStats(data, courseGroupGit)
      setCourseGroups(mergedStats)
      const dateFound = getDateFound(mergedStats.groupKeyStats)
      setSeries(getSeries(dateFound))
      setCategories(getCategories(dateFound))
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
                  Merge requests: {courseGroup.groupKeyStats.mergeRequests.length}
                  </Typography>
                  <Typography
                    style={{
                      padding: "0rem 0rem 0rem 2rem",
                    }}
                  >
                  Merge requests open: {courseGroup.groupKeyStats.mergeRequests.filter(mr => mr.state === "opened").length}
                  </Typography>
                  <Typography
                    style={{
                      padding: "0rem 0rem 0rem 2rem",
                    }}
                  >
                  Merge requests closed: {courseGroup.groupKeyStats.mergeRequests.filter(mr => mr.state === "closed").length}
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
                  Merge requests: {groupsStats.averageMergeRequests}
                    </Typography>
                    <Typography
                      style={{
                        padding: "0rem 0rem 0rem 2rem",
                      }}
                    >
                  Merge requests open: {groupsStats.averageMergeRequestsOpen}
                    </Typography>
                    <Typography
                      style={{
                        padding: "0rem 0rem 0rem 2rem",
                      }}
                    >
                  Merge requests closed: {groupsStats.averageMergeRequestsClosed}
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
                      options={optionsGaugeIssues(courseGroup.groupKeyStats, groupsStats)}
                    />
                  </Grid>
                  <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    item
                    xs={12}
                    md={6}
                    style={{
                      overflow: "hidden",
                    }}
                  >
                    <HighchartsReact
                      highcharts={Highcharts}
                      containerProps={{ style: { width: "100%", height: "100%" } }}
                      options={optionsGaugeCommits(courseGroup.groupKeyStats, groupsStats)}
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
                      options={optionsGaugeMergeRequests(courseGroup.groupKeyStats, groupsStats)}
                    />
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
                    options={optionsLines(courseGroup.groupKeyStats.contributorStats)}
                  />
                </Grid>
              </Grid>
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
                  md={6}
                  style={{
                    overflow: "hidden",
                  }}
                >
                  <HighchartsReact
                    highcharts={Highcharts}
                    containerProps={{ style: { width: "100%", height: "100%" } }}
                    options={optionsCommitsArea(series, categories)}
                  />
                </Grid>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  item
                  xs={12}
                  md={6}
                  style={{
                    overflow: "hidden",
                  }}
                >
                  <HighchartsReact
                    highcharts={Highcharts}
                    containerProps={{ style: { width: "100%", height: "100%" } }}
                    options={optionsStreamGraph(series, categories)}
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