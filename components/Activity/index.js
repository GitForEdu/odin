import { Grid } from "@material-ui/core"

export const Activity = props => {
  const { data } = props

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      item
      xs={12}
    >
      {data.map((digit, index) => {
        if (digit === 0) return <WhiteBox key={index} />
        if (digit === 1) return <LightGrayBox key={index} />
        if (digit === 2) return <GrayBox key={index} />
        if (digit === 3) return <DarkGrayBox key={index} />
        return <DarkGrayBox key={index} />
      } )}
    </Grid>
  )
}

const WhiteBox = () => (
  <Grid
    item
    xs={2}
  >
    <div
      style={{
        height: "1rem",
        width: "1rem",
        backgroundColor: "white",
      }}
    />
  </Grid>
)

const LightGrayBox = () => (
  <Grid
    item
    xs={2}
  >
    <div
      style={{
        height: "1rem",
        width: "1rem",
        backgroundColor: "lightgray",
      }}
    />
  </Grid>
)

const GrayBox = () => (
  <Grid
    item
    xs={2}
  >
    <div
      style={{
        height: "1rem",
        width: "1rem",
        backgroundColor: "gray",
      }}
    />
  </Grid>
)

const DarkGrayBox = () => (
  <Grid
    item
    xs={2}
  >
    <div
      style={{
        height: "1rem",
        width: "1rem",
        backgroundColor: "darkgray",
      }}
    />
  </Grid>
)

export default Activity