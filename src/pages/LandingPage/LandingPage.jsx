import React from "react"
import Tile from "components/Tile"
import Navbar from "components/Navbar"
import { Button } from "@material-ui/core"
import { Link } from "react-router-dom"

export const LandingPage = () => {

  return (
    <>
      <Navbar />
      <Tile>
        <h1>Welcome!</h1>
        <p>This a teaching tool for staff at the Norwegian University of Science and Technology (NTNU)</p>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={"/dashboard"}
        >
          Log in with Feide
        </Button>
      </Tile>
    </>
  )
}