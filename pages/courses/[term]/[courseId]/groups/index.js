import Navbar from "components/Navbar"
import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import { useState } from "react"
import fetcher from "utils/fetcher"
import { Button,Grid } from "@mui/material"
import Link from "next/link"
import { GetGroups } from "pages/api/courses/[term]/[courseId]/git/groups"
import DatePickerBar from "components/DatePickerBar"
import GroupsStatsList from "components/List/GroupListTable"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"


export const Group = ({ courseGroupsBB, courseGroupsGit, bbGitConnection }) => {
  const router = useRouter()
  const { courseId, term } = router.query
  const [sinceTime, setSinceTime] = useState(new Date((new Date()).valueOf() - 31536000000))
  const [untilTime, setUntilTime] = useState(new Date((new Date()).valueOf() + 86400000))
  const [loadingCreateSubGroups, setLoadingCreateSubGroups] = useState(false)

  const createSubGroups = async () => {
    if (courseGroupsBB && courseGroupsBB.length !== 0) {
      setLoadingCreateSubGroups(true)
      const data = await fetcher(
        `/api/courses/${term}/${courseId}/git/createSubGroups`,
        {
          groups: courseGroupsBB,
        },
        "POST"
      )
      setLoadingCreateSubGroups(false)
      // console.log(data)
      if (data) {
        router.push(`/courses/${term}/${courseId}/groups`)
      }
    }
  }

  return (
    <>
      <Navbar pageTitle={"All groups"} courseId={courseId} term={term} />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={10} md={10}>
          {courseGroupsBB.length === 0
            ? <>
              <h1>No groups found on Blackboard</h1>
              <Link href={`/courses/${term}/${courseId}/groups/create`} passHref>
                <Button
                  variant="contained"
                  color="primary"
                >
                  Go to group creation page
                </Button>
              </Link>
            </>
            : courseGroupsGit.length === 0
              ? <>
                <h1>No groups found on GitLab</h1>
                {bbGitConnection.pat
                  && <Button
                    variant="contained"
                    color="primary"
                    onClick={createSubGroups}
                    disabled={loadingCreateSubGroups}
                  >
                    Create groups on GitLab
                  </Button>}
              </>
              : courseGroupsBB.length === courseGroupsGit.length
                && (<>
                  <h1>Amount of groups on BB and Blackboard does not match</h1>
                  {bbGitConnection.pat
                  && <Link href={`/courses/${term}/${courseId}/groups/diff`} passHref>
                    <Button
                      variant="contained"
                      color="primary"
                    >
                      Go to group diff page
                    </Button>
                  </Link>
                  }
                </>)}
          <>
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
                <DatePickerBar sinceTime={sinceTime} untilTime={untilTime} setSinceTime={setSinceTime} setUntilTime={setUntilTime}/>
                <GroupsStatsList
                  courseGroupsBB={courseGroupsBB}
                  courseGroupsGit={courseGroupsGit}
                  courseId={courseId}
                  sinceTime={sinceTime}
                  term={term}
                  untilTime={untilTime}
                />
              </Grid>
            </Grid>
            <Link href={`/courses/${term}/${courseId}/groups/delete`} passHref>
              <Button
                variant="contained"
                color="primary"
              >
                Delete groups on Blackboard
              </Button>
            </Link>
            <Link href={`/courses/${term}/${courseId}/git/groups/delete`} passHref>
              <Button
                variant="contained"
                color="primary"
              >
                Delete groups on Gitlab
              </Button>
            </Link>
            <Link href={`/courses/${term}/${courseId}/groups/diff`} passHref>
              <Button
                variant="contained"
                color="primary"
              >
                Edit groups
              </Button>
            </Link>
          </>
        </Grid>
      </Grid>
    </>
  )
}

export const getServerSideProps = (async (context) => {
  const params = context.params

  const courseGroupsBB = await getCourseGroups(context.req, params)

  console.log(courseGroupsBB.length)

  const courseGroupsGit = (await GetGroups(context.req, params)).subGroups

  console.log(courseGroupsGit.length)

  const bbGitConnection = await getBBGitConnection(context.req, params)

  if (!courseGroupsBB || !bbGitConnection) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: { courseGroupsBB, courseGroupsGit, bbGitConnection },
  }
})


export default withAuth(Group)