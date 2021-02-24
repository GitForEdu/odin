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
      <h1>Students only in GitLab (should be empty)</h1>
      {users.gitlab && <List type="students" elements={users.gitlab} />}
      <h1>Students both in Blackboard and GitLab</h1>
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
    courseId: "_56_1",
    courseRoleId: "Student",
    created: "2020-12-04T13:47:11.996Z",
    dataSourceId: "_2_1",
    id: "_999_1",
    modified: "2020-12-04T13:47:11.996Z",
    notInGitlab: true,
    userId: "_105_1",
    user: {
      availability: { available: "Yes" },
      avatar: { viewUrl: "https://ntnu-saastest.blackboard.com/public/v1/users/_70_1/avatar", source: "Default" },
      created: "2020-12-04T13:35:33.923Z",
      educationLevel: "Unknown",
      gender: "Unknown",
      id: "_70_1",
      modified: "2021-02-19T11:22:24.954Z",
      name: { given: "Petter Grø", family: "Rein" },
      userName: "pettegre",
    },
  })

  console.log("getserversideprops 1st student", courseUsers[0])

  let groupMembers = await getGroupMembersFromGitlab(context.req, params)
  if (groupMembers.message) {
    console.log(groupMembers.message)
  }
  console.log("getserversideprops groupmembers", groupMembers)

  const initialUsers = {
    blackboard: courseUsers,
    gitlab: groupMembers ? groupMembers : [],
    both: [],
  }

  if (!groupMembers.message) {
    // This block should probably be refactored
    // Add users present in both Gitlab and Blackboard to bothlist
    const usersPresentInBoth = initialUsers.gitlab.filter(gitlabUser => initialUsers.blackboard.find(blackboardUser => blackboardUser.user.userName === gitlabUser.userName))
    initialUsers.both = usersPresentInBoth
    // Remove users in both from GitLab list
    initialUsers.gitlab = initialUsers.gitlab.filter(gitlabUser => usersPresentInBoth.find(bothUser => (gitlabUser.userName === bothUser.userName) === false))
    initialUsers.blackboard = initialUsers.blackboard.filter(blackboardUser => usersPresentInBoth.find(bothUser => (blackboardUser.user.userName === bothUser.userName) === false))
  }

  if (!courseUsers) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  if (initialUsers.blackboard.length > 0) initialUsers.blackboard.forEach(student => student.notInGitlab = true)

  if (groupMembers.message) initialUsers.gitlab = []

  return {
    props: { initialUsers },
  }
})

export default withAuth(Students)
