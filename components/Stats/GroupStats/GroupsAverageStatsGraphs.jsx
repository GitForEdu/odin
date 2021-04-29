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

const GroupsAverageStatsGrahps = ({ group, groupsStats, loading }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <>
      { !loading
        ? <Grid
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
              options={optionsGaugeIssues(group.groupKeyStats, groupsStats)}
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
              options={optionsGaugeCommits(group.groupKeyStats, groupsStats)}
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
              options={optionsGaugeMergeRequests(group.groupKeyStats, groupsStats)}
            />
          </Grid>
        </Grid>
        : <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          item
          xs={12}
          md={3}
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
            md={3}
          >
            <Skeleton
              className={classes.skeleton}
              variant="rect"
            />
          </Grid>
        </Grid>
      }
    </>
  )
}

export default GroupsAverageStatsGrahps