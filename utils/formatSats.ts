export default (sats: number) => {
  return (sats / 100_000_000).toFixed(8).padEnd(10, '0')
}
