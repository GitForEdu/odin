import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import { Button, TextField } from "@material-ui/core"
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
    const data = await fetcher(
      `/api/courses/${term}/${courseId}/git/createConnection`,
      {
        gitURL: gitURL,
        pat: pat,
      }
    )
    setLoading(false)

    if (data.courseId) {
      router.push(`/courses/${term}/${courseId}`)
    }
  }

  const createConnectionAndrepo = async () => {
    setLoading(true)
    const data = await fetcher(
      `/api/courses/${term}/${courseId}/git/createConnectionAndRepo`,
      {
        gitURL: gitURL,
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
        id="GitURL"
        label="GitURL"
        value={gitURL}
        onChange={handleChangeGitURL}
      />
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
        onClick={createConnection}
        disabled={gitURL === "" || pat === "" || loading}
      >
              Create GitConnection
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={createConnectionAndrepo}
        disabled={gitURL === "" || pat === "" || loading}
      >
              Create GitConnection And create Git Repo
      </Button>
    </>
  )
}

export default withAuth(CreateGit)