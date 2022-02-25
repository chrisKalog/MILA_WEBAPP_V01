import Phone from "./phone.js"
import personFn from "./personFn.js"

let start_V = 0.005

const generatePersonalKey = function () {
    let alpha = new Array(7)
    for (let i = 0; i < alpha.length; i++) {
        alpha[i] = String.fromCharCode(Math.floor(Math.random() * 94) + 32)
    }
    return "~" + alpha.join('')
}

export default class Person {

    constructor() {
        this.personElement.classList.remove('hidden')

        this.personKey = generatePersonalKey()
        this.female = [true, false][Math.floor(Math.random() * 2)]

        this.DOB = randomDate(new Date(1942, 0, 1), new Date(2024, 0, 1))

        this.heartRate = gaussian(80, 14.5) + (this.getAge() - 50) / (randomNumberBetween(3, 8))
        this.bodyTemp = gaussian(37, 0.149) - ((this.getAge() - 50) / 100) * (-0.021)
        this.breathingRate = gaussian(14, 5);
        this.bloodPressure = gaussian(112, 10) + (this.getAge() - 50) / (randomNumberBetween(3, 8))

        this.phone = new Phone(this.personKey, this.DOB)
    }

    getAge() {
        let ageSeconds = (new Date(2042, 0, 1).getTime() - this.DOB.getTime())
        return Math.round(ageSeconds / 1000 / 60 / 60 / 24 / 365)
    }

    appearance(type) {
        let appearanceFn = function () {
            return Array()
        }
        if (type == 'video') {
            appearanceFn = personFn.videoAppearance
        } else if (type == 'audio') {
            appearanceFn = personFn.audioAppearance
        }
        return appearanceFn(this.personKey, [this.bodyTemp, this.bloodPressure, this.heartRate, this.breathingRate])
    }
}
    
function gaussian(mean, stdev) {
    let y2;
    let use_last = false;
    let y1;
    if (use_last) {
        y1 = y2;
        use_last = false;
    } else {
        let x1, x2, w;
        do {
            x1 = 2.0 * Math.random() - 1.0;
            x2 = 2.0 * Math.random() - 1.0;
            w = x1 * x1 + x2 * x2;
        } while (w >= 1.0);
        w = Math.sqrt((-2.0 * Math.log(w)) / w);
        y1 = x1 * w;
        y2 = x2 * w;
        use_last = true;
    }

    let retval = mean + stdev * y1;
    if (retval > 0)
        return retval;
    return -retval;
}