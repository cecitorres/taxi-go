export default (seconds) => {
    var seconds = parseInt(seconds, 10)
    var hours = Math.floor(seconds / 3600)
    var minutes = Math.floor((seconds - (hours * 3600)) / 60)
    var seconds = seconds - (hours * 3600) - (minutes * 60)
    if (!!hours) {
        if (!!minutes) {
            return `${hours}h ${minutes}m ${seconds}s`
        } else {
            return `${hours}h ${seconds}s`
        }
    }
    if (!!minutes) {
        return `${minutes}m ${seconds}s`
    }
    return `${seconds}s`
}