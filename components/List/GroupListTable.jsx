import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import clsx from "clsx"
import { alpha, makeStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TablePagination from "@material-ui/core/TablePagination"
import TableRow from "@material-ui/core/TableRow"
import TableSortLabel from "@material-ui/core/TableSortLabel"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import Checkbox from "@material-ui/core/Checkbox"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import DeleteIcon from "@material-ui/icons/Delete"
import FilterListIcon from "@material-ui/icons/FilterList"
import { visuallyHidden } from "@material-ui/utils"
import Link from "next/link"
import { useRouter } from "next/router"
import TextField from "@material-ui/core/TextField"
import { Grid } from "@material-ui/core"


const tableCells = (row, cells) => {
  return (
    <>
      {cells.map((cell, index) => {
        return (
          <TableCell key={index} align={cell.type === "numeric" ? "right" : "left"}>{row[cell.dataLabel]}</TableCell>
        )
      })}
    </>
  )
}

const headCells = (cells) => {
  const cellList = [{ id: "name", numeric: false, disablePadding: true, label: "Group name" }]
  cells.forEach(cell => (
    cellList.push({ id: cell.dataLabel, numeric: cell.type === "numeric", disablePadding: false, label: cell.label })
  ))
  return (cellList)
}

const formatDate = (dateString) => {

  const date = new Date(dateString)
  if (date.getDate()) {
    return `${date.getUTCFullYear()}.${date.getUTCMonth()}.${date.getUTCDate()} - ${date.getUTCHours()}:${date.getUTCMinutes()}`
  }
  return "No data"
}

const createData = (group) => {
  return {
    id: group.id,
    name: group.name,
    issues: group.issues.length,
    unassginedIssues: group.issues.map(issue => issue.assignees.nodes.length).filter(assigneesCount => assigneesCount === 0).length,
    commits: group.commits.length,
    mergeRequests: group.mergeRequests.length,
    wikiSize: group.totalWikiSize,
    wikiPages: group.wikiPages.length,
    milestones: group.milestones.length,
    projectes: group.projects.length,
    branches: group.branches.length,
    members: group.members.length,
    lastCommit: formatDate(group.commitStats.last),
    firstCommit: formatDate(group.commitStats.first),
    lastActivity: formatDate(group.projectStats.lastActivity),
    linesOfCode: group.projectStats.linesOfCode,
    numberOfFiles: group.projectStats.numberOfFiles,
    additions: group.projectStats.additions,
    deletions: group.projectStats.deletions,
  }
}

const createRows = (groups) => {
  return groups.map(group => createData(group))
}

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  sortSpan: visuallyHidden,
}))

const EnhancedTableHead = (props) => {
  const { classes, order, orderBy, onRequestSort, cells } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells(cells).map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id
                ? (
                  <span className={classes.sortSpan}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </span>
                )
                : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  title: {
    flex: "1 1 100%",
  },
}))

const EnhancedTableToolbar = ({ searchVal, handleSearch, handleModal }) => {
  const classes = useToolbarStyles()

  return (
    <Toolbar
      className={clsx(classes.root)}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="baseline"
      >


        <Grid
          item
        >
          <TextField
            id="searchGroupName"
            label="Search group name"
            align="left"
            value={searchVal}
            onChange={handleSearch}
            variant="filled"
            style={{
              margin: "0",
            }}
          />

        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          item
          xs={2}
        >
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list" onClick={handleModal}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Toolbar>
  )
}

export default function EnhancedTable({ groups, cells, handleModal }) {
  const router = useRouter()
  const { courseId, term } = router.query
  const classes = useStyles()
  const [rows, setRows] = useState(createRows(groups))
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("name")
  const [searched, setSearched] = useState("")

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const handleRowClick = (row) => {
    router.push(`/courses/${term}/${courseId}/groups/${row.name.replace(" ", "_")}`)
  }

  const handleSearch = (event) => {
    setSearched(event.target.value)
  }

  useEffect(() => {
    const tmpRows = createRows(groups)
    const filteredRows = tmpRows.filter((row) => {
      return row.name.toLowerCase().includes(searched.toLowerCase())
    })
    setRows(filteredRows)
  }, [groups, searched])

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar searchVal={searched} handleSearch={handleSearch} handleModal={handleModal}/>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              cells={cells}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow key={index} hover={true} onClick={() => handleRowClick(row)}>
                      <TableCell component="th" id={labelId} scope="row">
                        {row.name}
                      </TableCell>
                      {tableCells(row, cells)}
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  )
}
