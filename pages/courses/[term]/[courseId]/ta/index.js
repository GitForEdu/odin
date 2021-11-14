import Navbar from "components/Navbar"
import StudentList from "components/List/StudentList"
import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { getCourseUsers } from "pages/api/courses/[term]/[courseId]/users"
import { useState } from "react"
import { getBBGitConnection } from "pages/api/courses/[term]/[courseId]/git/createConnection"
import { Grid } from "@mui/material"


export const TAs = ({ initialTAs }) => {
  const router = useRouter()
  const { courseId, term } = router.query
  const [tas, setTAs] = useState(initialTAs)

  return (
    <>
      <Navbar pageTitle={"All TA's"} courseId={courseId} term={term} />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <h1>TA&apos;s</h1>
        {tas && <StudentList elements={tas} />}
      </Grid>
    </>

  )
}

export const getServerSideProps = (async (context) => {
  const params = context.params

  const bbGitConnection = await getBBGitConnection(context.req, params)

  const initialTAs = (await getCourseUsers(context.req, params)).filter(user => user.courseRoleId === "TeachingAssistant")

  if (!initialTAs) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: { initialTAs, bbGitConnection },
  }
})

export default withAuth(TAs)
