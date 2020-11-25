import Tile from "components/Tile"
import Navbar from "components/Navbar"
import { Button } from "@material-ui/core"
import { signIn } from "next-auth/client"
import Link from "next/link"

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Tile>
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
      </Tile>
    </>
  )
}