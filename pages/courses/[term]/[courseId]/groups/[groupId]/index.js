import { useRouter } from "next/router"
import { Button, Grid, useMediaQuery } from "@material-ui/core"
import Link from "next/link"

import Navbar from "components/Navbar"
import StudentList from "components/List/StudentList"
import PagePadder from "components/PagePadder"
import withAuth from "components/withAuth"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"

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

export const Group = ({ courseGroups, bbGitConnection }) => {
  const matches = useMediaQuery("(max-width:400px)")
  const router = useRouter()
  const { courseId, term, groupId } = router.query
  const groupInfo = courseGroups.find(group => group.id = groupId)
  return (
    <>
      <Navbar pageTitle={"Group information"} courseId={courseId} term={term} />
      <PagePadder>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          <StudentList elements={groupInfo.members} />

          <Link
            href={`${process.env.NEXT_PUBLIC_BB_PATH}/webapps/blackboard/execute/modulepage/viewGroup?course_id=${courseId}&group_id=${groupId}`}
            passHref
          >
            <Button
              variant="contained"
              color="primary"
              style={getButtonStyle(matches)}
            >
              {`${groupInfo.name} in Blackboard`}
            </Button>
          </Link>

          <Link
            href={`${bbGitConnection.gitURL}/${courseId}-${term}/${groupId}`}
            passHref
          >
            <Button
              variant="contained"
              color="primary"
              style={getButtonStyle(matches)}
            >
              {`${groupInfo.name} in GitLab`}
            </Button>
          </Link>
        </Grid>
      </PagePadder>
    </>
  )
}

export const getServerSideProps = (async (context) => {
  const params = context.params

  let courseGroups = await getCourseGroups(context.req, params)

  courseGroups = courseGroups.filter(group => !group.isGroupSet)

  const bbGitConnection = await getBBGitConnection(context.req, params)

  if (!courseGroups || !bbGitConnection) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: { courseGroups, bbGitConnection },
  }
})

export default withAuth(Group)