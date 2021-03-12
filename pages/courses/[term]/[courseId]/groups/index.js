import Navbar from "components/Navbar"
import GroupList from "components/List/GroupList"
import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import { useState } from "react"
import fetcher from "utils/fetcher"
import { Button } from "@material-ui/core"
import Link from "next/link"


export const Group = ({ courseGroups, bbGitConnection }) => {
  const router = useRouter()
  const { courseId, term } = router.query

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
        : <GroupList type="groups" elements={courseGroups}/>}
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

  let courseGroups = await getCourseGroups(context.req, params)

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