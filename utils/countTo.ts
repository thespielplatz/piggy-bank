interface CountToOptions {
  endValue: number
  duration: number // duration in milliseconds
  ref: Ref<number>
}

export default (options: CountToOptions) => {
  const { endValue, duration } = options

  const start = 0 // Start counting from 0
  const range = endValue - start
  const startTime = performance.now()

  const animate = (currentTime: number) => {
    const elapsedTime = currentTime - startTime
    const progress = Math.min(elapsedTime / duration, 1) // Progress between 0 and 1
    const currentNumber = Math.floor(start + range * progress)

    options.ref.value = currentNumber

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}