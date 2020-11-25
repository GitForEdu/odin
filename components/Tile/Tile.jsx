import { useStyles } from "./useStyles"

const Tile = ({ children }) => {
  const classes = useStyles()

  return (
    <section className={classes.flexTile}>
      {children}
    </section>
  )
}

export default Tile