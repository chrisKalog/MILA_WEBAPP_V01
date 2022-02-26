import Phone from "./phone.js"
import personFn from "./personFn.js"
import CLOUD from "./CLOUD.js"
import * as m from './myMaths.js'

let start_V = 0.005

const situation_randomness = 3
const vitals_randomness = 8

const generatePersonalKey = function () {
    let alpha = new Array(7)
    for (let i = 0; i < alpha.length; i++) {
        alpha[i] = String.fromCharCode(Math.floor(Math.random() * 94) + 32)
    }
    return "~" + alpha.join('')
}

export default class Person {

    constructor() {
        this.personKey = generatePersonalKey()
        this.female = [true, false][Math.floor(Math.random() * 2)]

        this.DOB = m.randomDate(new Date(1942, 0, 1), new Date(2024, 0, 1))

        this.vitals = new Array(4)

        for (let i = 0; i < 4; i++) {
            this.vitals[i] = m.sf(m.gaussian(CLOUD.MEAN_SD[i][0], CLOUD.MEAN_SD[i][1]/ vitals_randomness), 5)
        }

        this.phone = new Phone(this.personKey, this.DOB)

        this.situation = {
            key: undefined,
            modifier: new Array(4)
        }
    }

    getAge() {
        let ageSeconds = (new Date(2042, 0, 1).getTime() - this.DOB.getTime())
        return Math.round(ageSeconds / 1000 / 60 / 60 / 24 / 365)
    }

    appearance(type, situation_key) {
        if (this.situation.key !== situation_key) {
            this.situation.key = situation_key
            for (let i = 0; i < 4; i++) {
                this.situation.modifier[i] = m.gaussian(0, CLOUD.MEAN_SD[i][1] / situation_randomness)
            }
        }

        let appearanceFn = new Function()
        if (type == 'video') {
            appearanceFn = personFn.videoAppearance
        } else if (type == 'audio') {
            appearanceFn = personFn.audioAppearance
        }
        const situ_vitals = new Array(4)
        for (let i = 0; i < 4; i++){
            situ_vitals[i] = this.vitals[i] + this.situation.modifier[i]
        }
        return appearanceFn(this.personKey, situ_vitals)
    }
    QUICK_CONDITION (){
        const current_vitals = this.vitals
        let cond_vitals = current_vitals

        for (let i = 0; i < 4; i++) {
            const rand_idx = Math.round(Math.random()*3)
            cond_vitals[rand_idx] = m.sf(current_vitals[rand_idx] + m.gaussian(0, CLOUD.MEAN_SD[rand_idx][1]), 5)
        }
        console.log('OLD: ' + current_vitals + '   NEW: ' + cond_vitals)
        this.vitals = cond_vitals
    }
}