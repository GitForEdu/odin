import React from "react"
import Tile from "components/Tile"
import Link from "components/Link"
import Navbar from "components/Navbar"

const Home = () => (
  <>
    <Navbar pageTitle={"Dashboard"} courseCode="TDT6969" />
    <Tile>
      <h1>Velkommen hjem</h1>
      <Link link={"nothome"} text={"link to nothome"}/>
    </Tile>
  </>
)

export default Home