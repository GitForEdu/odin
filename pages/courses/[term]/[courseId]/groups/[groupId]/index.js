import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Button, Grid, TextField, Typography, useMediaQuery } from "@material-ui/core"
import Link from "next/link"
import DatePicker from "@material-ui/lab/DatePicker"

import Navbar from "components/Navbar"
import StudentList from "components/List/GroupsStudentList"
import withAuth from "components/withAuth"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import { getCourseGroup } from "pages/api/courses/[term]/[courseId]/blackboard/groups/[groupId]"
import fetcher from "utils/fetcher"
import { getGroupWithMembersGit } from "pages/api/courses/[term]/[courseId]/git/groups/[groupId]"

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

const mergeBBGitKeyStats = async (term, courseId, groupId, courseGroupsBB, courseGroupGit, sinceTime, untilTime) => {
  const groupKeyStats = await fetcher(
    `/api/courses/${term}/${courseId}/git/groups/${groupId}/getGroupKeyStats?since=${sinceTime.toISOString()}&until=${untilTime.toISOString()}&groupPath=${courseGroupGit.full_path}&fileblame=true`,
    {},
    "GET"
  )

  return { ...courseGroupsBB, groupKeyStats }
}

export const Group = ({ courseGroupBB, courseGroupGit, bbGitConnection }) => {
  const matches = useMediaQuery("(max-width:400px)")
  const router = useRouter()
  const { courseId, term, groupId } = router.query
  const [sinceTime, setSinceTime] = useState(new Date("2020-01-01T00:00:00.000Z"))
  const [untilTime, setUntilTime] = useState(new Date((new Date()).valueOf() + 86400000))
  const [courseGroup, setCourseGroups] = useState()

  useEffect(() => {
    mergeBBGitKeyStats(term, courseId, groupId, courseGroupBB, courseGroupGit, sinceTime, untilTime, false).then(data => {
      setCourseGroups(data)
    })
  }, [courseGroupBB, courseId, groupId, sinceTime, term, untilTime])
  console.log(courseGroup)
  return (
    <>
      <Navbar pageTitle={`Information - ${courseGroupBB.name}` || "Group information"} courseId={courseId} term={term} />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={8}>
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
            {courseGroup !== undefined
            && <>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Typography>
                  Commits: {courseGroup.groupKeyStats.commits.length}
                </Typography>
              </Grid>
              <StudentList elements={courseGroup.members} />
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