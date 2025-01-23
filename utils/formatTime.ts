export default (timestamp?: number) => {
  let date: Date

  if (timestamp) {
    const isMilliseconds = timestamp > 9999999999
    date = new Date(isMilliseconds ? timestamp : timestamp * 1000)
  } else {
    date = new Date()
  }
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}.${month}.${year} ${hours}:${minutes}`
}
