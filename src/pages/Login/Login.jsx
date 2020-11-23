import Tile from "components/Tile"
import { Button } from "@material-ui/core"
import history from "utils/history"
import Navbar from "components/Navbar"

export const Login = () => {
  const onClick = () => {
    console.log("go Home")
    history.push("home")
  }

  return (
    <>
      <Navbar courseCode={"TDT6969"} pageTitle="Log in" />
      <Tile>
        <h1>Dette er login</h1>
        <Button variant="contained" color="primary" onClick={onClick}>Login</Button>
      </Tile>
    </>
  )
}