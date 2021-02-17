import withAuth from "components/withAuth"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import fetcher from "utils/fetcher"
import { ListDelete } from "components/List"
import { useState } from "react"
import { useRouter } from "next/router"


export const Group = ({ courseGroups }) => {
  const router = useRouter()
  const { courseId, term } = router.query
  const [loading, setLoading] = useState(false)

  const deleteElm = async (elm) => {
    setLoading(true)
    const data = await fetcher(
      `/api/courses/${term}/${courseId}/blackboard/deleteGroup`,
      {
        group: elm,
      }
    )
    setLoading(false)
    console.log("delete group bb", data)
    if (data === 204) {
      router.push(`/courses/${term}/${courseId}/groups/delete`)
    }
  }


  return (
    <ListDelete elements={courseGroups} deleteFunc={deleteElm} disabled={loading}>

    </ListDelete>
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