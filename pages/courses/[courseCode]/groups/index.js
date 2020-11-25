import Navbar from "components/Navbar"
import List from "components/List"
import withAuth from "components/withAuth"
import { useRouter } from "next/router"

export const Group = () => {
  const router = useRouter()
  const { courseCode } = router.query

  return (
    <>
      <Navbar pageTitle={"All students"} courseCode={courseCode} />
      <List type="students" />
    </>
  )
}


export default withAuth(Group)