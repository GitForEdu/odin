import { useEffect, useState } from "react"
import clsx from "clsx"
import { makeStyles } from "@mui/styles"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import Toolbar from "@mui/material/Toolbar"
import Paper from "@mui/material/Paper"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import FormControlLabel from "@mui/material/FormControlLabel"
import FilterListIcon from "@mui/icons-material/FilterList"
import { visuallyHidden } from "@mui/utils"
import { useRouter } from "next/router"
import TextField from "@mui/material/TextField"
import { Button, Grid, Modal, Skeleton } from "@mui/material"
import { formatDate } from "utils/format"
import CloseIcon from "@mui/icons-material/Close"
import calcultateGitStats from "../Stats/getCourseOverviewStats"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paperTable: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  sortSpan: visuallyHidden,
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  title: {
    flex: "1 1 100%",
  },
}))

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

function EnhancedTable({ groups, cells, handleModal }) {
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
      <Paper className={classes.paperTable}>
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

const ModalColumns = ({ classes, columnSelectors, handleModal }) => (
  <div
    className={classes.paper}
  >
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="flex-start"
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleModal}
        >
          <CloseIcon />
        </Button>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        {columnSelectors}
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="flex-end"
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleModal}
        >
          Set filters
        </Button>
      </Grid>
    </Grid>
  </div>
)

const cellList = [
  { label: "Issues", type: "numeric", dataLabel: "issues" },
  { label: "Commits", type: "numeric", dataLabel: "commits" },
  { label: "Members", type: "numeric", dataLabel: "members" },
  { label: "Branches", type: "numeric", dataLabel: "branches" },
  { label: "Merge Requests", type: "numeric", dataLabel: "mergeRequests" },
  { label: "Projects", type: "numeric", dataLabel: "projects" },
  { label: "Milestones", type: "numeric", dataLabel: "milestones" },
  { label: "Wiki Pages", type: "numeric", dataLabel: "wikiPages" },
  { label: "Wiki Size", type: "numeric", dataLabel: "wikiSize" },
  { label: "Unassgined Issues", type: "numeric", dataLabel: "unassginedIssues" },
  { label: "Time of first commit", type: "date", dataLabel: "firstCommit" },
  { label: "Time of last commit", type: "date", dataLabel: "lastCommit" },
  { label: "Last Activity in a project", type: "date", dataLabel: "lastActivity" },
  { label: "Number of files", type: "numeric", dataLabel: "numberOfFiles" },
  { label: "Additions", type: "numeric", dataLabel: "additions" },
  { label: "Deletions", type: "numeric", dataLabel: "deletions" },
]

const GroupsStatsList = ({ courseGroupsBB, courseGroupsGit, courseId, sinceTime, term, untilTime }) => {
  const [cells, setCells] = useState([
    { label: "Commits", type: "numeric", dataLabel: "commits" },
    { label: "Issues", type: "numeric", dataLabel: "issues" },
    { label: "Members", type: "numeric", dataLabel: "members" },
  ])
  const [modalState, setModalState] = useState(false)
  const [courseGroups, setCourseGroups] = useState([])
  const [loading, setLoading] = useState(false)

  const classes = useStyles()

  useEffect(() => {
    setLoading(true)
    if(courseGroupsGit.length > 0) {
      calcultateGitStats(term, courseId, courseGroupsBB, courseGroupsGit, sinceTime, untilTime).then(data => {
        setCourseGroups(data.groups)
        setLoading(false)
      })
    }
  }, [courseGroupsBB, courseGroupsGit, courseId, sinceTime, term, untilTime])

  const handleModal = () => {
    setModalState(!modalState)
  }

  const handleChangeCheckbox = (event) => {
    const tmpCells = [...cells]
    const findIndex = cells.findIndex(cell => cell.label === event.target.name)
    if (findIndex >= 0) {
      tmpCells.splice(findIndex, 1)
    }
    else {
      tmpCells.push(cellList.find(cell => cell.label === event.target.name))
    }
    setCells(tmpCells)
  }

  const columnSelectors
     = cellList.map((cellElement, index) => (
       <Grid
         key={index}
         container
         direction="row"
         justifyContent="flex-start"
         alignItems="flex-start"

         item
         xs={6}
       >
         <FormControlLabel
           control={
             <Checkbox
               checked={cells.findIndex(cell => cell.label === cellElement.label) >= 0}
               onChange={handleChangeCheckbox}
               name={cellElement.label}
               color="selected"
             />
           }
           label={cellElement.label}
         />
       </Grid>
     ))

  return (
    <>
      { !loading
        ? <Grid
          container
          item
        >
          <Modal
            style={{ display:"flex", alignItems:"center", justifyContent:"center" }}
            open={modalState}
            onClose={handleModal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <ModalColumns classes={classes} columnSelectors={columnSelectors} handleModal={handleModal}/>
          </Modal>
          <EnhancedTable groups={courseGroups} cells={cells} handleModal={handleModal}/>
        </Grid>
        : <>
          <Grid
            item
            xs={12}
            md={12}
            spacing={0}
            style={{
              height: "30rem",
            }}
          >
            <Skeleton
              style={{
                width: "100%",
                height: "100%",
                transformOrigin: "0 0.1%",
              }}
            />
          </Grid>
        </>
      }
    </>
  )
}

export default GroupsStatsList