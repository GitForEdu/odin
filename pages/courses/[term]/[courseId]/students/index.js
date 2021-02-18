import Navbar from "components/Navbar"
import List from "components/List"
import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { getCourseUsers } from "pages/api/courses/[term]/[courseId]/users"
import { getGroupMembersFromGitlab } from "pages/api/courses/[term]/[courseId]/git/getGroupMembers"
import { useState, Fragment } from "react"


export const Students = ({ initialUsers }) => {
  const router = useRouter()
  const { courseId, term } = router.query
  const [users, setUsers] = useState(initialUsers)

  return (
    <Fragment>
      <Navbar pageTitle={"All students"} courseId={courseId} term={term} />
      <h1>students only in GitLab (should be empty)</h1>
      {users.gitlab && <List type="students" elements={users.gitlab} />}
      <h1>Students both in Blackboard and Gitlab</h1>
      {users.both && <List type="students" elements={users.both} />}
      <h1>Students only in Blackboard student list</h1>
      {users.blackboard && <List type="students" elements={users.blackboard} />}
    </Fragment>
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

  const initialUsers = {
    blackboard: courseUsers,
    gitlab: groupMembers,
    both: [],
  }

  // The code below should probably be refactored
  // Add users present in both Gitlab and Blackboard to bothlist
  const usersPresentInBoth = initialUsers.gitlab.filter(gitlabUser => initialUsers.blackboard.find(blackboardUser => blackboardUser.userName === gitlabUser.userName))
  initialUsers.both = usersPresentInBoth
  // Remove users in both from GitLab list
  initialUsers.gitlab = initialUsers.gitlab.filter(gitlabUser => usersPresentInBoth.find(bothUser => (gitlabUser.userName === bothUser.userName) === false))
  initialUsers.blackboard = initialUsers.blackboard.filter(blackboardUser => usersPresentInBoth.find(bothUser => (blackboardUser.userName === bothUser.userName) === false))

  if (!courseUsers) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: { initialUsers },
  }
})

export default withAuth(Students)
