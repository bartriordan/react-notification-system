export default {
  Timer(callback, delay) {
    let timerId
    let start
    let remaining = delay

    this.clear = () => clearTimeout(timerId)
    this.pause = () => {
      clearTimeout(timerId)
      remaining -= new Date() - start
    }
    this.resume = () => {
      start = new Date()
      clearTimeout(timerId)
      timerId = setTimeout(callback, remaining)
    }

    this.resume()
  }
}
