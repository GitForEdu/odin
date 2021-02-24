import withAuth from "components/withAuth"
import { GetGroups } from "pages/api/courses/[term]/[courseId]/git/getGroups"
import fetcher from "utils/fetcher"
import { ListDelete } from "components/List"
import { useState } from "react"
import { useRouter } from "next/router"


export const Group = ({ gitGroups }) => {
  const router = useRouter()
  const { courseId, term } = router.query
  const [loading, setLoading] = useState(false)
  const [groups, setGroups] = useState(gitGroups)

  const deleteElm = async (elm) => {
    setLoading(true)
    const data = await fetcher(
      `/api/courses/${term}/${courseId}/git/deleteGroup`,
      {
        groupId: elm.id,
      }
    )
    setLoading(false)
    console.log("delete group gitlab", data)
    // if (data === 204) {
    //   const index = groups.findIndex(group => group.id === elm.id)
    //   groups.splice(index, 1)
    //   setGroups([ ...groups])
    // }
  }

  return (
    (groups.length > 1)
      && (
        <>
          <ListDelete elements={[groups]} deleteFunc={deleteElm} disabled={loading}>

          </ListDelete>
          <ListDelete elements={groups.subGroups} deleteFunc={deleteElm} disabled={loading}>

          </ListDelete>
        </>)
  )
}


export const getServerSideProps = (async (context) => {
  const params = context.params

  const gitGroups = (await GetGroups(context.req, params))

  if (!gitGroups) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: { gitGroups },
  }
})


export default withAuth(Group)