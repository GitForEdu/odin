const List = props => {
  const { type } = props

  if (type === "students") return (
    <h1>Student list</h1>
  )
  if (type === "groups") return (
    <h1>Group list</h1>
  )
}

export default List