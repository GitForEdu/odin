import { useEffect, useState } from "react"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import { getCourseUsers } from "pages/api/courses/[term]/[courseId]/users"
import { GetGroupsWithMembers } from "pages/api/courses/[term]/[courseId]/git/getGroups"
import withAuth from "components/withAuth"
import { Grid, Typography } from "@material-ui/core"
import { theme } from "utils/theme"
import SchoolIcon from "@material-ui/icons/School"
import CheckIcon from "@material-ui/icons/Check"
import ClearIcon from "@material-ui/icons/Clear"
import GitIcon from "assets/git-icon-white.svg"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"


const getListStyle = isDraggingOver => ({
  margin: "8px 8px 8px 8px",
  padding: "0.75rem",
  background: "black",
  border: "1px dashed",
  borderColor: isDraggingOver && theme.palette.primary.main,
})

const getListTopStyle = (status, clickable) => ({
  padding: 8 * 2,
  margin: "8px 0 8px 0",
  cursor: clickable && "pointer",
  background: status && "green",
})

const getListMemberStyle = (collapsed) => ({
  display: collapsed ? "none" : "block",
})

const getItemStyle = (found, isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: 8 * 2,
  margin: "0 0 8px 0",

  background: found === "Multiple" ? "#8b0000" : found === "Both" ? "green" : found === "Blackboard" ? "#0e7c7b" : "#380d75",
  ...draggableStyle,
})

const getGitIconStyle = () => ({
  width: "24px",
  height: "24px",
  transform: "scale(0.80)",
})


const Dropable = (group, index, students, studentsGroup, onClickListTop) => {
  return (
    <Grid
      key={index}
      container
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
      item
      md={4}
      sx={4}
    >
      <Droppable droppableId={`${index}`}>
        {(provided, snapshot) => (
          <Grid
            ref={provided.innerRef}
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            style={getListStyle(snapshot.isDraggingOver)}
            index={index}
          >
            <Grid
              onClick={() => onClickListTop(index)}
              container
              direction="row"
              justify="center"
              alignItems="center"
              style={getListTopStyle(group.status, !(group.members.length === 0))}
            >
              <Grid
                item
                xs={8}
              >
                <Typography variant="h4" align="left">
                  {`${group.name}`}
                </Typography>
                <Typography variant="h6" align="left">
                  {(group.members.length === 0 || group.members.length > 1) ? `${group.members.length} members` : `${group.members.length} member`}
                </Typography>
              </Grid>
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                item
                xs={3}
              >
                <Grid
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="flex-start"
                  item
                  xs={12}
                >
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="flex-start"
                    item
                    xs={6}
                  >
                    <Grid
                      item
                      xs={12}
                    >
                      {!group.noGroupStudents && (<SchoolIcon />)}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                    >
                      {!group.noGroupStudents && (group.bbStatus ? <CheckIcon /> : <ClearIcon />)}
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="flex-start"
                    item
                    xs={6}
                  >
                    <Grid
                      item
                      xs={12}
                    >
                      {!group.noGroupStudents && <GitIcon style={getGitIconStyle()} />}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                    >
                      {!group.noGroupStudents && (group.gitStatus ? <CheckIcon /> : <ClearIcon />)}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={1}
              >
                {group.members.length === 0 ? undefined : group.collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </Grid>

            </Grid>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              style={getListMemberStyle(group.collapsed, snapshot.isDraggingOver)}
            >
              {students.map((item, indexStudent) => (
                <Draggable
                  key={`${index}${item.userName}${indexStudent}`}
                  draggableId={`${index}${item.userName}${indexStudent}`}
                  index={indexStudent}
                >
                  {(provided, snapshot) => (
                    <Grid
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                      style={getItemStyle(studentsGroup[item.userName]?.group.length > 1 ? "Multiple" : item.found, snapshot.isDragging, provided.draggableProps.style)}
                    >
                      <Grid
                        item
                        xs={8}

                      >
                        <Typography align="left">
                          {`${item.name.given} ${item.name.family}`}
                        </Typography>
                        <Typography align="left">
                          {item.userName}
                        </Typography>
                        {studentsGroup[item.userName].group.length > 1
                        && <Typography align="left">
                          In groups: {(studentsGroup[item.userName].group.toString()).replaceAll(",", ", ")}
                        </Typography>}
                      </Grid>
                      <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        item
                        xs={3}
                      >
                        <Grid
                          container
                          direction="row"
                          justify="flex-start"
                          alignItems="flex-start"
                          item
                          xs={12}
                        >
                          <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="flex-start"
                            item
                            xs={6}
                          >
                            <Grid
                              item
                              xs={12}
                            >
                              {!group.noGroupStudents && (<SchoolIcon />)}
                            </Grid>
                            <Grid
                              item
                              xs={12}
                            >
                              {!group.noGroupStudents && (item.found === "Both" || item.found === "Blackboard" ? <CheckIcon /> : <ClearIcon />)}
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="flex-start"
                            item
                            xs={6}
                          >
                            <Grid
                              item
                              xs={12}
                            >
                              {!group.noGroupStudents && (<GitIcon style={getGitIconStyle()} />)}
                            </Grid>
                            <Grid
                              item
                              xs={12}
                            >
                              {!group.noGroupStudents && (item.found === "Both" || item.found === "Git" ? <CheckIcon /> : <ClearIcon />)}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={1}
                      />
                    </Grid>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Grid>
          </Grid>
        )}
      </Droppable>
    </Grid>
  )
}


export const GroupDiff = ({ groupDiff }) => {
  const initGroups = checkGroupStatus(groupDiff)
  const [groups, setGroups] = useState(initGroups[0])
  const [studentsGroup, setStudentsGroup] = useState(initGroups[1])

  const onClickListTop = (groupIndex) => {
    const tmpGroups = [...groups]
    tmpGroups[groupIndex]["collapsed"] = !tmpGroups[groupIndex]["collapsed"]
    setGroups(tmpGroups)
  }

  const onDragEnd = result => {
    const { source, destination } = result
    // dropped outside the list
    if (!destination) {
      return
    }
    // interal moved element
    if (source.droppableId === destination.droppableId) {
      const listOfList = reorderSubList(
        groups[source.droppableId],
        source.droppableId,
        source.index,
        destination.index,
        groups
      )
      const status = checkGroupStatus(listOfList)
      setGroups([...status[0]])
      setStudentsGroup({ ...status[1] })
    }
    // moved into new sublist
    else {
      const listOfList = moveElementToOtherSubList(
        groups[source.droppableId].members,
        groups[destination.droppableId].members,
        source,
        destination,
        groups
      )
      const status = checkGroupStatus(listOfList)
      setGroups([...status[0]])
      setStudentsGroup({ ...status[1] })
    }
  }

  return (
    <>
      {!groups.length && "no groups"}
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        spacing={2}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          {groups.map((group, index) => Dropable(group, index, group.members, studentsGroup, onClickListTop))}
        </DragDropContext>
      </Grid>

    </>
  )
}


export const getServerSideProps = (async (context) => {
  const params = context.params

  const groupsBB = (await getCourseGroups(context.req, params)).filter(group => !group.isGroupSet)
  //console.log("groupsBB", groupsBB)

  let courseUsers = (await getCourseUsers(context.req, params)).filter(user => user.courseRoleId === "Student")

  let groupsGit = await GetGroupsWithMembers(context.req, params)
  //console.log("groupsGit", groupsGit)

  if (!groupsBB || !groupsGit) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }
  groupsGit.unshift({ name: "Group -1", members: [] })
  groupsBB.unshift({ name: "Group -1", members: [] })
  groupsGit[0].members.push({ name: { given: "Petter", family: "Rein" }, userName: "pettegre1" })
  groupsBB[0].members.push({ name: { given: "Petter", family: "Rein" }, userName: "pettegre1" })

  if (groupsGit.message) groupsGit = []
  groupsGit[1].members.push({ name: { given: "Petter", family: "Rein" }, userName: "pettegre" })
  groupsGit[1].members.push({ name: { given: "Rodie", family: "Wollacott" }, userName: "student1" })
  groupsGit[2].members.push({ name: { given: "Petter", family: "Rein" }, userName: "pettegre" })
  groupsGit[2].members.push({ name: { given: "Tore", family: "Stensaker" }, userName: "toretef" })
  groupsGit[3].members.push({ name: { given: "Petter", family: "Rein" }, userName: "pettegre" })
  const groupDiff = calculateGroupDiff(groupsGit, groupsBB)
  const usersInNoGroup = checkIfUserInAGroup(courseUsers, checkGroupStatus(groupDiff)[1])
  usersInNoGroup.push({ name: { given: "Petter", family: "Rein" }, userName: "test", found: "Blackboard" })

  if (usersInNoGroup.length > 0) {
    groupDiff.unshift({ name: "Students in no group", found: "Blackboard", members: usersInNoGroup, noGroupStudents: true })
  }
  //console.log(studentsGroup)

  return {
    props: { groupDiff },
  }
})


const checkGroupStatus = (groups) => {
  let studentsGroup = {}
  const updatedGroups = groups.map(group => {
    let gitStatus = true
    let bbStatus = true

    group.members.forEach(member => {
      studentsGroup = saveGroupStudentFoundIn(studentsGroup, member, group)
      if (member.found === "Git") {
        bbStatus = false
      }
      if (member.found === "Blackboard") {
        gitStatus = false
      }
    })
    let status = gitStatus && bbStatus
    if (group.members.length <= 0) {
      status = false
      gitStatus = false
      bbStatus = false
    }
    return { ...group, status: status, gitStatus: gitStatus, bbStatus: bbStatus, collapsed: status }
  })
  return [updatedGroups, studentsGroup]
}

const calculateGroupDiff = (groupsGit, groupsBB) => {
  // record where the group was found, saves the groups to the object with the key group.name
  const groups = {}

  groupsGit.forEach(group => {
    const groupMembersOnGit = group.members.filter(member => member.access_level !== 50).map(member => {
      return ({ ...member, "found": "Git" })
    })
    groups[group.name] = {
      name: group.name,
      found: "Git",
      members: groupMembersOnGit,
    }
  })

  groupsBB.forEach(group => {
    // Have we seen this group on Gitlab?
    const groupBothPlaces = !!groups[group.name]
    let members = []
    if (!groupBothPlaces) {
      // no it was a new group
      members = group.members.map(member => {
        return ({ ...member, "found": "Blackboard" })
      })
    }
    else {
      // get the members from the group found earlier from Git
      const membersGit = groups[group.name].members
      const membersBB = group.members
      const longestArray = membersGit.length > membersBB.length
      if (longestArray) {
        members = diff(members, membersGit, membersBB, "Git", "Blackboard")
      }
      else {
        members = diff(members, membersBB, membersGit, "Blackboard", "Git")
      }
    }
    groups[group.name] = {
      name: group.name,
      found: groupBothPlaces ? "Both" : "Blackboard",
      members: members,
    }
  })

  // convert the dicts into arrays
  return Object.keys(groups).map((key) => groups[key])
}

const diff = (members, array1, array2, string1, string2) => {
  array1.forEach(memberArray1 => {
    const foundInOther = array2.findIndex(memberArray2 => memberArray2.userName === memberArray1.userName)
    if (foundInOther >= 0) {
      members.push({ ...memberArray1, "found": "Both" })
      array2.splice(foundInOther, 1)
    }
    else {
      members.push({ ...memberArray1, "found": string1 })
    }
  })

  // if we still have some entries in this list
  array2.forEach(member => {
    members.push({ ...member, "found": string2 })
  })

  return members
}

const saveGroupStudentFoundIn = (studentsGroup, member, group) => {
  const foundStudent = studentsGroup[member.userName]
  if (foundStudent && !foundStudent.group.includes(group.name)) {
    studentsGroup[member.userName].group.push(group.name)
  }
  else {
    studentsGroup[member.userName] = {
      username: member.userName,
      group: [],
    }
    studentsGroup[member.userName].group.push(group.name)
  }
  return studentsGroup
}

const reorderSubList = (list, listIndex, startIndex, endIndex, listOfList) => {
  const listTemp = Array.from(list.members)
  const [removed] = listTemp.splice(startIndex, 1)
  listTemp.splice(endIndex, 0, removed)
  listOfList[listIndex].members = listTemp
  return listOfList
}

const moveElementToOtherSubList = (source, destination, droppableSource, droppableDestination, listOfList) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  const duplicateUser = destClone.findIndex(user => user.userName === removed.userName)
  if (!(duplicateUser >= 0)) {
    destClone.splice(droppableDestination.index, 0, removed)
  }

  listOfList[droppableSource.droppableId].members = sourceClone
  listOfList[droppableDestination.droppableId].members = destClone

  if (listOfList[droppableSource.droppableId].noGroupStudents && listOfList[droppableSource.droppableId].members.length === 0) {
    listOfList.splice(droppableSource.droppableId, 1)
    return listOfList
  }
  return listOfList
}

const checkIfUserInAGroup = (users, usersGroups) => {
  const usersNoGroup = []

  users.forEach(user => {
    const foundUser = usersGroups[user.user.userName]
    if(!foundUser) {
      usersNoGroup.push({ ...user.user, found: "Blackboard" })
    }
  })

  return usersNoGroup
}


export default withAuth(GroupDiff)