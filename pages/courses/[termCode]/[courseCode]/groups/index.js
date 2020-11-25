import Navbar from "components/Navbar"
import List from "components/List"
import withAuth from "components/withAuth"
import { useRouter } from "next/router"

export const Group = () => {
  const router = useRouter()
  const { courseCode, termCode } = router.query

  return (
    <>
      <Navbar pageTitle={"All students"} courseCode={courseCode} termCode={termCode} />
      <List type="groups" />
    </>
  )
}


export default withAuth(Group)