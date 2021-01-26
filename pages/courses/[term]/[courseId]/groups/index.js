import Navbar from "components/Navbar"
import List from "components/List"
import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import { useState } from "react"
import { CSVReader } from "react-papaparse"

export const Group = ({ courseGroups }) => {
  const router = useRouter()
  const { courseId, term } = router.query
  const [files, setFiles] = useState({
    groups: null,
    groupMembers: null,
  })

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

  console.log(files)

  return (
    <>
      <Navbar pageTitle={"All students"} courseId={courseId} term={term} />
      <List type="groups" elements={courseGroups}/>
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
    </>
  )
}

export const getServerSideProps = (async (context) => {
  const params = context.params

  const courseGroups = await getCourseGroups(context.req, params)

  if (!courseGroups) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: { courseGroups },
  }
})


export default withAuth(Group)