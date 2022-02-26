import CCTV from "./CCTV.js"
import CLOUD from "./CLOUD.js"
import Person from "./person.js"
import * as m from './myMaths.js'
import sensorFn from "./sensorFn.js"

const init_POPULATION = function(population_size) {
    const output = new Array()
    for (let i = 0; i < population_size; i++) {output.push(new Person())}
    return output
}

const instance = 60
const day_instances = 1440
const num_days = 30

const run_time = day_instances * num_days

const scene1 = MILA_SIMULATION(1, 3)
const data1 = scene1.vitals
const data1_ra = scene1.vital_trend

const trend = scene1.trend_track[scene1.trend_track.length - 1]

const rgrss_points = [[],[],[],[]]

// console.log(data1)
// console.log(data1_ra)

//const data2 = MILA_SIMULATION(1, 1)
//const data3 = MILA_SIMULATION(1, 5)

const data = [data1, data1_ra]//, data2]//, data3]

const BT_points = new Array(data.length)
const BP_points = new Array(data.length)
const HR_points = new Array(data.length)
const RR_points = new Array(data.length)

data.forEach((e,i) => {
    BT_points[i] = []
    BP_points[i] = []
    HR_points[i] = []
    RR_points[i] = []
})

const BT_series = new Array(data.length)
const BP_series = new Array(data.length)
const HR_series = new Array(data.length)
const RR_series = new Array(data.length)

for (let i = 0; i < data.length; i++) {
    data[i].forEach((point, idx) => {
        BT_points[i][idx] = {x: point[4], y: point[0]}
        BP_points[i][idx] = {x: point[4], y: point[1]}
        HR_points[i][idx] = {x: point[4], y: point[2]}
        RR_points[i][idx] = {x: point[4], y: point[3]}
    })
    BT_series[i] = {name: ('BT' + i), points: BT_points[i]}
    BP_series[i] = {name: ('BP' + i), points: BP_points[i]}
    HR_series[i] = {name: ('HR' + i), points: HR_points[i]}
    RR_series[i] = {name: ('RR' + i), points: RR_points[i]}
}

for (let i = 0; i < 4; i++) {
    rgrss_points[i][0] = {x: (trend[4] - 10), y: (trend[i][0]*(trend[4] - 10)+trend[i][1])}
    rgrss_points[i][1] = {x: trend[4], y: (trend[i][0]*(trend[4])+trend[i][1])}
}

BT_series.push({name: 'BT_Trend', points: rgrss_points[0]})
BP_series.push({name: 'BT_Trend', points: rgrss_points[1]})
HR_series.push({name: 'BT_Trend', points: rgrss_points[2]})
RR_series.push({name: 'BT_Trend', points: rgrss_points[3]})

JSC.Chart('chartBT', {
    series: BT_series
});
JSC.Chart('chartBP', {
    series: BP_series
});
JSC.Chart('chartHR', {
    series: HR_series
});
JSC.Chart('chartRR', {
    series: RR_series
});

//RUN    NUR\\    //RUN    NUR\\    //RUN    NUR\\    //RUN    NUR\\    //RUN    NUR\\    //RUN    NUR\\    //RUN    NUR\\

export function MILA_SIMULATION(population_size, vpd) {
    const population = init_POPULATION(population_size)
    population[0].vitals = [40, 110, 80, 15]

    const video_per_day = vpd //NOT 7 OR 11!
    let day = 0

    for (let time = 1; time <= run_time; time++) {
        if (day == 20) {
            population[0].vitals[0] = 44
            population[0].vitals[3] = 13.5
        }

        if (time % (day_instances/video_per_day) == 0) {
            const situ = Math.random()

            for (let frame = 0; frame < (instance*5); frame++) {
                population.forEach(person => {
                    person.phone.drive.video.push(sensorFn.FRAME([person.appearance('video', situ)], 100))
                    person.phone.drive.audio.push(sensorFn.FRAME([person.appearance('audio', situ)], 100))
                })
            }
        }

        population.forEach(person => {
            for (let i = 0; i < (instance / 12); i++) {
                person.phone.PROCESS_DATA()
            }
        })

        if (time % day_instances == 0) {
            population.forEach(person => {
                person.phone.PROCESS_VITALS(day)
                person.phone.ROLLING_AVERAGE(day, 10)
                person.phone.DETECT_TREND(day, 10)
            })
            console.log(day)
            day ++
        }
    }

    return population[0].phone.drive
}
