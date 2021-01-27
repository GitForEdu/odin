import Navbar from "components/Navbar"
import List from "components/List"
import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import { useState, useEffect } from "react"
import { CSVReader } from "react-papaparse"
import fetcher from "utils/fetcher"
import StyledButton from "components/Button"


export const Group = ({ courseGroups }) => {
  const router = useRouter()
  const { courseId, term } = router.query
  const [files, setFiles] = useState({
    groups: null,
    groupMembers: null,
  })
  const [groupData, setGroupData] = useState({
    loading: true,
    groups: null,
  })
  const [loadingCreateSubGroups, setLoadingCreateSubGroups] = useState(false)

  const handleGroups = filedata => {
    setFiles({
      ...files,
      groups: filedata,
    })
  }

  const handleGroupMembers = filedata => {
    setFiles({
      ...files,
      groupMembers: filedata,
    })
  }

  const createSubGroups = async () => {
    let groups = courseGroups
    if (groupData.groups && groupData.groups.length !== 0) {
      groups = groupData.groups
    }
    if (groups && groups.length !== 0) {
      setLoadingCreateSubGroups(true)
      const data = await fetcher(
        `/api/courses/${term}/${courseId}/git/createSubGroups`,
        {
          groups: groups,
        }
      )
      setLoadingCreateSubGroups(false)
      console.log(data)
      if (data.courseId) {
        router.push(`/courses/${term}/${courseId}`)
      }
    }
  }

  useEffect(() => {
    console.log("Filendring:", files)
    if (!files.groups || !files.groupMembers) {
      console.log("Mangler groups eller groupMembers")
      return
    }

    const newGroups = []
    files.groups.forEach(group => {
      group.data["Group Code"]
        ? newGroups.push({
          code: group.data["Group Code"],
          title: group.data["Title"],
          description: group.data["Description"],
          groupSet: group.data["Group Set"],
          available: group.data["Available"] === "J" ? true : false,
          selfEnroll: (group.data["Self Enroll"] === "J" ? true : false),
          maxEnrollment: group.data["Max Enrollment"],
          members: [],
        })
        : console.log("Fant ugyldig gruppe:", group.data)
    })

    files.groupMembers.forEach(user => {
      if (user.data["Group Code"]) {
        const foundGroup = newGroups.find(group => group.code === user.data["Group Code"])
        foundGroup.members.push({
          userName: user.data["User Name"],
          firstName: user.data["First Name"],
          lastName: user.data["Last Name"],
        })
      }
    })

    console.log("Finished groups ", newGroups)
    setGroupData({
      groups: newGroups,
      loading: false,
    })
  }, [files])

  return (
    <>
      <Navbar pageTitle={"All students"} courseId={courseId} term={term} />
      {courseGroups.length === 0 ? <h1>No groups found on Blackboard</h1> : <List type="groups" elements={courseGroups}/>}
      <CSVReader
        onDrop={handleGroups}
        noDrag
        style={{}}
        config={{ header: true }}
        addRemoveButton
      >
        <span>Click to upload group info CSV with data headers</span>
      </CSVReader>

      <CSVReader
        onDrop={handleGroupMembers}
        noDrag
        style={{}}
        config={{ header: true }}
        addRemoveButton
      >
        <span>Click to upload group members CSV with data headers</span>
      </CSVReader>
      {((courseGroups && courseGroups.length !== 0) || groupData.groups && groupData.groups.length !== 0) &&<StyledButton
        onClick={createSubGroups}
        disabled={loadingCreateSubGroups}
      >
        Create groups on GitLab
      </StyledButton>}
      {groupData.loading && <h1>Please upload CSV files from Blackboard to see groups</h1>}

      {groupData.groups && (
        <section>
          <h1>Groups</h1>
          <ul>
            {groupData.groups.map(group =>
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