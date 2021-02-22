import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { useState } from "react"
import fetcher from "utils/fetcher"
import { Button, TextField } from "@material-ui/core"


const AddGitPat = () => {
  const router = useRouter()
  const { term, courseId } = router.query
  const [pat, setPat] = useState("")
  const [loading, setLoading] = useState(false)


  const handleChangePat = event => {
    setPat(event.target.value)
  }

  const addPath = async () => {
    setLoading(true)
    const data = await fetcher(
      `/api/courses/${term}/${courseId}/git/addPAT`,
      {
        pat: pat,
      }
    )
    setLoading(false)

    if (data.courseId) {
      router.push(`/courses/${term}/${courseId}`)
    }

    if (data.error) {
      console.log(data.error)
      router.push(`/courses/${term}/${courseId}`)
    }
  }


  return (
    <>
      <TextField
        variant="outlined"
        color="primary"
        id="pat"
        label="pat"
        value={pat}
        onChange={handleChangePat}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={addPath}
        disabled={pat === "" || loading}
      >
              Add Git PAT
      </Button>
    </>
  )
}

export default withAuth(AddGitPat)