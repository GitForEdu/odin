export const Activity = props => {
  const { data } = props

  return (
    <section style={{
      display: "grid",
      gridTemplateRows: "repeat(4, 1em)",
      gridTemplateColumns: "repeat(7, 1em)",
      gap: "2px",
    }}>
      {data.map((digit, index) => {
        if (digit === 0) return <WhiteBox key={index} />
        if (digit === 1) return <LightGrayBox key={index} />
        if (digit === 2) return <GrayBox key={index} />
        if (digit === 3) return <DarkGrayBox key={index} />
        return <DarkGrayBox key={index} />
      } )}
    </section>
  )
}

const WhiteBox = () => (
  <div style={{
    width: "1em",
    height: "1em",
    backgroundColor: "white",
  }} />
)

const LightGrayBox = () => (
  <div style={{
    width: "1em",
    height: "1em",
    backgroundColor: "lightgray",
  }} />
)

const GrayBox = () => (
  <div style={{
    width: "1em",
    height: "1em",
    backgroundColor: "gray",
  }} />
)

const DarkGrayBox = () => (
  <div style={{
    width: "1em",
    height: "1em",
    backgroundColor: "darkgray",
  }} />
)

export default Activity