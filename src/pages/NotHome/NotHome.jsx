import React from "react"
import Tile from "../../components/Tile"
import Link from "../../components/Link"

export const NotHome = () => (
  <Tile>
    <h1>Dette er ikke hjem</h1>
    <Link link={"home"} text={"link to home"}/>
  </Tile>
)