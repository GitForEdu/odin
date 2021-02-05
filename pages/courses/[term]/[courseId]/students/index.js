import Navbar from "components/Navbar"
import List from "components/List"
import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { getCourseUsers } from "pages/api/courses/[term]/[courseId]/users"
import { getGroupMembersFromGitlab } from "pages/api/courses/[term]/[courseId]/git/getGroupMembers"


export const Students = ({ courseUsers }) => {
  const router = useRouter()
  const { courseId, term } = router.query

  return (
    <>
      <Navbar pageTitle={"All students"} courseId={courseId} term={term} />
      <List type="students" elements={courseUsers}/>
    </>
  )
}

export const getServerSideProps = (async (context) => {
  const params = context.params

  const courseUsers = await getCourseUsers(context.req, params)

  const groupMembers = await getGroupMembersFromGitlab(context.req, params)
  console.log("getserversideprops students", groupMembers)

  if (!courseUsers) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: { courseUsers },
  }
})

export default withAuth(Students)
