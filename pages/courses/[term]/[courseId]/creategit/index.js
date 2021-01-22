import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { Button } from "@material-ui/core"
import TextField from "@material-ui/core/TextField"
import { useState } from "react"
import fetcher from "utils/fetcher"


const CreateGit = () => {
  const router = useRouter()
  const { term, courseId } = router.query
  const [gitURL, setGitURL] = useState("")
  const [pat, setPat] = useState("")
  const [loading, setLoading] = useState(false)


  const handleChangeGitURL = event => {
    setGitURL(event.target.value)
  }

  const handleChangePat = event => {
    setPat(event.target.value)
  }

  const createConnection = async () => {
    setLoading(true)
    const { data } = await fetcher(
      `/api/courses/${term}/${courseId}/git`,
      {
        gitURL: gitURL,
        pat: pat,
      }
    )
    setLoading(false)
  }


  return (
    <>
      <TextField
        id="GitURL"
        label="GitURL"
        value={gitURL}
        onChange={handleChangeGitURL}
      />
      <TextField
        id="pat"
        label="pat"
        value={pat}
        onChange={handleChangePat}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={createConnection}
        disabled={gitURL === "" || pat === "" || loading}
      >
              Create GitConnection
      </Button>
    </>
  )
}

export default withAuth(CreateGit)