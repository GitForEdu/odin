import { useMediaQuery } from "@material-ui/core"
import { useRouter } from "next/router"

const getPageStyle = bigScreen => {
  const baseStyle = {
    paddingTop: "1rem",
    paddingBottom: "2rem",
  }
  if (bigScreen) {
    return ({
      ...baseStyle,
      paddingLeft: "20%",
      paddingRight: "20%",
    })
  }
  else {
    return ({
      ...baseStyle,
    })
  }
}

const PagePadder = ({ children }) => {
  const matches = useMediaQuery("(min-width:1300px)")

  return (
    <div style={getPageStyle(matches)}>
      {children}
    </div>
  )
}

export default PagePadder