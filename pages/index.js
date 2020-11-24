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
        <Link href="/dashboard">Hei</Link>
        <h1>Welcome!</h1>
        <p>This a teaching tool for staff at the Norwegian University of Science and Technology (NTNU)</p>
        <Button
          variant="contained"
          color="primary"
          onClick={() => signIn("dataporten", {
            callbackUrl: "/dashboard",
          })}
        >
          Log in with Feide
        </Button>
      </Tile>
    </>
  )
}