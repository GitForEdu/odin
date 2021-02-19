import withAuth from "components/withAuth"
import { getCourseGroups } from "pages/api/courses/[term]/[courseId]/groups"
import fetcher from "utils/fetcher"
import { ListDelete } from "components/List"
import { useState } from "react"
import { useRouter } from "next/router"


export const GroupSet = ({ courseGroupSet }) => {
  const router = useRouter()
  const { courseId, term } = router.query
  const [loading, setLoading] = useState(false)
  const [groups, setGroups] = useState(courseGroupSet)

  const deleteElm = async (elm) => {
    setLoading(true)
    const data = await fetcher(
      `/api/courses/${term}/${courseId}/blackboard/deleteGroup`,
      {
        group: elm,
      }
    )
    setLoading(false)
    console.log("delete groupset bb", data)
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

  const courseGroupSet = (await getCourseGroups(context.req, params)).filter(group => group.isGroupSet)


  if (!courseGroupSet) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: { courseGroupSet },
  }
})


export default withAuth(GroupSet)