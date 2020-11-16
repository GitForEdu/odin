import Tile from "../../components/Tile"
import Link from "../../components/Link"
import { Button } from "@material-ui/core"
import history from "../../utils/history"

export const Login = () => {

  const onClick = () => {
    console.log("go Home")
    history.push("home")
  }


  return (
    <Tile>
      <h1>Dette er login</h1>
      <Button variant="contained" color="primary" onClick={onClick}>Login</Button>
    </Tile>
  )
}