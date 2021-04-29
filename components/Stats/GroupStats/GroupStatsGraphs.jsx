import Highcharts from "highcharts"
import HighchartsExporting from "highcharts/modules/exporting"
import HighchartsReact from "highcharts-react-official"
import DarkUnica from "highcharts/themes/dark-unica"
import HighchartsStreamGraph from "highcharts/modules/streamgraph"
import HighchartsSolidGauge from "highcharts/modules/solid-gauge"
import HighchartsMore from "highcharts/highcharts-more.js"
import { Grid, makeStyles, Skeleton, useTheme } from "@material-ui/core"

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts)
  DarkUnica(Highcharts)
  HighchartsStreamGraph(Highcharts)
  HighchartsMore(Highcharts)
  HighchartsSolidGauge(Highcharts)
}

const useStyles = makeStyles(theme => ({
  skeleton: {
    width: "100%",
    height: "25rem",
    margin: "0rem 0rem 1rem 0rem",
  },
}))

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

const GroupStatsGraphs = ({ group, loading }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  let dateFound = undefined
  let series = undefined
  let categories = undefined

  if (!loading) {
    dateFound = getDateFound(group.groupKeyStats)
    series = getSeries(dateFound)
    categories = getCategories(dateFound)
  }

  return (
    <>
      { !loading
        ? <>
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
                options={optionsCommits(group.groupKeyStats.contributorStats)}
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
                options={optionsMergeRequests(group.groupKeyStats.contributorStats)}
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
                options={optionsIssues(group.groupKeyStats.contributorStats)}
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
                options={optionsLines(group.groupKeyStats.contributorStats)}
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
        </>
        : <>
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
            >
              <Skeleton
                className={classes.skeleton}
                variant="rect"
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
            >
              <Skeleton
                className={classes.skeleton}
                variant="rect"
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
            >
              <Skeleton
                className={classes.skeleton}
                variant="rect"
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
            >
              <Skeleton
                className={classes.skeleton}
                variant="rect"
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
            >
              <Skeleton
                className={classes.skeleton}
                variant="rect"
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
            >
              <Skeleton
                className={classes.skeleton}
                variant="rect"
              />
            </Grid>
          </Grid>
        </>
      }
    </>
  )
}

export default GroupStatsGraphs