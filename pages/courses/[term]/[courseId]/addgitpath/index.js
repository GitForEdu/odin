import withAuth from "components/withAuth"
import { useRouter } from "next/router"
import StyledButton from "components/Button"
import { StyledInputField } from "components/TextField"
import { useState } from "react"
import fetcher from "utils/fetcher"


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
      `/api/courses/${term}/${courseId}/addgitpath`,
      {
        pat: pat,
      }
    )
    setLoading(false)

    if (data.courseId) {
      router.push(`/courses/${term}/${courseId}`)
    }
  }


  return (
    <>
      <StyledInputField
        id="pat"
        label="pat"
        value={pat}
        onChange={handleChangePat}
      />
      <StyledButton
        onClick={addPath}
        disabled={pat === "" || loading}
      >
              Add Git PAT
      </StyledButton>
    </>
  )
}

export default withAuth(AddGitPat)