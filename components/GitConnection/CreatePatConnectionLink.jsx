import Link from "@material-ui/core/Link"
import Button from "@material-ui/core/Button"
import { useRouter } from "next/router"

const CreateGitConnectionLink = () => {
  const router = useRouter()
  const { term, courseId } = router.query

  return (
    <Link href={`/courses/${term}/${courseId}/addgitpath`} passHref>
      <Button
        variant="contained"
        color="primary"
      >
              Add your Git PAT
      </Button>
    </Link>
  )
}

export default CreateGitConnectionLink