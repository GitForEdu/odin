import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import { GetGroupsWithMembers } from "pages/api/courses/[term]/[courseId]/git/getGroups"
import withAuth from "components/withAuth"
import { Grid, Typography } from "@material-ui/core"


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
      <div>
        Name: {group.name} -
        Found: {group.found}
        {students.map((item, index) => (
          <Grid
            key={item.name}
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
      </div>
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

  const longestArray = groupsBB.length > groupsGit.length

  if (!groupsBB || !groupsGit) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  if(groupsGit.message) groupsGit = []

  const groupDiff = calculateGroupDiff(groupsGit, groupsBB)

  return {
    props: { groupDiff },
  }
})

const calculateGroupDiff = (groupsGit, groupsBB) => {
  const array = {}

  groupsGit.forEach(group => {
    const members = group.members.filter(member => member.access_level !== 50).map(member => ({ ...member, "found": "Git" }))
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
      members = group.members.map(member => ({ ...member, "found": "Blackboard" }))
    }
    else {
      const membersGit = array[group.name].members
      const membersBB = group.members
      const longestArray = membersGit.length > membersBB.length
      if (longestArray) {
        members = diff(members, membersGit, membersBB, "Git", "Blackboard")
      }
      else {
        members = diff(members, membersBB, membersGit, "Blackboard", "Git")
      }
    }
    array[group.name] = {
      name: group.name,
      found: groupBothPlaces ? "Both" : "Blackboard",
      members: members,
    }
  })

  return Object.keys(array).map((key) => array[key])
}

const diff = (arraySum, array1, array2, string1, string2) => {
  array1.forEach(memberArray1 => {
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
    arraySum.push({ ...member, "found": string2 })
  })

  return arraySum
}


export default withAuth(GroupDiff)