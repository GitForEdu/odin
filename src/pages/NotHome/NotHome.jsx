import React from "react"
import Tile from "components/Tile"
import Link from "components/Link"
import Navbar from "components/Navbar"

export const NotHome = () => (
  <>
    <Navbar courseCode="TDT6969" pageTitle="Nothome" />
    <Tile>
      <h1>Dette er ikke hjem</h1>
      <Link link={"home"} text={"link to home"}/>
    </Tile>
  </>
)