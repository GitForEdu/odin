import React from "react"
import Tile from "components/Tile"
import Navbar from "components/Navbar"
import { Button, Grid, useMediaQuery } from "@material-ui/core"
import withAuth from "components/withAuth"
import Link from "next/link"

// import { getCourses } from "pages/api/courses"

const getButtonStyle = bigScreen => {
  const baseStyle = {
    width: "90%",
  }
  if (bigScreen) {
    return ({
      ...baseStyle,
    })
  }
  else {
    return ({
      ...baseStyle,
      width: "30%",
    })
  }
}


const Dashboard = ({ session }) => {
  const matches = useMediaQuery("(max-width:400px)")
  return (
    <>
      <Navbar pageTitle={"Dashboard"} />
      <h1>Hey, {session.name} ({session.username})!</h1>
      <h2>Please select a course:</h2>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        {session.bbUserCourses.map((course) => (
          <Link
            key={course.code + course.term}
            href={`/courses/${course.term}/${course.id}`} passHref>
            <Button
              variant="contained"
              color="primary"
              style={getButtonStyle(matches)}
            >
              {course.id} - {course.name} - {course.term}
            </Button>
          </Link>)
        )}
      </Grid>
    </>
  )
}

// export const getServerSideProps = (async () => {
//   const courseList = await getCourses()

//   if (!courseList) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     }
//   }

//   return {
//     props: { courseList },
//   }
// })

export default withAuth(Dashboard)