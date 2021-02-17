import Navbar from "components/Navbar"
import List from "components/List"
import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { getCourseUsers } from "pages/api/courses/[term]/[courseId]/users"
import { getGroupMembersFromGitlab } from "pages/api/courses/[term]/[courseId]/git/getGroupMembers"


export const Students = ({ courseUsers, groupMembers }) => {
  const router = useRouter()
  const { courseId, term } = router.query

  return (
    <>
      <Navbar pageTitle={"All students"} courseId={courseId} term={term} />
      <h1>Student list from Gitlab</h1>
      <List type="students" elements={groupMembers}/>
      <h1>Mock student list</h1>
      <List type="students" elements={courseUsers}/>
    </>
  )
}

export const getServerSideProps = (async (context) => {
  const params = context.params

  const courseUsers = await getCourseUsers(context.req, params)
  console.log("getserversideprops students", courseUsers)

  const groupMembers = await getGroupMembersFromGitlab(context.req, params)
  console.log("getserversideprops groupmembers", groupMembers)

  if (!courseUsers) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: { courseUsers, groupMembers },
  }
})

export default withAuth(Students)
