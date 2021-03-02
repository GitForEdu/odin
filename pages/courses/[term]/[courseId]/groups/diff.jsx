import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import { GetGroupsWithMembers } from "pages/api/courses/[term]/[courseId]/git/getGroups"
import withAuth from "components/withAuth"
import { Grid, Typography } from "@material-ui/core"
import { theme } from "utils/theme"
import SchoolIcon from "@material-ui/icons/School"
import GitIcon from "assets/git-icon-white.svg"

const getListStyle = found => ({
  margin: "8px 8px 8px 8px",
  padding: "0.75rem",
  background: "black",
  border: "1px dashed",
})

const getListTopStyle = (found) => ({
  // some basic styles to make the items look a bit nicer
  padding: 8 * 2,
  margin: "0 0 8px 0",

  // change background colour if dragging
  background: found === "Both" ? "green" : found === "Blackboard" ? "#0e7c7b" : "#380d75",
})

const getItemStyle = (found) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: 8 * 2,
  margin: "0 0 8px 0",

  // change background colour if dragging
  background: found === "Multiple" ? "#8b0000" : found === "Both" ? "green" : found === "Blackboard" ? "#0e7c7b" : "#380d75",
})

const getGitIconWrapperStyle = () => ({
  // some basic styles to make the items look a bit nicer
  width: "1.5rem",
  height: "1.5rem",
})

const getGitIconStyle = () => ({
  // some basic styles to make the items look a bit nicer
  transform: "scale(0.2087)",
})

const Dropable = (group, students, studentsGroup) => {
  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
      item
      xs={4}
    >
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        style={getListStyle()}
      >
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          style={getListTopStyle(group.found)}
        >
          <Grid
            item
            xs={8}
          >
            <Typography variant="h4" align="left">
              {`${group.name}`}
            </Typography>
            <Typography align="left">
              {`Source: ${group.found}`}
            </Typography>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            item
            xs={4}
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
                item
                xs={6}
              >
                <Typography>
                  <SchoolIcon/>
                </Typography>
                <Typography>
                  {"check1"}
                </Typography>
              </Grid>
              <Grid
                item
                xs={6}
              >
                <div style={getGitIconWrapperStyle()}>
                  <GitIcon style={getGitIconStyle()}/>
                </div>
                <Typography>
                  {"check2"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

        </Grid>
        {students.map((item, index) => (
          <Grid
            key={item.name}
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={getItemStyle(studentsGroup[item.userName]?.group.length > 1 ? "Multiple" : item.found)}
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
              <Typography align="left">
                {`Source: ${item.found}`}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
            >
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                item
                xs={12}
              >
                <Grid
                  item
                  xs={6}
                >
                  <Typography>
                    <SchoolIcon/>
                  </Typography>
                  <Typography>
                    {"check1"}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={6}
                >
                  <Typography>
                    <GitIcon style={getGitIconStyle()}/>
                  </Typography>
                  <Typography>
                    {"check2"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}

export const GroupDiff = ({ groupDiff, studentsGroup }) => {

  // console.log(groupDiff, studentsGroup)

  return (
    <>
      {!groupDiff.length && "no groups"}
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        spacing={2}
      >
        {groupDiff.map(group => Dropable(group, group.members, studentsGroup))}
      </Grid>
    </>
  )
}

export const getServerSideProps = (async (context) => {
  const params = context.params

  let groupsBB = await getCourseGroups(context.req, params)
  //console.log("groupsBB", groupsBB)
  groupsBB = groupsBB.filter(group => !group.isGroupSet)

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

  if(groupsGit.message) groupsGit = []
  groupsGit[0].members.push({ name: { given: "Petter", family: "Rein" }, userName: "pettegre" })
  groupsGit[0].members.push({ name: { given: "Rodie", family: "Wollacott" }, userName: "student1" })
  groupsGit[1].members.push({ name: { given: "Petter", family: "Rein" }, userName: "pettegre" })
  groupsGit[1].members.push({ name: { given: "Tore", family: "Stensaker" }, userName: "toretef" })
  const result = calculateGroupDiff(groupsGit, groupsBB)
  const groupDiff = result[0]
  const studentsGroup = result[1]
  //console.log(studentsGroup)

  return {
    props: { groupDiff, studentsGroup },
  }
})

const calculateGroupDiff = (groupsGit, groupsBB) => {
  // record where the group was found, saves the groups to the object with the key group.name
  const groups = {}
  // record the groups the student was found in. Uses student.userName as key, and have the property group which is a array of groups the student was found
  let studentsGroup = {}

  groupsGit.forEach(group => {
    const groupMembersOnGit = group.members.filter(member => member.access_level !== 50).map(member => {
      studentsGroup = saveGroupStudentFoundIn(studentsGroup, member, group)
      return({ ...member, "found": "Git" })
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
        studentsGroup = saveGroupStudentFoundIn(studentsGroup, member, group)
        return({ ...member, "found": "Blackboard" })
      })
    }
    else {
      // get the members from the group found earlier from Git
      const membersGit = groups[group.name].members
      const membersBB = group.members
      const longestArray = membersGit.length > membersBB.length
      if (longestArray) {
        const result = diff(members, studentsGroup, group, membersGit, membersBB, "Git", "Blackboard")
        members = result[0]
        studentsGroup = result[1]
      }
      else {
        const result = diff(members, studentsGroup, group, membersBB, membersGit, "Blackboard", "Git")
        members = result[0]
        studentsGroup = result[1]
      }
    }
    groups[group.name] = {
      name: group.name,
      found: groupBothPlaces ? "Both" : "Blackboard",
      members: members,
    }
  })

  // convert the dicts into arrays
  return [Object.keys(groups).map((key) => groups[key]), studentsGroup]
}

const diff = (members, studentsGroup, group, array1, array2, string1, string2) => {
  let tmpStudentsGroup = studentsGroup
  array1.forEach(memberArray1 => {
    const foundInOther = array2.findIndex(memberArray2 => memberArray2.userName === memberArray1.userName)
    if (foundInOther >= 0) {
      console.log("22", foundInOther)
      members.push({ ...memberArray1, "found": "Both" })
      array2.splice(foundInOther, 1)
    }
    else {
      tmpStudentsGroup = saveGroupStudentFoundIn(tmpStudentsGroup, memberArray1, group)
      members.push({ ...memberArray1, "found": string1 })
    }
  })

  // if we still have some entries in this list
  array2.forEach(member => {
    tmpStudentsGroup = saveGroupStudentFoundIn(tmpStudentsGroup, member, group)
    members.push({ ...member, "found": string2 })
  })

  return [members, tmpStudentsGroup]
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


export default withAuth(GroupDiff)