import withAuth from "components/withAuth"
import { GetGroups } from "pages/api/courses/[term]/[courseId]/git/getGroups"
import fetcher from "utils/fetcher"
import { ListDelete } from "components/List"
import { useState } from "react"
import { useRouter } from "next/router"
import Navbar from "components/Navbar"


export const Group = ({ parentRepoWithSubGroups }) => {
  const router = useRouter()
  const { courseId, term } = router.query
  const [loading, setLoading] = useState(false)
  const [parentRepo, setParentRepo] = useState(parentRepoWithSubGroups)
  const [subGroups, setSubGroups] = useState(parentRepoWithSubGroups.subGroups)

  const deleteParentRepo = async (elm) => {
    setLoading(true)
    const data = await fetcher(
      `/api/courses/${term}/${courseId}/git/deleteGroup`,
      {
        groupId: elm.id,
      }
    )
    setLoading(false)
    console.log("delete group gitlab", data)
    if (data.message === "202 Accepted") {
      setParentRepo([])
      setSubGroups([])
    }
  }

  const deleteSubGroup = async (elm) => {
    setLoading(true)
    const data = await fetcher(
      `/api/courses/${term}/${courseId}/git/deleteGroup`,
      {
        groupId: elm.id,
      }
    )
    setLoading(false)
    console.log("delete group gitlab", data)
    if (data.message === "202 Accepted") {
      const index = subGroups.findIndex(group => group.id === elm.id)
      subGroups.splice(index, 1)
      setSubGroups([ ...subGroups])
    }
  }

  return (
    <>
      <Navbar pageTitle={"Delete groups Gitlab"} courseId={courseId} term={term} />
      <h1>Main repo</h1>
      <ListDelete elements={[parentRepo]} deleteFunc={deleteParentRepo} disabled={loading}>

      </ListDelete>
      <h1>Groups in main repo</h1>
      <ListDelete elements={subGroups} deleteFunc={deleteSubGroup} disabled={loading}>

      </ListDelete>
    </>
  )
}


export const getServerSideProps = (async (context) => {
  const params = context.params

  const parentRepoWithSubGroups = (await GetGroups(context.req, params))

  if (parentRepoWithSubGroups.message) {
    return {
      redirect: {
        destination: "/courses",
        permanent: false,
      },
    }
  }

  return {
    props: { parentRepoWithSubGroups },
  }
})


export default withAuth(Group)