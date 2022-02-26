const sensorFn = new Object(null)

sensorFn.FRAME = function(appearances, efficiency) {
    let len = 4000
    if (appearances[0].length < 30) {
        len = 1000
    }
    let frame = Array.from({length: len}, () => String.fromCharCode(Math.floor(Math.random() * 94) + 32))

    if (efficiency > Math.round(Math.random() * 99)) {
        const people = appearances.length
        const order = Array.from(Array(people).keys()).sort(() => (Math.random() > .5) ? 1:-1)

        for (let i = 0; i < people; i++) {
            const frame_positions = Math.floor(Math.random() * frame.length)
            const person = order[i]
            for (let j = 0; j < appearances[person].length; j++) {
                frame[frame_positions + j] = appearances[person][j]
            }
        }
    }

    return frame.slice(0,len).join('')
}

export default Object.freeze(sensorFn)