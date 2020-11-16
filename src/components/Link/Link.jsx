import { Link as RouterLink } from "react-router-dom"

export const Link = (props) => {
  const { link, text } = props

  return (
    <RouterLink to={link}>
      <button type="button">
        { text }
      </button>
    </RouterLink>)
}