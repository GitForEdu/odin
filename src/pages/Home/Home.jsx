import React from "react"
import Tile from "components/Tile"
import Link from "components/Link"

const Home = () => (
  <Tile>
    <h1>Velkommen hjem</h1>
    <Link link={"nothome"} text={"link to nothome"}/>
  </Tile>
)

export default Home