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
  const [groups, setGroups] = useState(courseGroups)

  const deleteElm = async (elm) => {
    setLoading(true)
    const data = await fetcher(
      `/api/courses/${term}/${courseId}/blackboard/group`,
      {
        group: elm,
      },
      "DELETE"
    )
    setLoading(false)
    console.log("delete group bb", data)
    if (data === 204) {
      const index = groups.findIndex(group => group.id === elm.id)
      groups.splice(index, 1)
      setGroups([ ...groups])
    }
  }


  return (
    <ListDelete elements={groups} deleteFunc={deleteElm} disabled={loading}>

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