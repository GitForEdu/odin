import Navbar from "components/Navbar"
import List from "components/List"
import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"


export const Group = ({ courseGroups }) => {
  const router = useRouter()
  const { courseId, term } = router.query

  return (
    <>
      <Navbar pageTitle={"All students"} courseId={courseId} term={term} />
      <List type="groups" elements={courseGroups}/>
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