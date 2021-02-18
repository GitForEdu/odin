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
  courseUsers.push({
    availability: { available: "Yes" },
    avatar: { viewUrl: "https://ntnu-saastest.blackboard.com/public/v1/users/_105_1/avatar", source: "Default" },
    courseId: "_57_1",
    courseRoleId: "Student",
    created: "2020-12-04T13:48:31.915Z",
    dataSourceId: "_2_1",
    educationLevel: "Unknown",
    gender: "Unknown",
    id: "_999_1",
    institutionRoleIds: ["STUDENT"],
    lastAccessed: "2021-02-18T12:21:53.762Z",
    modified: "2020-12-04T13:48:31.915Z",
    name: { given: "Petter Grø", family: "Rein" },
    systemRoleIds: ["User"],
    userId: "_105_1",
    userName: "pettegre",
  })
  // console.log("getserversideprops students", courseUsers)

  const groupMembers = await getGroupMembersFromGitlab(context.req, params)
  // console.log("getserversideprops groupmembers", groupMembers)

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
