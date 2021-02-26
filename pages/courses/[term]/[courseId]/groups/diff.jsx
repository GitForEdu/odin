import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import { GetGroupsWithMembers } from "pages/api/courses/[term]/[courseId]/git/getGroups"
import withAuth from "components/withAuth"
import { Grid, Typography } from "@material-ui/core"
import { theme } from "utils/theme"

const getListStyle = found => ({
  margin: "8px 8px 8px 8px",
  background: found === "Both" ? "blue" : found === "Blackboard" ? "green" : theme.palette.selected.main,
})

const getItemStyle = (found) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: 8 * 2,
  margin: "0 0 8px 0",

  // change background colour if dragging
  background: found === "Both" ? "lightblue" : found === "Blackboard" ? "lightgreen" : theme.palette.selected.main,
})

const Dropable = (group, students) => {
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
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
        style={getListStyle(group.found)}
      >
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"

        >
          <Grid
            item
            xs={12}
          >
            <Typography>
              {`Name: ${group.name}`}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Typography>
              {`Found: ${group.found}`}
            </Typography>
          </Grid>
        </Grid>
        {students.map((item, index) => (
          <Grid
            key={item.name}
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            style={getItemStyle(item.found)}
          >
            <Grid
              item
              xs={12}
            >
              <Typography>
                {`Found: ${item.found}`}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
            >
              <Typography>
                {item.name.given} -
                {item.name.family} -
                {item.userName}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}

export const GroupDiff = ({ groupDiff }) => {

  console.log(groupDiff)

  return (
    <>
      {!groupDiff.length && "no groups"}
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        spacing={3}
        item
        xs={12}
      >
        {groupDiff.map(group => Dropable(group, group.members))}
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
  const result = calculateGroupDiff(groupsGit, groupsBB)
  const groupDiff = result[0]
  const studentsGroup = result[1]
  //console.log(studentsGroup)

  return {
    props: { groupDiff },
  }
})

const calculateGroupDiff = (groupsGit, groupsBB) => {
  // record where the group was found, saves the groups to the object with the key group.name
  const array = {}
  // record the groups the student was found in. Uses student.userName as key, and have the property group which is a array of groups the student was found
  let studentsGroup = {}

  groupsGit.forEach(group => {
    const members = group.members.filter(member => member.access_level !== 50).map(member => {
      const foundStudent = studentsGroup[member.userName]
      if (foundStudent) {
        studentsGroup[member.userName].group.push(group.name)
      }
      else {
        studentsGroup[member.userName] = {
          username: member.userName,
          group: [],
        }
        studentsGroup[member.userName].group.push(group.name)
      }
      return({ ...member, "found": "Git" })
    })
    array[group.name] = {
      name: group.name,
      found: "Git",
      members: members,
    }
  })

  groupsBB.forEach(group => {
    console.log(group.members[0])
    const groupBothPlaces = !!array[group.name]
    let members = []
    if (!groupBothPlaces) {
      members = group.members.map(member => {
        const foundStudent = studentsGroup[member.userName]
        if (foundStudent) {
          studentsGroup[member.userName].group.push(group.name)
        }
        else {
          studentsGroup[member.userName] = {
            username: member.userName,
            group: [],
          }
          studentsGroup[member.userName].group.push(group.name)
        }
        return({ ...member, "found": "Blackboard" })
      })
    }
    else {
      const membersGit = array[group.name].members
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
    array[group.name] = {
      name: group.name,
      found: groupBothPlaces ? "Both" : "Blackboard",
      members: members,
    }
  })

  return [Object.keys(array).map((key) => array[key]), Object.keys(studentsGroup).map((key) => studentsGroup[key])]
}

const diff = (arraySum, studentsGroup, group, array1, array2, string1, string2) => {
  array1.forEach(memberArray1 => {
    const foundStudent = studentsGroup[memberArray1.userName]
    if (foundStudent) {
      studentsGroup[memberArray1.userName].group.push(group.name)
    }
    else {
      studentsGroup[memberArray1.userName] = {
        username: memberArray1.userName,
        group: [],
      }
      studentsGroup[memberArray1.userName].group.push(group.name)
    }
    const foundInOther = array2.find(memberArray2 => memberArray2.userName === memberArray1.username)
    if (foundInOther) {
      arraySum.push({ ...memberArray1, "found": "Both" })
      array2.splice(foundInOther, 1)
    }
    else {
      arraySum.push({ ...memberArray1, "found": string1 })
    }
  })

  array2.forEach(member => {
    const foundStudent = studentsGroup[member.userName]
    if (foundStudent) {
      studentsGroup[member.userName].group.push(group.name)
    }
    else {
      studentsGroup[member.userName] = {
        username: member.userName,
        group: [],
      }
      studentsGroup[member.userName].group.push(group.name)
    }
    arraySum.push({ ...member, "found": string2 })
  })

  return [arraySum, studentsGroup]
}


export default withAuth(GroupDiff)