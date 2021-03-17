import Navbar from "components/Navbar"
import GroupList from "components/List/GroupList"
import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import { useState } from "react"
import fetcher from "utils/fetcher"
import { Button, TextField } from "@material-ui/core"
import Link from "next/link"
import { GetGroups, GetGroupsKeyStats } from "pages/api/courses/[term]/[courseId]/git/groups"
import DateTimePicker from "@material-ui/lab/DateTimePicker"


export const Group = ({ courseGroups, bbGitConnection }) => {
  const router = useRouter()
  const { courseId, term } = router.query
  const [sinceTime, setSinceTime] = useState(new Date(0))
  const [untilTime, setUntilTime] = useState(new Date((new Date()).valueOf() + 86400000))
  const [loadingCreateSubGroups, setLoadingCreateSubGroups] = useState(false)


  const createSubGroups = async () => {
    if (courseGroups && courseGroups.length !== 0) {
      setLoadingCreateSubGroups(true)
      const data = await fetcher(
        `/api/courses/${term}/${courseId}/git/createSubGroups`,
        {
          groups: courseGroups,
        }
      )
      setLoadingCreateSubGroups(false)
      // console.log(data)
      if (data.courseId) {
        router.push(`/courses/${term}/${courseId}`)
      }
    }
  }

  return (
    <>
      <Navbar pageTitle={"All groups"} courseId={courseId} term={term} />
      {courseGroups.length === 0
        ? <>
          <h1>No groups found on Blackboard</h1>
          <Link href={`/courses/${term}/${courseId}/groups/create`} passHref>
            <Button
              variant="contained"
              color="primary"
            >
              Go to group creation page
            </Button>
          </Link></>
        : <>
          <DateTimePicker
            renderInput={(props) =>
              <TextField
                {...props}
                margin="normal"
                helperText=""
              />}
            label="DateTimePicker"
            value={sinceTime}
            onChange={(newValue) => {
              setSinceTime(newValue)
            }}
          />
          <DateTimePicker
            renderInput={(props) =>
              <TextField
                {...props}
                margin="normal"
                helperText=""
              />}
            label="DateTimePicker"
            value={untilTime}
            onChange={(newValue) => {
              setUntilTime(newValue)
            }}
          />
          <GroupList type="groups" elements={courseGroups}/>
        </>}
      {(courseGroups && courseGroups.length !== 0)
      && <>
        <Link href={`/courses/${term}/${courseId}/groups/delete`} passHref>
          <Button
            variant="contained"
            color="primary"
            onClick={createSubGroups}
            disabled={loadingCreateSubGroups}
          >
        Delete groups on Blackboard
          </Button>
        </Link>
        <Link href={`/courses/${term}/${courseId}/groupset/delete`} passHref>
          <Button
            variant="contained"
            color="primary"
            onClick={createSubGroups}
            disabled={loadingCreateSubGroups}
          >
        Delete groupset on Blackboard
          </Button>
        </Link>
        {bbGitConnection.pat
        && <Button
          variant="contained"
          color="primary"
          onClick={createSubGroups}
          disabled={loadingCreateSubGroups}
        >
        Create groups on GitLab
        </Button>}
      </>}
    </>
  )
}

export const getServerSideProps = (async (context) => {
  const params = context.params

  let courseGroupsBB = await getCourseGroups(context.req, params)

  let courseGroupsGit = (await GetGroups(context.req, params)).subGroups

  let groupKeyStats = await GetGroupsKeyStats(context.req, params, courseGroupsGit.map(group => group.full_path))

  const bbGitConnection = await getBBGitConnection(context.req, params)

  if (!courseGroupsBB || !bbGitConnection) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  let courseGroups = courseGroupsBB.map(group => {
    const groupGitInfo = groupKeyStats.find(groupGit => groupGit.name === group.name)
    return { ...groupGitInfo, ...group }
  })

  return {
    props: { courseGroups, bbGitConnection },
  }
})


export default withAuth(Group)