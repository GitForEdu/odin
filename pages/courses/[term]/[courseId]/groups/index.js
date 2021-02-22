import Navbar from "components/Navbar"
import List from "components/List"
import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import { useState } from "react"
import fetcher from "utils/fetcher"
import { Button } from "@material-ui/core"
import Link from "next/link"


export const Group = ({ courseGroups }) => {
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
      <Navbar pageTitle={"All students"} courseId={courseId} term={term} />
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
        : <List type="groups" elements={courseGroups}/>}
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
        <Button
          variant="contained"
          color="primary"
          onClick={createSubGroups}
          disabled={loadingCreateSubGroups}
        >
        Create groups on GitLab
        </Button>
      </>}

      {courseGroups && (
        <section>
          <h1>Groups</h1>
          <ul>
            {courseGroups.map(group =>
              <li key={group.code}>
                <h1>Group {group.code} - {group.title}</h1>
                {(group.members.length)
                  ? (<table>
                    <thead>
                      <tr>
                        <th>User name</th>
                        <th>First name</th>
                        <th>Last name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.members.map(groupMember =>
                        <tr key={groupMember.userName}>
                          <td>{groupMember.userName}</td>
                          <td>{groupMember.firstName}</td>
                          <td>{groupMember.lastName}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>)
                  : <p>No group members</p>
                }
              </li>
            )}
          </ul>
        </section>
      )}
    </>
  )
}

export const getServerSideProps = (async (context) => {
  const params = context.params

  const courseGroups = await getCourseGroups(context.req, params)

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