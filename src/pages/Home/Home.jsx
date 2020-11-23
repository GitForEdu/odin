import React, { useEffect, useState } from "react"
import Tile from "components/Tile"
import Link from "components/Link"
import Navbar from "components/Navbar"

import { UserInfo } from "API/UserService"
import { useAuth0 } from "../../utils/authentication"

const Home = () => {
  const [userInfo, setUserInfo] = useState()
  const { getTokenSilently, getIdTokenClaims } = useAuth0()

  useEffect(() => {
    getIdTokenClaims().then(id_token => {
      getTokenSilently().then(access_token => {
        UserInfo(id_token.__raw, access_token).then(userInfo => {
          setUserInfo(userInfo)
        })
      })
    })
  }, [getIdTokenClaims, getTokenSilently])

  return (
    userInfo
      ? <>
        <Navbar pageTitle={"Dashboard"} courseCode="TDT6969" />
        <Tile>
          <h1>Velkommen hjem, {userInfo.name}</h1>
          <h2>Username: {userInfo.username}</h2>
          <Link link={"nothome"} text={"link to nothome"}/>
        </Tile>
      </>
      : null
  )
}

export default Home