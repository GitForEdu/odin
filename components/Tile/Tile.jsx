import { useStyles } from "./useStyles"

const Tile = (props) => {
  const classes = useStyles()
  const { children } = props
  return (
    <section className={classes.flexTile}>
      {children}
    </section>
  )
}

export default Tile