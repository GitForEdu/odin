import Tile from "components/Tile"
import Navbar from "components/Navbar"
import { Button } from "@mui/material"
import { signIn } from "next-auth/react"


export default function LandingPage() {
  return (
    <>
      <Navbar />
      <h1>Welcome!</h1>
      <p>This a teaching tool for staff at the Norwegian University of Science and Technology (NTNU)</p>
      <Button
        variant="contained"
        color="primary"
        onClick={() => signIn("dataporten", {
          callbackUrl: "/courses",
        })}
      >
          Log in with Feide
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => signIn("github", {
          callbackUrl: "/courses",
        })}
      >
          Log in with GitHub
      </Button>
    </>
  )
}