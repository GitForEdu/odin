export const Activity = () => {
  const activityData = [
    [0, 1, 2, 3, 4, 5, 4],
    [0, 2, 2, 0, 0, 1, 0],
    [1, 2, 4, 5, 6, 1, 0],
  ]

  const whiteBox = (
    <div style={{
      width: "1em",
      height: "1em",
      backgroundColor: "white",
    }} />
  )
  return (
    <section style={{
      display: "grid",
      gridTemplateRows: "repeat(4, 1em)",
      gridTemplateColumns: "repeat(7, 1em)",
      gap: "2px",
    }}>

      <div style={{
        width: "1em",
        height: "1em",
        backgroundColor: "lightgray",
      }} />
      <div style={{
        width: "1em",
        height: "1em",
        backgroundColor: "darkgray",
      }} />
      <div style={{
        width: "1em",
        height: "1em",
        backgroundColor: "white",
      }} />
      <div style={{
        width: "1em",
        height: "1em",
        backgroundColor: "lightgray",
      }} />
      <div style={{
        width: "1em",
        height: "1em",
        backgroundColor: "darkgray",
      }} />
    </section>
  )
}

export default Activity