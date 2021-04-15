const formatDate = (dateString) => {

  const date = new Date(dateString)
  if (date.getDate()) {
    return `${date.getUTCFullYear()}.${date.getUTCMonth() + 1}.${date.getUTCDate()} - ${date.getUTCHours()}:${date.getUTCMinutes()}`
  }
  return "No data"
}

export { formatDate }