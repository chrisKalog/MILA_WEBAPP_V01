import phoneFn from "./phoneFn.js"
import CLOUD from "./CLOUD.js"
import * as maths from './maths.js'

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
            'vitals': new Array(4),
            'conditions': new Object(),
            'MILA_param': new Object(),
            'DOB': DOB,
            'diagnoses_data': new Array()
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
    PROCESS_VITALS() {
        this.drive.MILA_param = CLOUD.GET_MILA_PARAM()
        const param = this.drive.MILA_param
        const x = standardise(this.drive.vitals, CLOUD.MILA_MEAN_SD)

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
        const stdDev = [0.5, 3, 3, 1]
        const modifier = [1000, 100, 100, 1000]

        let recognisedHumans_TEMPSTORAGE = new Array()
        Array.prototype.forEach.call(this.drive.video, (frame, index) => {
            recognisedHumans_TEMPSTORAGE.push(this.ALGORITHMS.humanRecognition(frame))

            //console.log('Finding Faces: ' + Math.round((index/this.drive.video.length)*100) + '%')
        })

        let data_TEMPSTORAGE = new Array()
        if (recognisedHumans_TEMPSTORAGE.length > 0) {
            recognisedHumans_TEMPSTORAGE.forEach((recognisedHumans, index) => {
                data_TEMPSTORAGE.push(this.ALGORITHMS.identify(this.drive.personKey, recognisedHumans))

                //console.log('Facial Recognition: ' + Math.round((index/recognisedHumans_TEMPSTORAGE.length)*100) + '%')
            })
        }
        let vitals_TEMPSTORAGE = new Array()
        data_TEMPSTORAGE.forEach((data, index) => {
            if (data) {
                let extractedVitals = this.ALGORITHMS.extractVitals(data, CLOUD.PARAM)
                extractedVitals.forEach((ele, i) => {extractedVitals[i] += (gaussian(100, 0.5)-100)})
                vitals_TEMPSTORAGE.push(extractedVitals)

                //vitals_TEMPSTORAGE.push(this.ALGORITHMS.extractVitals(data, CLOUD.PARAM))
                //console.log('Extracting Vitals: ' + Math.round((index/data_TEMPSTORAGE.length)*100) + '%')
            }
        })

        recognisedHumans_TEMPSTORAGE = new Array()
        Array.prototype.forEach.call(this.drive.audio, (frame, index) => {
            recognisedHumans_TEMPSTORAGE.push(this.ALGORITHMS.humanRecognition(frame))

            //console.log('Finding Voices: ' + Math.round((index/this.drive.audio.length)*100) + '%')
        })
        data_TEMPSTORAGE = new Array()
        if (recognisedHumans_TEMPSTORAGE.length > 0) {
            recognisedHumans_TEMPSTORAGE.forEach((recognisedHumans, index) => {
                data_TEMPSTORAGE.push(this.ALGORITHMS.identify(this.drive.personKey, recognisedHumans))

                //console.log('Voice Recognition: ' + Math.round((index/recognisedHumans_TEMPSTORAGE.length)*100) + '%')
            })
        }
        data_TEMPSTORAGE.forEach((data, index) => {
            if (data) {
                let extractedVitals = this.ALGORITHMS.extractVitals(data, CLOUD.PARAM)
                extractedVitals.forEach((ele, i) => {extractedVitals[i] += (gaussian(100, 0.5)-100)})
                vitals_TEMPSTORAGE.push(extractedVitals)

                //vitals_TEMPSTORAGE.push(this.ALGORITHMS.extractVitals(data, CLOUD.PARAM))
                //console.log('Extracting Vitals: ' + Math.round((index/data_TEMPSTORAGE.length)*100) + '%')
            }
        })

        this.drive.audio = new Array()
        this.drive.video = new Array()
        
        const vitals_TEMP = [[0,0],[0,0],[0,0],[0,0]]

        vitals_TEMPSTORAGE.forEach((vitals) => {
            vitals_TEMP.forEach((vital, index) => {
                if (vitals[index] > 0 && vitals[index] < 200) {
                    vital[0] += vitals[index]
                    vital[1]++
                }
            })
        })

        for (let i = 0; i < 4; i++) {
            this.drive.vitals[i] = Math.round((vitals_TEMP[i][0] / vitals_TEMP[i][1])*modifier[i])/modifier[i]
        }
        
        vitals_TEMPSTORAGE = undefined
        data_TEMPSTORAGE = undefined
        recognisedHumans_TEMPSTORAGE = undefined  
    }
}