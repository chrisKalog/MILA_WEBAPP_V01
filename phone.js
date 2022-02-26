import phoneFn from "./phoneFn.js"
import CLOUD from "./CLOUD.js"
import * as m from './myMaths.js'

const process_noisiness = 8

const standardise = function(vitals, MEAN_SD) {
    const output = new Array(4)
    for (let i = 0; i < 4; i++) {
        output[i] = (vitals[i] - MEAN_SD[i][0]) / MEAN_SD[i][1]
    }
    return output
}

export default class Phone {
    constructor(personKey, DOB) {
        this.SPECS= {
            'storage':[1,2,4,8][Math.floor(Math.random()*4)],
            'cores':[4,8,16,32][Math.floor(Math.random()*4)],
            'clockSpeed':Math.floor(Math.random()*500+300)/100
        }
        this.drive = {
            'personKey': personKey,
            'video': new Array(),
            'audio': new Array(),
            'vitals': new Array(),
            'vitals_TEMPSTORAGE': new Array(),
            'conditions': new Object(),
            'MILA_param': new Object(),
            'DOB': DOB,
            'diagnoses_data': new Array(),
            'vital_trend': new Array(),
            'trend_track': new Array()
        }
        this.ALGORITHMS = {
            'humanRecognition': phoneFn.humanRecognition,
            'identify': phoneFn.identify,
            'extractVitals': phoneFn.extractVitals
        }
        this.NEW_PARAM = 0
    }
    space(drive) {
        if (drive == 'video') {return new TextEncoder().encode(this.drive.video).length}
        if (drive == 'audio') {return new TextEncoder().encode(this.drive.audio).length}
        if (drive == 'total') {return new TextEncoder().encode(this.drive.video).length + new TextEncoder().encode(this.drive.audio).length}
    }
    getAge() {
        let ageSeconds = (new Date(2042, 0, 1).getTime() - this.drive.DOB.getTime())
        return Math.round(ageSeconds / 1000 / 60 / 60 / 24 / 365)
    }
    TRAIN_MILA (diagnoses_data) {
        const vitals = diagnoses_data[0]   
        const diagnoses = diagnoses_data[1]

        for (let i = 0; i < 5e7; i++) {i**2}

        this.drive.MILA_param = this.drive.MILA_param
        
        this.TRAIN_MILA ++
    }
    MILA_MODEL() {
        this.drive.MILA_param = CLOUD.GET_MILA_PARAM()
        const param = this.drive.MILA_param
        const x = standardise(this.drive.vitals, CLOUD.MEAN_SD)

        const conditions = new Object()
        const age = this.getAge()/100
        for (const model in param) {
            const w = param[model].weight
            const p = param[model].power
            conditions[model] = w[0]*(x[0]**p[0]) + w[1]*(x[1]**p[1]) + w[2]*(x[2]**p[2]) + w[3]*(x[3]**p[3]) + w[4]*age + w[5]
        }

        this.drive.conditions = conditions
    }  
    PROCESS_DATA() {
        if (this.drive.video[0]) {
            const recognisedHumans = this.ALGORITHMS.humanRecognition(this.drive.video[0])
            if (recognisedHumans.length > 0) {
                const data = this.ALGORITHMS.identify(this.drive.personKey, recognisedHumans)
                if (data) {
                    let extractedVitals = this.ALGORITHMS.extractVitals(data, CLOUD.PARAM)
                    extractedVitals.forEach((ele, i) => {extractedVitals[i] += m.gaussian(0, CLOUD.MEAN_SD[i][1] / process_noisiness)})
                    this.drive.vitals_TEMPSTORAGE.push(extractedVitals)
                }
            }
            this.drive.video.shift()
        }
        if (this.drive.audio[0]) {
            const recognisedHumans = this.ALGORITHMS.humanRecognition(this.drive.audio[0])
            if (recognisedHumans.length > 0) {
                const data = this.ALGORITHMS.identify(this.drive.personKey, recognisedHumans)
                if (data) {
                    let extractedVitals = this.ALGORITHMS.extractVitals(data, CLOUD.PARAM)
                    extractedVitals.forEach((ele, i) => {extractedVitals[i] += m.gaussian(0, CLOUD.MEAN_SD[i][1] / process_noisiness)})
                    this.drive.vitals_TEMPSTORAGE.push(extractedVitals)
                }
            }
            this.drive.audio.shift()
        }
    }
    PROCESS_VITALS(time_stamp) {
        const these_vitals = new Array(4)
        if (this.drive.vitals_TEMPSTORAGE.length > 0) {
            const vitals_TEMP = [[0,0],[0,0],[0,0],[0,0]]

            Array.prototype.forEach.call(this.drive.vitals_TEMPSTORAGE, vitals => {
                vitals_TEMP.forEach((vital, index) => {
                    if (vitals[index] > 0 && vitals[index] < 200) {
                        vital[0] += vitals[index]
                        vital[1]++
                    }
                })
            })

            for (let i = 0; i < 4; i++) {
                these_vitals[i] = m.sf((vitals_TEMP[i][0] / vitals_TEMP[i][1]), 5)
            }
        }
        if (these_vitals[0] && these_vitals[1] && these_vitals[2] && these_vitals[3]) {
            these_vitals.push(time_stamp)
            this.drive.vitals.push(these_vitals)
            this.drive.vitals_TEMPSTORAGE = new Array()
        }
        this.drive.audio = new Array()
        this.drive.video = new Array()
    }
    ROLLING_AVERAGE(time, span) {
        if (this.drive.vitals.length >= span) {
            Array.prototype.forEach.call(this.drive.vitals, (vital, idx) => {
                if (vital[4] == time) {
                    const avg_vitals = [undefined, undefined, undefined, undefined, time]
                    for (let v = 0; v < 4; v++) {
                        let temp = 0
                        for (let i = 0; i < span; i++) {
                            temp += this.drive.vitals[idx - i][v]
                        }
                        avg_vitals[v] = m.sf(temp/span, 5)
                    }
                    this.drive.vital_trend.push(avg_vitals)
                }
            })
        }
    }
    DETECT_TREND(time, span) {
        Array.prototype.forEach.call(this.drive.vital_trend, (vital, index) => {
            if (index >= span -1 && vital[4] == time) {
                this.drive.trend_track.push([])
                for (let V = 0; V < 4; V++) {
                    let U = [[vital[4], 1]]
                    let Y = [vital[V]]
                    for (let i = 1; i < span; i++) {
                        U[i] = [this.drive.vital_trend[index - i][4], 1]
                        Y[i] = this.drive.vital_trend[index - i][V]
                    }
                    const theta = m.mul2(m.mul(m.invs(m.mul(m.tran(U), U)), m.tran(U)), Y)
                    this.drive.trend_track[this.drive.trend_track.length - 1][V] = theta
                }
                this.drive.trend_track[this.drive.trend_track.length - 1][4] = vital[4]
            }
        })
    }
    DETECT_TREND__(time, span) {
        if (this.drive.vital_trend.length >= span) {
            if (this.drive.trend_track[this.drive.trend_track.length - 1][4] < time) {

            }
        }
    }
}